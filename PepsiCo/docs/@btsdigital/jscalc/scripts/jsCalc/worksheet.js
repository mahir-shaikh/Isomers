define(['./jsCalcValue', './cell'], 
function (jsCalcValue, calcCell) {


	/**
	* Worksheet constructor, parentbook is the workbook that owns the worksheet
	* worksheetName is hte name of the sheet.
	*/
	var calcWorksheet = function(parentBook, worksheetName) {
		this.parent = parentBook;
		this.name = worksheetName;
		this.rows = {};
		this.namedRanges = {};
		this.cellCount = 0;
		this.cellArray = [];
		this.hierarchyBuildCount = 0;
		this.hierarchyReady = false;
	}

	/**
	* Initializes the worksheet based on the json for the worksheet.
	*/
	calcWorksheet.prototype.init = function(worksheetJson) {
		this.initializeNamedRanges(worksheetJson.namedRanges);
		for(var i = 0; i < worksheetJson.cells.length; i++) {
			this.addCell(worksheetJson.cells[i]);
		}
		for(var row in this.rows) {
			for(var col in this.rows[row]) {
				this.cellArray.push(this.rows[row][col]);
			}
		}
	}

	/*
	* Initializes the references for named ranges on the worksheet.
	*/
	calcWorksheet.prototype.initializeNamedRanges = function(namedRangeJson) {
		for(var namedRange in namedRangeJson) {
			var namedRangeOb = namedRangeJson[namedRange];
			var startRow = namedRangeOb.startRow;
			var startCol = namedRangeOb.startCol;
			var endRow = namedRangeOb.endRow?namedRangeOb.endRow: startRow;
			var endCol = namedRangeOb.endCol?namedRangeOb.endCol: startCol;
			var targetSheet = namedRangeOb.worksheet?namedRangeOb.worksheet: this.name;
			var refOb = jsCalcValue.ReferenceValue(startRow, startCol, endRow, endCol, {workbook: this.parent}, targetSheet);
			this.namedRanges[namedRange] = refOb;
		}
	}

	/*
	* Builds each cell in the worksheet from the json object describing that cell.
	* Handles and stores optional cell data -
	* cellJson.v is the calculated value from the original spreadsheet (used for validation)
	* cellJson.f is the string form formula from the original spreadsheet
	* cellJson.nf is the number format string
	*/
	calcWorksheet.prototype.addCell = function(cellJson) {
		var targRow = cellJson.row;
		var targCol = cellJson.col;
		if(!this.rows[targRow]) this.rows[targRow] = {};
		this.rows[targRow][targCol] = new calcCell(this, cellJson.row, cellJson.col, cellJson.expression);
		if(cellJson.v) this.rows[targRow][targCol].origValue = cellJson.v;
		if(cellJson.f) this.rows[targRow][targCol].formula = cellJson.f;
		if(cellJson.nf) this.rows[targRow][targCol].nf = cellJson.nf;
		this.cellCount++;
	}


	/***
	* Returns the cell object in the provided row and col.
	* If that cell doesn't exist, constructs a blank cell and puts it in that location.
	*/
	calcWorksheet.prototype.getCell = function(row, col) {
		if(this.rows[row] &&  this.rows[row][col]) return this.rows[row][col];
		else {
			if(!this.rows[row]) this.rows[row] = {};
			this.rows[row][col] = new calcCell(this, row, col, null, true);
			return this.rows[row][col];
		}
	};

	/*
	* Initializes the calculation tree - sets each cell's parents and children appropriately.
	*/
	calcWorksheet.prototype.initializeHierarchies = function() {
		for(var row in this.rows) {
			for(var col in this.rows[row]) {
				this.rows[row][col].processParents();
			}
		}
		this.hierarchyReady = true;
	}
	
	/*
	* Initializes the calculation tree - sets each cell's parents and children appropriately.
	* This version works asynchronously, so can avoid blocking UI
	*/
	calcWorksheet.prototype.initializeSingleCellHierarchyAsync = function() {
		if(this.hierarchyBuildCount < this.cellArray.length) {
			this.cellArray[this.hierarchyBuildCount].processParents();
			this.hierarchyBuildCount++;
		} else {
			this.hierarchyReady = true;
			this.parent.numBuilt--;
		}
	}
	
	return calcWorksheet;
});

//# sourceURL=worksheet.js