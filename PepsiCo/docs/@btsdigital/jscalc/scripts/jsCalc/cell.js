define(['./ExpressionBuilder', './jsCalcValue'], function (ExpressionBuilder, jsCalcValue) {

	/***
	* Construct the cell
	*/
	var calcExcelCell = function (worksheet, row, col, expressionData, isBlank) {

		this.debugExpressionData = expressionData;
		var self = this;


		this.workbook = worksheet.parent;
		this.worksheet = worksheet;
		this.row = parseInt(row);
		this.col = parseInt(col);
		this.parents = [];
		this.children = [];
		this.cleanParentCount = 0;
		this.isBlank = expressionData == 0 ? true : false;


		this.breakIf();

		/*
		if(this.col >= 10 && this.col <= 10 && this.row >= 23 && this.row <= 23 && this.worksheet.name == "feedbackTS") {
			console.log("Calculating a cell that has a calculation breakpoint set.")
		}*/
		if (expressionData) {
			if (expressionData.type == 'value' || expressionData.type == 'string' || expressionData.type == 'bool') {
				this.workbook.valueCells.push(this);
				this.isValue = true;
			} else this.isValue = false;
			this.errorStatus = null;
			try {
				this.expression = ExpressionBuilder.getEvalFunction(expressionData, this, true);
			} catch (e) {
				var err = e;
				this.workbook.buildErrors.push(e.toString());
				this.expression = function (ctx) { return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, self, err.toString()); };
			}
			if (this.errorStatus) {
				this.workbook.buildErrors.push("Error building " + this.address() + ": " + this.errorStatus.text);
				this.expression = function (ctx) {
					var out = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, self, "Error building " + self.address());
					return out;
				};
			}
			this.value = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.uninitialized, this, 'Not yet initialized');
			if (!this.isValue && this.parents.length == 0 && !this.errorStatus) {
				//actually is value (formula with only values)
				this.isValue = true;
				this.workbook.valueCells.push(this);
			}
			this.isBlank = false;
		} else {
			var tExpressionData = { type: 'string', value: '' };
			this.isValue = true;
			this.isBlank = true;
			this.workbook.valueCells.push(this);
			this.expression = ExpressionBuilder.getEvalFunction(tExpressionData, this, true);
		}

		if (this.isValue) {
			this.value = this.expression(this);
			this.errorStatus = null;
		}

		this.dirty = true;
	}


	/***
	* Reinitialize the cell - this is for changing the cell's formula at runtime, which isn't fully implented yet.
	*/
	calcExcelCell.prototype.reinit = function (expressionData, isBlank) {
		this.debugExpressionData = expressionData;
		var self = this;



		this.removeParents();
		this.cleanParentCount = 0;

		this.workbook.removeValueCell(this);

		this.isBlank = expressionData == 0 ? true : false;

		this.breakIf();

		/*
					if(this.col >= 10 && this.col <= 10 && this.row >= 23 && this.row <= 23 && this.worksheet.name == "feedbackTS") {
						console.log("Calculating a cell that has a calculation breakpoint set.")
					}*/
		if (expressionData) {
			if (expressionData.type == 'value' || expressionData.type == 'string') {
				this.workbook.valueCells.push(this);
				this.isValue = true;
			} else this.isValue = false;
			this.errorStatus = null;
			try {
				this.expression = ExpressionBuilder.getEvalFunction(expressionData, this, true);
			} catch (e) {
				var err = e;
				this.workbook.buildErrors.push(e.toString());
				this.expression = function (ctx) { return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, self, err.toString()); };
			}
			if (this.errorStatus) {
				this.workbook.buildErrors.push("Error building " + this.address() + ": " + this.errorStatus.text);
				this.expression = function (ctx) {
					var out = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, self, "Error building " + self.address());
					return out;
				};
			}
			this.value = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.uninitialized, this, 'Not yet initialized');
			if (!this.isValue && this.parents.length == 0 && !this.errorStatus) {
				//actually is value (formula with only values)
				this.isValue = true;
				this.workbook.valueCells.push(this);
			}
			this.isBlank = false;
		} else {
			var tExpressionData = { type: 'string', value: '' };
			this.isValue = true;
			this.isBlank = true;
			this.workbook.valueCells.push(this);
			this.expression = ExpressionBuilder.getEvalFunction(tExpressionData, this, true);
		}

		if (this.isValue) {
			this.value = this.expression(this);
			this.errorStatus = null;
		}
		this.processParents();
		this.endirten();

	}


	/**
	* TODO: implement - set the cell's value from a string
	*/
	calcExcelCell.prototype.setFromString = function (expString) {

	}

	/**
	* Set's the cell's value.
	*/
	calcExcelCell.prototype.setValue = function (value) {
		if (value.toString() != this.value.s(this) && this.isValue) {
			var curVal = jsCalcValue.makeValue(value);
			this.expression = function () {
				return curVal;
			};
			this.value = this.expression(this);
			this.endirten();
			this.workbook.calculationQueue.push(this); //easy calculate, but keeps things consistent
		}
	}

	/**
	* Keeps track of how many of the cell's parents are dirty.
	* This is used to manage calculation order and to add the cell to the calculation queue at the appropriate point
	*/
	calcExcelCell.prototype.parentMadeUnclean = function () {
		//this.breakIf();
		this.cleanParentCount--;
	}

	/**
	* Keeps track of how many of the cell's parents are dirty.
	* This is used to manage calculation order and to add the cell to the calculation queue at the appropriate point
	*/
	calcExcelCell.prototype.parentMadeClean = function () {
		//this.breakIf();
		this.cleanParentCount++;
	}

	/**
	* Marks the cell as 'dirty' - meaning it has been changed and those changes haven't been incorporated
	* in a recalculation.
	* Marks all descendants as dirty as well.
	*/
	calcExcelCell.prototype.endirten = function () {
		if (!this.dirty) {
			this.dirty = true;
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].parentMadeUnclean();
				this.children[i].endirten();
			}
		}
	}


	/**
	* This creates the cells parent and child arrays.
	*/
	calcExcelCell.prototype.processParents = function () {
		//initial contents of parents array are reference objects rather than cell objects, need to convert and remove duplicates
		/*	if(this.workbook.calculationBreakpointObject) {
					var breakOb = this.workbook.calculationBreakpointObject;
				if(this.col >= breakOb.startCol && this.col <= breakOb.endCol && this.row >= breakOb.startRow && this.row <= breakOb.endRow && this.worksheet.name == breakOb.sheetName) {
					console.log("found")
				}
			}*/
		this.breakIf();
		if (!this.isValue) {
			var unique = {};
			var outArray = [];
			for (var i = 0; i < this.parents.length; i++) {
				var curParentRef = this.parents[i];
				if (curParentRef) {
					try {
						curParentRef.eachCell(function () {
							/*if(this.targetSheetOb) {
								//if it doesn't, probably an error value - don't want to require it to calc
								var addStr = this.targetSheetOb.name + "!R" + this.startRow + "C" + this.startCol;
								if(!unique.hasOwnProperty(addStr)) {
									if(!this.getSingleCellReference().isBlank) {
										outArray.push(this.getSingleCellReference());
										unique[addStr] = 1;
									}
								}
							}*/
							var addStr = this.address();
							if (!unique.hasOwnProperty(addStr)) {
								if (!this.isBlank) {
									outArray.push(this);
									unique[addStr] = 1;
								}
							}
						})
					}
					catch (e) {
						debugger;
						console.log("Error processing ", e);
						console.log(curParentRef);
					}
				}
			}
			this.parents = outArray;
			var hasNonValueParent = false;
			var valueParentCount = 0;
			for (var i = 0; i < this.parents.length; i++) {
				var curParent = this.parents[i];
				this.parents[i].addChild(this);
				hasNonValueParent = hasNonValueParent || !this.parents[i].isValue;
				if (this.parents[i].isValue) valueParentCount++;
			}

			if (!hasNonValueParent) this.workbook.valueCells.push(this);

		}
		if (this.parents.length > 30) {
			this.workbook.lotsOfParents.push(this.address() + ": " + this.parents.length);
		}
	}

	/***
	*return verbose address string (for error logging)
	*/
	calcExcelCell.prototype.verboseAddress = function () {
		return this.worksheet.name + "!R" + this.row + "C" + this.col;
	}

	/***
	*returns value of cell (in whatever type is most suitable)
	*/
	calcExcelCell.prototype.v = function () {
		/*if(this.dirty) {
			this.errorStatus = null;
			this.value = this.expression(this);
			this.dirty = false;
		}*/
		return this.value.v(this);
	}

	/***
*returns value of cell (coerced to boolean)
*/
	calcExcelCell.prototype.b = function () {
		/*if(this.dirty) {
			this.errorStatus = null;
			this.value = this.expression(this);
			this.dirty = false;
		}*/
		return this.value.b(this);
	}

	/***
	*returns value of cell (coerced to numeric)
	*/
	calcExcelCell.prototype.num = function () {
		/*if(this.dirty) {
			this.errorStatus = null;
			this.value = this.expression(this);
			this.dirty = false;
		}*/
		return this.value.num(this);
	}

	/***
*returns value of cell (coerced to string)
*/
	calcExcelCell.prototype.s = function () {
		return this.value.s(this);
	}

	/***
	* For debugging only - you can set a breakpoint here to break when calculating the cell specified in calculationBreakpointObject.
	*/
	calcExcelCell.prototype.breakIf = function () {
		if (this.workbook.calculationBreakpointObject) {
			var breakOb = this.workbook.calculationBreakpointObject;
			if (this.col >= breakOb.startCol && this.col <= breakOb.endCol && this.row >= breakOb.startRow && this.row <= breakOb.endRow && this.worksheet.name == breakOb.sheetName) {
				var breakOnThis = "I need something on this line of code to break on.";
				//console.log("Calculating a cell that has a calculation breakpoint set.")
			}
		}

	}



	/***
	* Calculate this cell.
	* This causes all children to calculate if their dependencies are clean.
	*/
	calcExcelCell.prototype.calculate = function () {

		this.breakIf();
		if (this.dirty) {
			this.errorStatus = null;

			this.value = this.expression(this);
			this.dirty = false;

			if (this.errorStatus) {
				this.value = this.errorStatus;

			} else {

				var curVal = this.value.num(this);
			}

			this.flagChildrenToCalculate();
		}
	}

	/**
	*	Flags all child cells to calculate IFF all parent cells are clean
	*/
	calcExcelCell.prototype.flagChildrenToCalculate = function () {
		for (var i = 0; i < this.children.length; i++) {
			var curChild = this.children[i];
			curChild.parentMadeClean();
			this.children[i].flagCalculateIfParentsClean();
		}
	}

	/**
	* Adds this cell to the calculation queue IFF all parents are clean.
	* This prevents the cell from being calculated multiple times, while still ensuring it
	* gets calculated when its dependencies change
	*/
	calcExcelCell.prototype.flagCalculateIfParentsClean = function () {
		//this.breakIf();
		var ready = this.parents.length == this.cleanParentCount;
		/*for(var i = 0; i < this.parents.length; i++) {
			ready = ready && !this.parents[i].dirty;
		}*/
		if (ready) this.workbook.calculationQueue.push(this);
	};

	/*calcExcelCell.prototype.flagCalculateIfParentsClean = function() {
		var ready = true;
		for(var i = 0; i < this.parents.length; i++) {
			ready = ready && !this.parents[i].dirty;
		}
		if(ready) this.workbook.calculationQueue.push(this);
	};*/

	/**
	* Stub - being dealt with elsewhere for now, may want to refactor into here
	*/
	calcExcelCell.prototype.addParent = function (parentCell) {

	}

	/**
	* Adds the given cell as a child
	*/
	calcExcelCell.prototype.addChild = function (childCell) {
		this.children.push(childCell);
	}

	/**
	* removes this cell from the child list of the given cell
	* TODO: not necessarily complete.  This is for runtime changes to formulas
	*/
	calcExcelCell.prototype.removeParents = function (parentCell) {
		for (var i = 0; i < this.parents.length; i++) {
			this.parents[i].removeChild(this);
		}
	}

	/**
	* removes the given cell from this cell's child list
	* TODO: not necessarily complete.  This is for runtime changes to formulas
	*/
	calcExcelCell.prototype.removeChild = function (childCell) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i] == childCell) {
				this.children.splice(i, 1);
			}
		}
	}

	/***
	* Returns the address of this cell.
	*/
	calcExcelCell.prototype.address = function () {
		return this.worksheet.name + "!R" + this.row + "C" + this.col;
	}


	//calcExcelCell.zeroCell = new calcExcelCell(null, 0, 0, null);
	window.calcCell = calcExcelCell;
	return window.calcCell;
});

//# sourceURL=cell.js
