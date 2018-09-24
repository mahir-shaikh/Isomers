define([], function() {

	//polyfill for isArray
	if(!window.isArray) {
		window.isArray = function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		}
	}

    function cleanFloat(number) {
    	// do nothing - the rounding off accumulates, and sacrifices precision
    	return number;
        // var power = 1e14;
        // return Math.round(number * power) / power;
    };

	var jsCalcValue = {};

	/**
	* Factory function, creates jsCalcValue wrapper of correct type for supplied value
	*/
	jsCalcValue.makeValue = function(value) {
		switch(typeof(value)) {
			case 'string':
					if(value.toUpperCase() == 'TRUE' || value.toUpperCase() == 'FALSE') {
						//handle as boolean
						var val = new jsCalcValue.jsCalcBooleanValue(value);
						return val;
					} else if (parseFloat(value) && !isNaN(Number(value))) {
						//handle as numeric
						var val = new jsCalcValue.jsCalcNumValue(parseFloat(value));
						return val;
					} else {
						//handle as string value
						var val = new jsCalcValue.jsCalcStringValue(value);
						return val;
					}
			case 'number':
				var val = new jsCalcValue.jsCalcNumValue(parseFloat(value));
				return val;
			case 'boolean':
				var val = new jsCalcValue.jsCalcBooleanValue(value);
				return val;
			default:
				return -1;
		}
	}

	/**
	* Constructs numeric jsCalcValue
	*/
	jsCalcValue.NumValue = function(value) {
		value = cleanFloat(value);
		var val = new jsCalcValue.jsCalcNumValue(value);
		return val;
	}

	/**
	* Constructs reference jsCalcValue
	*/
	jsCalcValue.ReferenceValue = function(startRow, startCol, endRow, endCol, cellCtx, sheetName) {
		return new jsCalcValue.jsCalcReferenceValue(startRow, startCol, endRow, endCol, cellCtx, sheetName);
	}

	/**
	* Constructs boolean jsCalcValue
	*/
	jsCalcValue.BooleanValue = function(value) {
		var val = new jsCalcValue.jsCalcBooleanValue(value);
		return val;
	}

	/**
	* Constructs string jsCalcValue
	*/
	jsCalcValue.StringValue = function(value) {
		var val = new jsCalcValue.jsCalcStringValue(value);
		return val;
	}

	/**
	* Constructs error jsCalcValue
	*/
	jsCalcValue.ErrorValue = function(value, ctx, text) {
		var val = new jsCalcValue.jsCalcErrorValue(value, ctx, text);
		return val;
	}

	/**
	* jsCalcBooleanValue constructor
	*/
	jsCalcValue.jsCalcBooleanValue = function(value) {
		if(value.toUpperCase) {
			if(value.toUpperCase() == "FALSE") {
				this.data = false;
			} else if(value.toUpperCase() == "TRUE") {
				this.data = true;
			} else {
				this.data = value?true:false;
			}
		} else {
			this.data = value?true:false;
		}
	}


	/**
	* This section deals with converting a boolean value to various other types.
	*/
	jsCalcValue.jsCalcBooleanValue.prototype.num = function(ctx) {
		return this.data?1:0;
	}

	jsCalcValue.jsCalcBooleanValue.prototype.b = function(ctx) {
		return this.data;
	}

	jsCalcValue.jsCalcBooleanValue.prototype.s = function(ctx) {
		return this.data?"True":"False";
	}

	jsCalcValue.jsCalcBooleanValue.prototype.v = function(ctx) {
		return this.data == true;
	}

	//Boolean is a single value, only call it once
	jsCalcValue.jsCalcBooleanValue.prototype.each = function(func, ctx) {
		func.call(this, ctx);
	}

	//Boolean is a single value, only call it once
	jsCalcValue.jsCalcBooleanValue.prototype.eachCell = function(func, ctx) {
		func.call(this, ctx);
	}

	jsCalcValue.jsCalcBooleanValue.prototype.isBlank = false;

	jsCalcValue.jsCalcNumValue = function(value) {
		this.data = value;
	}

	//jsCalcNumValue.prototype = jsCalcValue;

	jsCalcValue.jsCalcNumValue.prototype.num = function(ctx) {
		return this.data;
	}

	jsCalcValue.jsCalcNumValue.prototype.b = function(ctx) {
		return this.data?true:false;
	}

	jsCalcValue.jsCalcNumValue.prototype.s = function(ctx) {
		return this.data.toString();
	}

	jsCalcValue.jsCalcNumValue.prototype.v = function(ctx) {
		return this.data;
	}

	jsCalcValue.jsCalcNumValue.prototype.each = function(func, ctx) {
		//Each calls only for this value - this is to allow ranges and single vals to be treated consistently
		//in aggregate function
		func.call(this, ctx);

	}

	jsCalcValue.jsCalcNumValue.prototype.eachCell = function(func, ctx) {
		//Each calls only for this value - this is to allow ranges and single vals to be treated consistently
		//in aggregate function
		func.call(this, ctx);

	}
	jsCalcValue.jsCalcNumValue.prototype.isBlank = false;

	//jsCalcStringValue.prototype = jsCalcValue;


/***
* jsCalcreferenceValue constructor
*/
	jsCalcValue.jsCalcReferenceValue = function(startRow, startCol, endRow, endCol, cellCtx, sheetName, sheetOb) {
		//if(!cellCtx) cellCtx = {workbook: ExpressionBuilder.activeWorkbook};
		if(!cellCtx) {
			alert("set cellCtx in caller");
		}
		this.startRow = parseInt(startRow);
		this.startCol = parseInt(startCol);

		this.endRow = parseInt(endRow?endRow:startRow);
		this.endCol = parseInt(endCol?endCol:startCol);
		this.h = this.endRow - this.startRow + 1;
		this.w = this.endCol - this.startCol + 1;
		this.count = this.h * this.w;
		//chooses the most efficient index function for the dimensions of this reference
		if(this.h == 1) {
			this.index = jsCalcValue.jsCalcReferenceValue.colIndex;
		} else if(this.w == 1) {
			this.index = jsCalcValue.jsCalcReferenceValue.rowIndex;
		} else {
			this.index = jsCalcValue.jsCalcReferenceValue.fullIndex;
		}
		if(sheetOb) {
			this.targetSheetOb = sheetOb;
		}
		if(!this.targetSheetOb && sheetName) {
			//scoped
			this.targetSheetOb = cellCtx.workbook.worksheets[sheetName];
		}
		if(!this.targetSheetOb && cellCtx.worksheet) {
			this.targetSheetOb = cellCtx.worksheet;
		}
		if(!this.targetSheetOb) {
			console.log("Didn't manage to find a worksheet reference for:", sheetName, "!R"+ startRow +"C"+ endRow);
			//console.log("No target sheet object - no cell context set?");
		}
		if(this.startRow == this.endRow && this.startCol == this.endCol) {
			//sets the conversion functions for the reference
			this.num = function(ctx) {
				var ref = this.getSingleCellReference();
				if(ref.value.errorContext) return ref.value.num(ctx);
				return ref.value.num(ref);
			}
			this.b = function(ctx) {
				var ref = this.getSingleCellReference();
				if(ref.value.errorContext) return ref.value.b(ctx);
				return ref.value.b(ref);
			}
			this.s = function(ctx) {
				var ref = this.getSingleCellReference();
				if(ref.value.errorContext) return ref.value.s(ctx);
				return ref.value.s(ref);
			}
			this.v = function(ctx) {
				var ref = this.getSingleCellReference();
				if(ref.value.errorContext) return ref.value.v(ctx);
				if (ref === ctx) {
					throw new Error('Infinite loop evaluating cell');
				}
				return ref.value.v(ref);
			}
		} else {
			this.num = function(ctx) {
				return this.getReference(ctx).num(ctx);
			}
			this.b = function(ctx) {
				return this.getReference(ctx).b(ctx);
			}
			this.s = function(ctx) {
				var ref = this.getReference(ctx);
				return ref.s(ctx);
			}
			this.v = function(ctx) {
				var ref = this.getReference(ctx);
				return ref.v(ctx);
			}
		}
	}

	/*jsCalcValue.jsCalcReferenceValue.prototype.v = function(ctx) {
		var ref = this.getReference(ctx);
		if(ref.value) return ref.value;
		return ref;
	}*/

	jsCalcValue.jsCalcReferenceValue.prototype.setValue = function(value) {
		if(window.isArray(value)) {

		} else {
			var ref = this.getSingleCellReference();
			ref.setValue(value);
		}
	}

	/**
	*	Gets a reference to the nth cell of this reference
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.get = function(n) {
		var row = 1 + Math.floor(n / this.w);
		var col = 1 +  n % this.w;
		return new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol + col - 1, this.startRow + row - 1, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb);
	}

	/**
	* Gets a reference to the cell value in the range indexed into by row and col
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.getByIndex = function(row, col) {
		return new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol + col - 1, this.startRow + row - 1, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb);
	}


	/**
	* Gets a reference to the cell in the range indexed into by row and col
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.getCellByIndex = function(row, col) {
		return this.targetSheetOb.getCell(this.startRow + row, this.startCol + col);
	}

	/**
	* Returns a reference based on this one that is a different height and width (using the same top left clel)
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.resize = function(h, w) {
		return new jsCalcValue.jsCalcReferenceValue(this.startRow, this.startCol, this.startRow + h - 1, this.startCol + w - 1, this.targetSheetOb.getCell(this.startRow, this.startCol), this.targetSheetOb.name, this.targetSheetOb);
	}
	//jsCalcReferenceValue.prototype = jsCalcValue;

	/**
	* Returns the string form address
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.address = function() {
		var out = this.targetSheetOb.name + "!R" + this.startRow + "C" + this.startCol;
		if(this.startRow != this.endRow || this.startCol != this.endCol) {
			out += ":R" + this.endRow + "C" + this.endCol;
		}
		return out;
	}




	/**
	*	Returns the contextually appropriate reference.
	* This is used in a context where the reference should reduce to a single cell based on being in the same rows/columns
	* as the referencing formula, and being evaluated as a value.
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.getReference = function(ctx) {
		if(this.h == 1 && this.w == 1) {
			return this;
		} else if(ctx.row >= this.startRow && ctx.row <= this.endRow && this.startCol == this.endCol) {
			return this.targetSheetOb.getCell(ctx.row, this.startCol);
		} else if(ctx.col >= this.startCol && ctx.col <= this.endCol && this.startRow == this.endRow) {
			return this.targetSheetOb.getCell(this.startRow, ctx.col);
		} else return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx);
	}

	jsCalcValue.jsCalcReferenceValue.prototype.getReferenceAsValueReference = function(ctx) {
		if(this.h == 1 && this.w == 1) {
			return this;
		} else if(ctx.row >= this.startRow && ctx.row <= this.endRow && this.startCol == this.endCol) {
			return jsCalcValue.ReferenceValue(ctx.row, this.startCol, ctx.row, this.startCol, ctx, this.targetSheetOb.name);
		} else if(ctx.col >= this.startCol && ctx.col <= this.endCol && this.startRow == this.endRow) {
			return jsCalcValue.ReferenceValue(this.startRow, ctx.col, this.startRow, ctx.col, ctx, this.targetSheetOb.name);
		} else return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx);
	}


	/**
	* Run the supplied function on every value referenced in the range
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.each = function(func, ctx) {
		//guaranteed traversal order - each cell in column, then next column, etc.
		//need to create iterator for this so two related ranges can be traversed in parallel
		//to support functions such as SUMPRODUCT
		for(var r = this.startRow; r <= this.endRow; r++) {
			for(var c = this.startCol; c <= this.endCol; c++) {
				func.call(new jsCalcValue.jsCalcReferenceValue(r, c, r, c, this.targetSheetOb.getCell(r, c), this.targetSheetOb.name, this.targetSheetOb));
			}
		}

	}


	/**
	* Run the supplied function on every cell referenced in the range
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.eachCell = function(func, ctx) {
		//guaranteed traversal order - each cell in column, then next column, etc.
		//need to create iterator for this so two related ranges can be traversed in parallel
		//to support functions such as SUMPRODUCT
		for(var r = this.startRow; r <= this.endRow; r++) {
			for(var c = this.startCol; c <= this.endCol; c++) {
				var cell = (this.targetSheetOb) ? this.targetSheetOb.getCell(r, c) : null;
				if (cell)
					func.call(cell);
			}
		}
	}

	/**
	* Return an array of the values in this reference
	*/
	jsCalcValue.jsCalcReferenceValue.prototype.valueArray = function() {
		//guaranteed traversal order - each cell in column, then next column, etc.
		//need to create iterator for this so two related ranges can be traversed in parallel
		//to support functions such as SUMPRODUCT
		var outArray = [];
		for(var r = this.startRow; r <= this.endRow; r++) {
			var curRow = [];

			for(var c = this.startCol; c <= this.endCol; c++) {
				curRow.push(this.targetSheetOb.getCell(r, c).v());
			}
			outArray.push(curRow);
		}
		return outArray;
	}

	/**
	* Implementations of the various index functions
	*/
	jsCalcValue.jsCalcReferenceValue.fullIndex = function(row, col, ctx) {
		return new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol + col - 1, this.startRow + row - 1, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb);
	}

	jsCalcValue.jsCalcReferenceValue.rowIndex = function(row, ctx) {
		return row<=this.h?new jsCalcValue.jsCalcReferenceValue(this.startRow + row - 1, this.startCol, this.startRow + row - 1, this.startCol, this.targetSheetOb.getCell(this.startRow + row - 1, this.startCol), this.targetSheetOb.name, this.targetSheetOb):jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx, "Attempted an out of bounds index");
	}

	jsCalcValue.jsCalcReferenceValue.colIndex = function(row, col, ctx) {
		if (!ctx) { ctx = col; col = row; }
		return col<=this.w?new jsCalcValue.jsCalcReferenceValue(this.startRow, this.startCol + col - 1, this.startRow, this.startCol + col - 1, this.targetSheetOb.getCell(this.startRow, this.startCol + col - 1), this.targetSheetOb.name, this.targetSheetOb):jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx, "Attempted an out of bounds index");
	}


	jsCalcValue.jsCalcReferenceValue.prototype.getSingleCellReference = function(ctx) {
		return this.targetSheetOb.getCell(this.startRow, this.startCol);
	}

	/*jsCalcValue.jsCalcReferenceValue.prototype.num = function(ctx) {
		return this.data;
	}*/



	/** conversion functions for strings
	*/
	jsCalcValue.jsCalcStringValue = function(value) {
		this.data = value;
	}

	jsCalcValue.jsCalcStringValue.prototype.num = function(ctx) {
		// try and validate if the given value is actually a number, and if it is run parseFloat, else save the value as is.
		var dataVal = (isNaN(Number(this.data))) ? this.data : parseFloat(this.data);
		return this.data.length>0? dataVal:0;
	}
	jsCalcValue.jsCalcStringValue.prototype.b = function(ctx) {
		return this.data.toUpper() =="TRUE"?true:false;
	}

	jsCalcValue.jsCalcStringValue.prototype.s = function(ctx) {
		return this.data;
	}
	jsCalcValue.jsCalcStringValue.prototype.v = function(ctx) {
		return this.data;
	}

	jsCalcValue.jsCalcStringValue.prototype.each = function(func, ctx) {
		//Each calls only for this value - this is to allow ranges and single vals to be treated consistently
		//in aggregate function
		func.call(this);

	}

	jsCalcValue.jsCalcStringValue.prototype.eachCell = function(func, ctx) {

		func.call(this);

	}

	jsCalcValue.jsCalcStringValue.prototype.isBlank = false;


	jsCalcValue.jsCalcErrorValue = function(value, ctx, text) {
		this.data = value;
		this.errorContext = ctx;
		this.text = text;
		if(!ctx.errorStatus) ctx.errorStatus = this;
	}

	jsCalcValue.jsCalcErrorValue.uninitialized = "#UNINITIALIZED!";
	jsCalcValue.jsCalcErrorValue.ref = "#REF!";
	jsCalcValue.jsCalcErrorValue.divideByZero = "#DIV/0!";
	jsCalcValue.jsCalcErrorValue.nameErr = "#NAME!";
	jsCalcValue.jsCalcErrorValue.num = "#NUM!";
	jsCalcValue.jsCalcErrorValue.calc = "#CALCERROR!";
	jsCalcValue.jsCalcErrorValue.value = "#VALUE!";
	jsCalcValue.jsCalcErrorValue.build = -5;
	jsCalcValue.jsCalcErrorValue.na = "#N/A";

	jsCalcValue.jsCalcErrorValue.prototype.num = function(ctx) {
		if(ctx) {
			if(!ctx.errorStatus || (ctx.errorStatus && !ctx.errorStatus.errorContext)) ctx.errorStatus = this;
		}
		return this.data;
	}

	jsCalcValue.jsCalcErrorValue.prototype.b = function(ctx) {
		if(ctx) {
			if(!ctx.errorStatus || (ctx.errorStatus && !ctx.errorStatus.errorContext)) ctx.errorStatus = this;
		}
		return this.data;
	}

	jsCalcValue.jsCalcErrorValue.prototype.s = function(ctx) {
		if(ctx) {
			if(!ctx.errorStatus || (ctx.errorStatus && !ctx.errorStatus.errorContext)) ctx.errorStatus = this;
		}
		return this.data.toString();
	}

	jsCalcValue.jsCalcErrorValue.prototype.index = function() {
		return this;
	}


	jsCalcValue.jsCalcErrorValue.prototype.v = function(ctx) {
		return this;
	}

	jsCalcValue.jsCalcErrorValue.prototype.toString = function() {
		return this.data;
	}

	jsCalcValue.jsCalcErrorValue.prototype.each = function(func, ctx) {
		//Each calls only for this value - this is to allow ranges and single vals to be treated consistently
		//in aggregate function
		func.call(this);

	}

	jsCalcValue.jsCalcErrorValue.prototype.eachCell = function(func, ctx) {
		//Each calls only for this value - this is to allow ranges and single vals to be treated consistently
		//in aggregate function
		//func.call(this);

	}


	//function(startRow, startCol, endRow, endCol, cellCtx, sheetName, sheetOb) {
	jsCalcValue.jsCalcMulticellReferenceValue = function(refArray, cellCtx) {
		this.refs = [];
		for(var i = 0; i < refArray.length; i++) {
			var curArrayItem = refArray[i];
			this.refs.push(jsCalcValue.ReferenceValue(curArrayItem.startRow, curArrayItem.startCol, curArrayItem.endRow, curArrayItem.endCol, cellCtx, curArrayItem.sheetName));
		}
	}

	jsCalcValue.jsCalcMulticellReferenceValue.prototype.each = function(func, ctx) {
		for(var i = 0; i < this.refs.length; i++) {
			this.refs[i].each(func, ctx);
		}
	}

	return jsCalcValue;
});

//# sourceURL=jsCalcValue.js
