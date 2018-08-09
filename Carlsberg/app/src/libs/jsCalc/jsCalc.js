/**
* @namespace
*/
define(['./workbook', './parseUtils', '../numeral/numeral', '../promise-js/promise'], function (calcWorkbook, parseUtils, numeral, promise) {
    var jsCalcVersion = 0.022;
    //IE8 lacks Array.isArray
    if (!window.isArray) {
        window.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    }
    /**
    * jsCalc constructor
    * @constructor
    * @name jsCalc
    * @param params Constructor parameter object
    * @param params.model Model JSON object.  Mutually exclusive with modelURL
    * @param params.modelURL URL to model JSON.  Mutually exclusive with model
    * @param params.loadCallback Callback to call once model is done loading
    * @param params.buildProgressCallback Callback to call during build, passes progress information
    * @param params.buildAsync Build model asynchronously (defaults to true)
    * @param params.customActions Custom actions defined for this course
    */
    jsCalc = function (params) {
        this.versionNumber = jsCalcVersion;
        this.periodName = params.hasOwnProperty("periodName") ? params.periodName : 'xxYear';
        this.curPeriod = -1;
        this.loadCallback = params.loadCallback;
        this.buildProgressCallback = params.buildProgressCallback ? params.buildProgressCallback : null;
        this.modelURL = params.modelURL ? params.modelURL : null;
        this.model = params.model ? params.model : null;
        this.buildAsync = params.hasOwnProperty("buildAsync") ? params.buildAsync : true;
        this.workbook = null;
        this.ready = false;
        this.calculationCallbacks = [];
        this.singletonCalculationCallbacks = [];
        this.courseActions = params.customActions ? params.customActions : null;
        this.stateVariables = {};
        this.historicalData = {};
        var self = this;
        if (this.modelURL && this.loadCallback) {
            $.ajax({
                url: this.modelURL,
                dataType: 'json',
                complete: function (response) {
                    self.model = response.responseJSON;
                    self.buildFromJSON();
                },
                error: onError
            });
            //this.workbook = new calcWorkbook(this.modelURL);
            this.initialized = true;
        } else if (this.model && this.loadCallback) {
            this.buildFromJSON();
            this.initialized = true;
        }
    };

    function onError(e) {
        alert("Error: " + e.toString());
    }

    /**
    * Sets a callback that will fire after the next recalculate and then will be removed.
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param nextRecalcFunc Function to call.
    */
    jsCalc.prototype.onNextRecalculate = function (nextRecalcFunc) {
        this.singletonCalculationCallbacks.push(nextRecalcFunc);
    };

    /**
    * Sets a callback that will fire after the next recalculate and then will be removed.
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param nextRecalcFunc Function to call.
    */
    jsCalc.prototype.completeCalculation = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!self.workbook.calculationPending() && self.ready) {
                resolve();
            } else {
                self.singletonCalculationCallbacks.push(function () {
                    self.completeCalculation().then(resolve);
                });
            }
        });
    };

    jsCalc.prototype.buildFromJSON = function (json) {
        var self = this;
        this.workbook = new calcWorkbook({
            modelJSON: this.model,
            buildProgressCallback: function (e) {
                self.onBuildProgress(e);
            },
            buildAsync: this.buildAsync
        });
        var self = this;
        this.workbook.onCalculationDone(function () {
            self.curPeriod = self.getRawValue(self.periodName);
            self.workbook.onCalculationDone([self, jsCalc.onCalculationDone]);
            self.loadCallback();
        });
        this.ready = true;
    }

    /**
    * Resets the model by rebuilding it
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param params Constructor parameter object
    * @param params.loadCallback Callback to call once model is done loading
    * @param params.buildProgressCallback Callback to call during build, passes progress information
    */
    jsCalc.prototype.reset = function (params) {
        var self = this;
		this.ready = false;
        params = params ? params : {};
        this.loadCallback = params.loadCallback;
        this.buildProgressCallback = params.buildProgressCallback ? params.buildProgressCallback : null;

        this.workbook.init({ buildProgressCallback: function (e) {
            self.onBuildProgress(e);
        },
            buildAsync: this.buildAsync
        });
        var self = this;
        this.workbook.onCalculationDone(function () {
            self.workbook.onCalculationDone([self, jsCalc.onCalculationDone]);
			self.ready = true;
            self.loadCallback();
        });
    }



    /**
    * Sets the value of cells specified by rangeID
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param rangeID Excel compatible range specifier (valid rangename or address)
    * @param value Value to set range to (if rangeID is a single cell) or a 2-dimensional array of values (of form [[r0c0, r0c1, ..., r0cn], [r1c0, r1c1, ..., r1cn], ..., [rnc0, rnc1, ..., rncn]]).  Array should only be used if the rangeID describes a multi-cell range
    */
    jsCalc.prototype.setValue = function (rangeID, value) {
        var targRange = this.getRangeRef(rangeID);
        if (!targRange) return null;


        if (window.isArray(value)) {
            //multiple cell set
            var endRow = targRange.h > value.length ? value.length : targRange.h;
            for (var r = 0; r < endRow; r++) {
                if (window.isArray(value[r])) {
                    var endCol = targRange.w > value[r].length ? value[r].length : targRange.w;
                    for (var c = 0; c < endCol; c++) {
                        //var curRef = targRange.fullIndex(r, c);
                        var targetRow = targRange.startRow + r;
                        var targetCol = targRange.startCol + c;

                        var address = targRange.targetSheetOb.name + "!R" + targetRow + "C" + targetCol;
                        this.setValue(address, value[r][c]);
                    }
                }
            }

        } else {
            //force state storage via individual cells to avoid aliasing issues
            var targRangeAddressString = targRange.targetSheetOb.name + "!R" + targRange.startRow + "C" + targRange.startCol;
            if (value == null) value = '';
            
            // test if there are any alphabetic characters in the value 
            var regEx = new RegExp(/[A-z]/i);
            if (typeof (value) == "string" && !regEx.test(value)) { // if no alphabets try and convert it to a number
                var parsedVal = parseFloat(value); //numeral().unformat(value);
                if (!isNaN(parsedVal) && !isNaN(Number(value))) value = parsedVal;
            }
            this.stateVariables[targRangeAddressString] = value;
            //if(!targRange.get(0).isEmpty) {
            targRange.get(0).setValue(value);
            //}
        }
        return this.completeCalculation();
    }

    /**
    * Gets the value of cell[s] specified by rangeID.   Returns either a single value (as a numeric value, if numeric) or an array depending on whether rangeID describes a single cell or a multi-cell range
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param rangeID Excel compatible range specifier (valid rangename or address)
    */
    jsCalc.prototype.getRawValue = function (rangeID) {
        /*var targRange = null;
        if(this.workbook.isNamedRange(rangeID)) {
        targRange = this.workbook.getRange(rangeID);
        } else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
        var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
        targRange = this.workbook.getRangeReferenceByAddress(rangeSpecifierOb);
        }
        if(!targRange) return -1;
        return targRange.v();*/
        var sourceRangeRef = this.getRangeRef(rangeID);
        /*var out = [];
        sourceRangeRef.eachCell(function() {
        var nf = this.nf;
        var val = this.v();
			
        });*/
        if (!sourceRangeRef) return null;
        var out = sourceRangeRef.valueArray();
        if (out.length == 1 && out[0].length == 1) return out[0][0];
        return out;
    }

    /**
    * Gets the value of cell[s] specified by rangeID.   Returns either a single value as a formatted string or an array depending on whether rangeID describes a single cell or a multi-cell range
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param rangeID Excel compatible range specifier (valid rangename or address)
    * @param period Optional period to retrieve historical data
    */
    jsCalc.prototype.getValue = function (rangeID, period) {
        if (period != 0 && period !== undefined && period.toString() != this.curPeriod.toString()) {
            if (period < 0) {
                //years prior, otherwise treat as absolute
                period = this.curPeriod + period;
            }
            return this.getHistoricalValue(rangeID, period);
        }
        /*var targRange = null;
        if(this.workbook.isNamedRange(rangeID)) {
        targRange = this.workbook.getRange(rangeID);
        } else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
        var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
        targRange = this.workbook.getRangeReferenceByAddress(rangeSpecifierOb);
        }
        if(!targRange) return -1;
        return targRange.v();*/
        var sourceRangeRef = this.getRangeRef(rangeID);
        if (!sourceRangeRef) return null;
        if (sourceRangeRef.h == 1 && sourceRangeRef.w == 1) {
            var curCell = sourceRangeRef.getSingleCellReference();
            var nf = curCell.nf;
            var val = curCell.v();
            if (!isNaN(parseFloat(val))) {
                var nfCode = nf;
                if (nf == 'General') nfCode = '0,0';
                var string = numeral(val).format(nfCode);
                return string;
            } else {
                return val;
            }
        } else {
            /*var out = [];
            var curOut = [];
            var numProcessed = 0;
            sourceRangeRef.eachCell(function() {
            var nf = this.nf;
            var val = this.v();
            if(parseFloat(val)) {
            var nfCode = nf;
            if (nf == 'General') nfCode = '0,0';
            var string = numeral(val).format(nfCode);
            curOut.push(string);
            } else {
            curOut.push(val);
            }
            numProcessed++;
            if(numProcessed % sourceRangeRef.
            });*/
            var out = sourceRangeRef.valueArray();
            //if(out.length == 1  && out[0].length == 1) return out[0][0];
            return out;
        }
    }


    /**
    * Gets the value of cell[s] specified by rangeID for the selected period.   Returns either a single value as a formatted string or an array depending on whether rangeID describes a single cell or a multi-cell range
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param rangeID Excel compatible range specifier (valid rangename or address)
    */
    jsCalc.prototype.getHistoricalValue = function (rangeID, period) {
        if (this.historicalData[period]) {
            if (this.historicalData[period].hasOwnProperty(rangeID)) {
                return this.historicalData[period][rangeID];
            } else {
                return "N/A";
            }
        } else {
            return "N/A";
        }
    }

    /**
    * Gets the value of cells specified by rangeID for use as a data series. This will force the values to return as a one-dimensional array (adding the data row by row to the output)
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param rangeID Excel compatible range specifier (valid rangename or address)
    * @param period Optional period to retrieve historical data
    */
    jsCalc.prototype.getSeriesValue = function (rangeID, period) {

        if (period != 0 && period !== undefined && period.toString() != this.curPeriod.toString()) {
            if (period < 0) {
                //years prior, otherwise treat as absolute
                period = this.curPeriod + period;
            }
            var out = this.getHistoricalValue(rangeID, period);
            if (!window.isArray(out)) return [out];
            var outArr = [];
            for (var i = 0; i < out.length; i++) {
                var curRow = out[i];
                if (!window.isArray(curRow)) {
                    outArr.push(curRow);
                    continue;
                }
                for (var j = 0; j < curRow.length; j++) {
                    var curVal = curRow[j];
                    outArr.push(curVal)
                }
            }
            return outArr;
        }

        var sourceRangeRef = this.getRangeRef(rangeID);
        if (!sourceRangeRef) return null;
        if (sourceRangeRef.h == 1 && sourceRangeRef.w == 1) {
            var curCell = sourceRangeRef.getSingleCellReference();
            var val = curCell.v();
            return [val];
        } else {
            var out = [];
            sourceRangeRef.eachCell(function () {
                out.push(this.v());
            });
            return out;
        }
    }



    /**
    * Adds a callback to fire when calculation is complete.  Will fire after the completion of every calculation.  Multiple callbacks can be added.
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param cbFunc Function to call
    */
    jsCalc.prototype.addCalculationCallback = function (cbFunc) {
        var found = false;
        for (var i = 0; i < this.calculationCallbacks.length; i++) {
            if (jsCalc.cbCompare(this.calculationCallbacks[i], cbFunc)) found = true;
        }
        if (!found) {
            this.calculationCallbacks.push(cbFunc);
        }
    }

    /**
    * Removes a previously set recurring calculation callback
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param cbFunc Callback function to remove
    */
    jsCalc.prototype.removeCalculationCallback = function (cbFunc) {
        for (var i = 0; i < this.calculationCallbacks.length; i++) {
            if (jsCalc.cbCompare(this.calculationCallbacks[i], cbFunc)) {
                this.calculationCallbacks.splice(i, 1);
                i--;
            }
        }
    }

    /**
    * Runs the named course action (which was defined in a custom action passed to the constructor)
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param cbFunc Callback function to remove
    * @returns Promise indicating completion of course action (and any recalculations if necessary)
    */
    jsCalc.prototype.runCourseAction = function (actionName) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.courseActions[actionName]) {
                var prom = self.courseActions[actionName].call(self);
                prom.then(function () {
                    resolve();
                });

            } else {
                reject();
            }
        });
    }


    /**
    * Gets an object describing all cells that have been changed from the base state of the simulation as well as all historical data
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    */
    jsCalc.prototype.getFullState = function () {
        var outOb = {};
        outOb.cells = {};
        for (var trackedCell in this.stateVariables) {
            var trackedVal = this.getRawValue(trackedCell);
            outOb.cells[trackedCell] = trackedVal.toString();
        }
        outOb.historicalData = this.historicalData;
        return outOb;
    }

    /**
    * Gets an object describing all cells that have been changed from the base state of the simulation
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    */
    jsCalc.prototype.getState = function () {
        var outOb = {};
        outOb = {};
        for (var trackedCell in this.stateVariables) {
            var trackedVal = this.getRawValue(trackedCell);
            outOb[trackedCell] = trackedVal.toString();
        }
        return outOb;
    }

    /**
    * Gets an object describing all cells that have been changed from the base state of the simulation
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    */
    jsCalc.prototype.getHistoricalState = function () {
        var outOb = {};
        outOb.cells = {};
        outOb = this.historicalData;
        return outOb;
    }

    /**
    * Gets a JSON string representing an object describing all cells that have been changed from the base state of the simulation
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    */
    jsCalc.prototype.getJSONState = function () {
        return JSON.stringify(this.getState());
    }

    /**
    * Sets the simulation state to the state described by stateObject.  This will reset and rebuild the model as part of the process.
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param stateObject An object describing all cells that have been changed from the base state of the simulation
    * @param callback Function to call once rebuild is complete and state has been set
    */
    jsCalc.prototype.setState = function (state, historicalState, callback) {

        var stateObject = {};
        stateObject.cells = state;
        if (historicalState === undefined || historicalState === null) {
            stateObject.historicalData = {};
        } else {
            stateObject.historicalData = historicalState;
        }
        var setCallback = callback;
        this.reset({
            loadCallback: function () {
                for (cellAddress in stateObject.cells) {
                    var targRange = this.getRangeRef(cellAddress);
                    targRange.get(0).setValue(stateObject.cells[cellAddress]);
                }
                this.historicalData = stateObject.historicalData;
                this.stateVariables = stateObject.cells;
                if (setCallback) setCallback();
            }
        });
    }

    /**
    * Sets the simulation state to the state described by stateObject.  This will reset and rebuild the model as part of the process.
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param stateJSON A JSON string representing an object describing all cells that have been changed from the base state of the simulation
    * @param callback Function to call once rebuild is complete and state has been set
    */
    jsCalc.prototype.setJSONState = function (stateJSON, callback) {
        var stateOb = JSON.parse(stateJSON);
        this.setState(stateOb, callback);
    }



    /**
    * Copies the values from sourceDataRange into the equivalent cells offset from the top-left of destination range.  Currently will not paste over formulas.  This function is intended to enable implementing custom course actions - If you are using it in a different context then you should consider implementing what you are doing as a course action instead.  While this can be called with exactly the same source and destination, avoid calling it for overlapping but nonidentical ranges as behavior may be unpredictable.
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param sourceDataRange Excel compatible range specifier (valid rangename or address) specifying which cells to copy data from
    * @param destinationRange Excel compatible range specifier (valid rangename or address) specifying where to paste the values from the source range.  Only the top left cell of this range is relevant, as the cells will paste according to the size and shape of sourceDataRange
    */
    jsCalc.prototype.copyAndPasteByValue = function (sourceDataRange, destinationRange) {
        var sourceRangeRef = this.getRangeRef(sourceDataRange);
        var destinationRangeRef = this.getRangeRef(destinationRange);
        if (!sourceRangeRef || !destinationRangeRef) return -1;
        if (sourceRangeRef.count == 1) {
            //copy same value to every cell in destination
            var sourceValue = sourceRangeRef.getSingleCellReference().v();
            for (var i = 0; i < destinationRangeRef.count; i++) {
                this.setValue(destinationRangeRef.get(i).getSingleCellReference().address(), sourceValue);
            }
        } else {
            //get top left cell of destination range
            var destTopLeft = destinationRangeRef.getSingleCellReference();
            for (var r = 0; r < sourceRangeRef.h; r++) {
                for (var c = 0; c < sourceRangeRef.w; c++) {
                    var targetRow = destTopLeft.row + r;
                    var targetCol = destTopLeft.col + c;
                    var targetAddress = destTopLeft.worksheet.name + "!R" + targetRow + "C" + targetCol;

                    var sourceValue = sourceRangeRef.getCellByIndex(r, c).v();
                    this.setValue(targetAddress, sourceValue);
                }
            }

        }

    }

    /**
    * If name is a defined named range for the current model returns true, otherwise returns false
    * @public
    * @function
    * @instance
    * @memberOf jsCalc
    * @param name The name to test
    */
    jsCalc.prototype.isNamedRange = function (name) {
        return this.workbook.isNamedRange(name);
    }


    jsCalc.onCalculationDone = function () {
        this.curPeriod = this.getRawValue(this.periodName);
        for (var i = 0; i < this.singletonCalculationCallbacks.length; i++) {
            var cbOb = this.singletonCalculationCallbacks[i];
            if (cbOb.length >= 2 && typeof (cbOb[1]) == 'function') {
                cbOb[1].call(cbOb[0]);
            } else {
                cbOb();
            }
        }
        this.singletonCalculationCallbacks = [];
        /*while (this.calculationCallbacks.length > 100) {
        this.calculationCallbacks.shift();
        }*/
        for (var i = 0; i < this.calculationCallbacks.length; i++) {
            var cbOb = this.calculationCallbacks[i];
            if (cbOb.length >= 2 && typeof (cbOb[1]) == 'function') {
                cbOb[1].call(cbOb[0]);
            } else {
                cbOb();
            }
        }
    }

    jsCalc.prototype.getRangeRef = function (rangeID) {
        var targRange = null;
        if (this.workbook.isNamedRange(rangeID)) {
            targRange = this.workbook.getRange(rangeID);
        } else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
            var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
            targRange = this.workbook.getRangeReferenceByAddress(rangeSpecifierOb);
        }
        return targRange;
    }


    jsCalc.prototype.setBuildProgressCallback = function (cbFunc) {
        this.buildProgressCallback = cbFunc;
    }

    jsCalc.prototype.onBuildProgress = function (progOb) {
        if (this.buildProgressCallback) {
            this.buildProgressCallback(progOb);
        }
    }
    jsCalc.cbCompare = function (a, b) {
        if (typeof (a) == 'function' && typeof (b) == 'function') {
            return a == b;
        } else if (window.isArray(a) && window.isArray(b) && a.length >= 2 && b.length >= 2) {
            return a[0] == b[0] && a[1] == b[1];
        }
        else return false;
    }

    jsCalc.prototype.saveCurrentPeriodHistoricalData = function (periodRange) {
        var periodRangeName = periodRange ? periodRange : 'xxYear';
        var periodVal = this.getValue(periodRangeName);
        var tlOutputRegex = /^tlOutput.*$/i;
        var outputNames = this.workbook.getNames(tlOutputRegex);
        var curDataSet = {};
        for (var i = 0; i < outputNames.length; i++) {
            var curName = outputNames[i];
            curDataSet[curName] = this.getValue(curName);
            var curType = typeof (curDataSet[curName]);
            if (typeof (curDataSet[curName]) == 'object' && !window.isArray(curDataSet[curName])) {
                curDataSet[curName] = curDataSet[curName].data;
            }
        }
        this.historicalData[periodVal] = curDataSet;
    }


    //end primary API - remainder is advanced functionality (more internals access, primarily for model debugging tools)

    jsCalc.prototype.getBook = function () {
        return this.workbook;
    }

    jsCalc.prototype.isNamedRange = function (name) {
        return this.workbook.isNamedRange(name);
    }

    jsCalc.prototype.getFriendlyRangeName = function(address) {
        // fetch friendly name from workbook
        return this.workbook.getFriendlyName(address);
    }

    jsCalc.prototype.getNames = function(regExp) {
        return this.workbook.getNames(regExp)
    }

    jsCalc.prototype.addCourseActionBlock = function (actionObject) {
        for (actionName in actionObject) {
            this.addCourseAction(actionName, actionObject[actionName]);
        }
    };

    jsCalc.prototype.addCourseAction = function (name, actionFunction) {
        this.courseActions[actionName] = actionFunction;
    };

    return jsCalc;

});

//# sourceURL=jsCalc.js