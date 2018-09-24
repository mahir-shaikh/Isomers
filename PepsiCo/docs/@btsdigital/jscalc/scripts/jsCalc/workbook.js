define(['./worksheet', './ExpressionBuilder', './jsCalcValue', './animationUtilities', './parseUtils'], function (calcWorksheet, ExpressionBuilder, jsCalcValue, animationUtilities, parseUtils) {

	var calcWorkbook = function(params) {
		this.init(params);
		/*this.calculationBreakpointObject = null;
		this.workbookJson = params.modelJSON;
		this.buildAsync = params.buildAsync?true:false;
		this.buildProgressCallback = params.buildProgressCallback;
		this.name = this.workbookJson.name;
		this.buildErrors = [];
		this.calculationErrors = [];

		this.namedRanges = {};
		this.worksheets = {};
		this.valueCells = [];
		this.animFrameTimes = [];
		this.unsupportedFunctionList = {};
		this.calcCB = null;
		this.calculationTimePerFrame = 20; // in ms
		this.cellCount = 0;
		this.queueEmpty = true;
		this.startTime = 0;
		this.endTime = 0;
		this.calcTimeElapsed = 0;
		this.calcCount = 0;
		this.buildStartTime = new Date().getTime();
		this.buildQueue = [];
		this.buildStage = 0;
		this.numBuilt = 0;
		this.lotsOfParents = [];
		this.buildMessage = "Reticulating Splines";
		ExpressionBuilder.activeWorkbook = this;
		//need to create sheet objects before rangenames so that rangenames can have a target sheet object
		var self = this;
		for(worksheetName in this.workbookJson.worksheets) {
				this.worksheets[worksheetName] = new calcWorksheet(this, worksheetName);
			}
		this.initializeNamedRanges(this.workbookJson.namedRanges);

		if(!this.buildAsync) {


			for(worksheetName in this.workbookJson.worksheets) {
				this.worksheets[worksheetName].init(this.workbookJson.worksheets[worksheetName]);
				this.cellCount += this.worksheets[worksheetName].cellCount;
			}
			for(worksheetName in this.workbookJson.worksheets) {
				this.worksheets[worksheetName].initializeHierarchies();
			}

			this.calculationQueue = this.valueCells.slice(0);
			var self = this;
			this.nextAnimFrame = window.requestAnimationFrame(function() {
				self.processCalculation();
			});
		} else {


			this.buildQueue.push({
				buildFunc: function() {
					//reset progress
					self.buildStage = 1;
					self.numBuilt = 0;
					self.buildQueueOrigLength = self.cellCount + 1;
					self.buildMessage = "Building Cell Calculation Functions";
				}
			});

			for(worksheetName in this.workbookJson.worksheets) {
				this.buildQueue.push({
					buildFunc: function(sheetName) {
						self.worksheets[sheetName].init(self.workbookJson.worksheets[sheetName]);
						self.cellCount += self.worksheets[sheetName].cellCount;
					},
					args: worksheetName
				});
			}



			this.buildQueue.push({
				buildFunc: function() {
					//reset progress
					self.buildStage = 1;
					self.numBuilt = 0;
					self.buildQueueOrigLength = self.cellCount + 1;
					self.buildMessage = "Calculating cell hierarchies";
				}
			});

			for(worksheetName in this.workbookJson.worksheets) {

				this.buildQueue.push({
					buildFunc: function(args, ob) {
						self.asynchHierarchyBuildFunc(args, ob);
					},
					args: worksheetName
				});
			}
			this.buildQueue.push( {
					buildFunc: function() {
					self.calculationQueue = self.valueCells.slice(0);
					self.nextAnimFrame = window.requestAnimationFrame(function() {
					self.processCalculation();
				});
				},
			});
			this.nextAnimFrame = window.requestAnimationFrame(function() {
				self.asyncBuildWorkbook();
			});
			this.buildQueueOrigLength = this.buildQueue.length;
		}*/
	}

	/***
	* Initialize workbook object
	*/
	calcWorkbook.prototype.init = function(params) {
		if(!params) params = {};
		this.calculationBreakpointObject = null;
		if(params.modelJSON) {
			this.workbookJson = params.modelJSON;
		}
		if(this.nextAnimFrame) window.cancelAnimationFrame(this.nextAnimFrame);
		if(!this.workbookJson) return -1;
		this.buildAsync = params.buildAsync?true:false;
		this.buildProgressCallback = params.buildProgressCallback;
		this.name = this.workbookJson.name;
		this.buildErrors = [];
		this.calculationErrors = [];

		this.namedRanges = {};
		this.worksheets = {};
		this.valueCells = [];
		this.animFrameTimes = [];
		this.unsupportedFunctionList = {};
		this.calcCB = null;
		this.calculationTimePerFrame = 20; // in ms
		this.cellCount = 0;
		this.queueEmpty = true;
		this.startTime = 0;
		this.endTime = 0;
		this.calcTimeElapsed = 0;
		this.calcCount = 0;
		this.buildStartTime = new Date().getTime();
		this.buildQueue = [];
		this.buildStage = 0;
		this.numBuilt = 0;
		this.lotsOfParents = [];
		this.buildMessage = "Reticulating Splines";
		this.addressReference = {};
		ExpressionBuilder.activeWorkbook = this;
		//need to create sheet objects before rangenames so that rangenames can have a target sheet object
		var self = this;
		var worksheetName;
		for(worksheetName in this.workbookJson.worksheets) {
				this.worksheets[worksheetName] = new calcWorksheet(this, worksheetName);
			}
		this.initializeNamedRanges(this.workbookJson.namedRanges);

		if(!this.buildAsync) {

			for(worksheetName in this.workbookJson.worksheets) {
				this.worksheets[worksheetName].init(this.workbookJson.worksheets[worksheetName]);
				this.cellCount += this.worksheets[worksheetName].cellCount;
			}
			for(worksheetName in this.workbookJson.worksheets) {
				this.worksheets[worksheetName].initializeHierarchies();
			}

			this.calculationQueue = this.valueCells.slice(0);
			var self = this;
			this.nextAnimFrame = window.requestAnimationFrame(function() {
				self.processCalculation();
			});
		} else {
			this.buildQueue.push({
				buildFunc: function() {
					//reset progress
					self.buildStage = 1;
					self.numBuilt = 0;
					self.buildQueueOrigLength = self.cellCount + 1;
					self.buildMessage = "Building Cell Calculation Functions";
				}
			});

			for(worksheetName in this.workbookJson.worksheets) {
				this.buildQueue.push({
					buildFunc: function(sheetName) {
						self.worksheets[sheetName].init(self.workbookJson.worksheets[sheetName]);
						self.cellCount += self.worksheets[sheetName].cellCount;
					},
					args: worksheetName
				});
			}

			this.buildQueue.push({
				buildFunc: function() {
					//reset progress
					self.buildStage = 1;
					self.numBuilt = 0;
					self.buildQueueOrigLength = self.cellCount + 1;
					self.buildMessage = "Calculating cell hierarchies";
				}
			});

			for(worksheetName in this.workbookJson.worksheets) {
				this.buildQueue.push({
					buildFunc: function(args, ob) {
						self.asynchHierarchyBuildFunc(args, ob);
					},
					args: worksheetName
				});
			}
			this.buildQueue.push( {
					buildFunc: function() {
					self.calculationQueue = self.valueCells.slice(0);
					self.nextAnimFrame = window.requestAnimationFrame(function() {
					self.processCalculation();
				});
				},
			});
			this.nextAnimFrame = window.requestAnimationFrame(function() {
				self.asyncBuildWorkbook();
			});
			this.buildQueueOrigLength = this.buildQueue.length;
		}
	}

	/**
	* Does some construction and adds the build ob to the build queue
	*/
	calcWorkbook.prototype.asynchHierarchyBuildFunc = function(sheetName, buildOperationOb) {
		var curSheet = sheetName;
		this.worksheets[sheetName].initializeSingleCellHierarchyAsync();
		if(!this.worksheets[sheetName].hierarchyReady) {
			this.buildQueue.unshift(buildOperationOb);
		}
	}

	/**
	* Consumes build tasks from the build queue and runs them
	* until the allocated amount of time is used up, then returns control.
	*/
	calcWorkbook.prototype.asyncBuildWorkbook = function() {
		var startTime = new Date().getTime();
		while(new Date().getTime() - startTime <= this.calculationTimePerFrame && this.buildQueue.length > 0) {
			var curBuildOb = this.buildQueue.shift();
			//inc first so that if the build function resets it, it will actually be 0 after
			this.numBuilt++;
			curBuildOb.buildFunc(curBuildOb.args, curBuildOb);
		}
		if(this.buildProgressCallback) {
			var itemsDone = this.buildQueueOrigLength - this.buildQueue.length;
			var progOb = {
							numComplete: this.numBuilt,
							numTotal: this.buildQueueOrigLength,
							message: this.buildMessage + " (" + this.numBuilt + "/" + this.buildQueueOrigLength + ")",
							curStage: this.buildStage
						};
			this.buildProgressCallback(progOb);
		}
		var self = this;
		if(this.buildQueue.length > 0) {
			this.nextAnimFrame = window.requestAnimationFrame(function() {
				self.asyncBuildWorkbook();
			});
		} else {
			this.calculationQueue = this.valueCells.slice(0);
			this.nextAnimFrame = window.requestAnimationFrame(function() {
				self.processCalculation();
			});
		}
		//var endTime = new Date().getTime();
		//var elapsed = endTime - startTime;
		//var remainingCount = this.buildQueueOrigLength - this.numBuilt;
		//console.log("Remaining build queue length: " + remainingCount + " Current step took " + elapsed + "ms");
	}

	/**
	* Returns a bool indicating whether a calculation is pending and still incomplete
	*/
	calcWorkbook.prototype.calculationPending = function() {
		return this.calculationQueue.length > 0;
	}

	/**
	* Consumes uncalculated cells off of the calculation queue and calculates them.
	* Calculation will add more cells to the queue as a side effect
	* TODO: refactor that so that adding cells is not a side effect
	* because side effects are evil and I apologize for this one.
	*/
	calcWorkbook.prototype.processCalculation = function() {
		var startTime = new Date().getTime();
		if(this.calculationQueue.length > 0) {
			if(this.queueEmpty) {
				this.startTime = new Date().getTime();
				this.endTime = 0;
				this.calcTimeElapsed =0;
				this.calcCount = 0;
				this.queueEmpty = false;
			}
			while(new Date().getTime() - startTime <= this.calculationTimePerFrame && this.calculationQueue.length > 0) {
				var curCell = this.calculationQueue.shift();
				try {
					curCell.calculate();
				} catch (e) {
					this.calculationErrors.push(curCell.address() + ": " + e.message);
					var err = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.calc, curCell,  e.message);
					curCell.errorStatus = err;
				}
				this.calcCount++;
			}
			if(this.calculationQueue.length == 0) {

				this.endTime = new Date().getTime();
				this.calcTimeElapsed = this.endTime - this.startTime;
				this.queueEmpty = true;

				if(this.calcCB) {
					if(this.calcCBOb) {
						this.calcCB.call(this.calcCBOb);
					} else {
						this.calcCB();
					}
				}
				//dispatch calculation finished event
			}
		}
		var self = this;
		this.nextAnimFrame = window.requestAnimationFrame(function() {
			self.processCalculation();
		});
	}

	/**
	* Calculates all uncalculated cells, synchronously.
	* This will block UI from functioning, so should only be used if that's not
	* an important consideration.
	*/
	calcWorkbook.prototype.forceCalculate = function() {
		this.startTime = new Date().getTime();
		this.calcCount = 0;
		var timeOut = 20000;
		while(this.calculationQueue.length > 0 && new Date().getTime() - this.startTime < timeOut) {
			var curCell = this.calculationQueue.shift();
			curCell.calculate();
			this.calcCount++;
			if(this.calculationQueue.length == 0) {
				this.endTime = new Date().getTime();
				this.calcTimeElapsed = this.endTime - this.startTime;
				if(this.calcCB) {
					if(this.calcCBOb) {
						this.calcCB.call(this.calcCBOb);
					} else {
						this.calcCB();
					}
				}
			}

		}

	}

	/**
	* Executes the calculation done callback if it exists
	*
	*/
	calcWorkbook.prototype.onCalculationDone = function(calcCB) {
		if(calcCB.length && calcCB.length >=2 && typeof(calcCB[1]) == 'function') {
			this.calcCBOb = calcCB[0];
			this.calcCB = calcCB[1];
		} else {
			this.calcCBOb = null;
			this.calcCB = calcCB;
		}
	}

	/**
	* Creates named range reference values and put them in the calcWorkbook.namedRanges
	* lookup table (hash table)
	*
	*/
	calcWorkbook.prototype.initializeNamedRanges = function(namedRangeJson) {
		for(var namedRange in namedRangeJson) {
			var namedRangeOb = namedRangeJson[namedRange];
			var startRow = namedRangeOb.startRow;
			var startCol = namedRangeOb.startCol;
			var endRow = namedRangeOb.endRow?namedRangeOb.endRow: startRow;
			var endCol = namedRangeOb.endCol?namedRangeOb.endCol: startCol;
			var targetSheet = namedRangeOb.worksheet?namedRangeOb.worksheet: null;
			var refOb = jsCalcValue.ReferenceValue(startRow, startCol, endRow, endCol, {workbook: this}, targetSheet);
			var addressRef = (startRow === endRow && startCol === endCol) ? (targetSheet + '!' + "R" + startRow + "C" + endCol) : (targetSheet + '!' + "R" + startRow + "C" + startRow + ":R" + endRow + "C" + endCol);
			this.namedRanges[namedRange] = refOb;

			this.addressReference[addressRef] = namedRange;
		}
	}

	/**
	* Utility function to get range value from a range specifier object
	*/
	calcWorkbook.prototype.getRangeReferenceByAddress = function(rangeSpecifierOb) {
			var refOb = jsCalcValue.ReferenceValue(rangeSpecifierOb.startRow, rangeSpecifierOb.startCol, rangeSpecifierOb.endRow, rangeSpecifierOb.endCol, {workbook: this}, rangeSpecifierOb.sheetName);
			return refOb;
	}

	/**
	* Utility function to get a range value from a valid range id (can be an address or a named range)
	*/
	calcWorkbook.prototype.getRange = function(rangeID) {
		if(this.namedRanges[rangeID]) {
			return this.namedRanges[rangeID];
		} else {
			var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
			return this.getRangeReferenceByAddress(rangeSpecifierOb);
		}
	}

	/**
	* Utility function to try and find friendly rangeName from RC name
	*/
	calcWorkbook.prototype.getFriendlyName = function(range) {
		// return this.workbook.getFriendlyName(address);
        var self = this; // workbook
        if (typeof self.addressReference[range] !== "undefined") {
            return self.addressReference[range];
        }
        // not found so return null
        return null;
	}

	/**
	* Returns all named ranges whose names match a given regular expression
	* Useful for getting ranges that follow naming conventions - e.g.
	* ^tlInput.+$ matches all input cells
	* ^tlOutput.+$ matches all output cells
	*
	*/
	calcWorkbook.prototype.getNames = function(regex) {
		var out = [];
		for (var curName in this.namedRanges) {
      if (typeof regex === "RegExp") {
        if(regex.test(curName)) {
          out.push(curName);
        }
      }
		}
		return out;
	}

	/**
	* Gets the current value of a cell or range of cells. A single cell will return a jsCalcValue
	* a range of cells will return a one dimensional array of jsCalcValue
	*/
	calcWorkbook.prototype.getValue = function(rangeID) {
		var targRange = null;
		if(this.isNamedRange(rangeID)) {
			targRange = this.getRange(rangeID);
		} else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
			var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
			targRange = this.getRangeReferenceByAddress(rangeSpecifierOb);
		}
		if(!targRange) return -1;
		if(targRange.count == 1) {
			var cell = targRange.getSingleCellReference();
			return cell.v();
		} else {
			var out = [];
			targRange.eachCell(function() {
				out.push(this.v());
			});
			return out;
		}
	}

	/**
	* Cells containing values instead of formulas get special treatment.
	* This function removes a cell from the list of value cells
	* This is to allow potential future functionality where a value cell gets changed to a formula cell
	* in a live environment.
	*/
	calcWorkbook.prototype.removeValueCell = function(cell) {
		for(var i = 0; i < this.valueCells.length; i++) {
			if(this.valueCells[i] == cell) {
				this.valueCells.splice(i, 1);
				return;
			}
		}
	}

	/**
	* Gets either the cell value or a cell reference value, depending on whether the
	* rangeId refers to a range of size 1 (reference) or more than one (values)
	*/
	calcWorkbook.prototype.getContextualValue = function(rangeID, cellCtx) {
		var targRange = null;
		if(this.isNamedRange(rangeID)) {
			targRange = this.getRange(rangeID);
		} else if (parseUtils.range1Regex.test(rangeID) || parseUtils.rangeRCRegex.test(rangeID)) {
			var rangeSpecifierOb = parseUtils.getRangeOb(rangeID);
			targRange = this.getRangeReferenceByAddress(rangeSpecifierOb);
		}
		if(!targRange) return -1;
		if(targRange.count == 1) {
			var cell = targRange.getSingleCellReference();
			return cell.v(cellCtx);
		} else {
			return targRange.v(cellCtx);
		}
	}

	/**
	* Does this name correspond to the name of a range
	*/
	calcWorkbook.prototype.isNamedRange = function(name) {
		return name in this.namedRanges;
	}

	/**
	* Does this name correspond to the name of a worksheet
	*/
	calcWorkbook.prototype.isWorksheet = function(name) {
		return name in this.worksheets;
	}

	/**
	* Forces a recalculation by marking all value cells as dirty and adding them to the calculation queue.
	*/
	calcWorkbook.prototype.recalculate = function(name) {
		for(var i = 0; i < this.valueCells.length; i++) {
			this.valueCells[i].endirten();
		}
		this.calculationQueue = this.valueCells.slice(0);
	}


  function compareAddressReferences(obj1, obj2) {
    if (obj1.targetSheetOb.name === obj2.targetSheetOb.name && obj1.count === obj2.count && obj1.endCol === obj2.endCol && obj1.endRow === obj2.endRow && obj1.startCol === obj2.startCol && obj1.startRow === obj2.startRow) {
      return true;
    }
    else {
      return false;
    }
  }

	return calcWorkbook;
});

//# sourceURL=workbook.js
