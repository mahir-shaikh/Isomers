require(['workbook', 'calcParser', 'jsCalc'], function (calcWorkbook, calcParser, jsCalcAPI) {

	/*test("Benchmark", function() {

		var workbookJson = {
			name: 'buildTestWorkbook',
			namedRanges: {
				dummyNamedRange: {
					worksheet: 'testWorksheet',
					startRow: 5,
					startCol: 5,
					endRow: 5,
					endCol: 9
				}
			},
			worksheets: {
				testWorksheet: {
					namedRanges: {
					},
					cells: [
						

					]
				}
			}
		}
		workbookJson.worksheets.testWorksheet.cells[0] = {row: 1, col: 1, expression: {	type: 'value',
				value: 1
		}};
		
		var startTime = new Date().getTime();

		
		var numRows = 1000;
		var numCols = 10;
		for(var buildCol = 2; buildCol <= numCols; buildCol++) {
			var cellOb = {row: 1, col: buildCol};
			cellOb.expression = createRandomExpression(1, 1, 1, buildCol - 1, 5);
			workbookJson.worksheets.testWorksheet.cells.push(cellOb);
		}
		for(var buildRow = 2; buildRow <= numRows; buildRow++) {
			for(var buildCol = 1; buildCol <= numCols; buildCol++) {
				var cellOb = {row: buildRow, col: buildCol};
				cellOb.expression = createRandomExpression(1, buildRow - 1, 1, numCols, 5);
				workbookJson.worksheets.testWorksheet.cells.push(cellOb);
			}
		}
		var endTime = new Date().getTime();
		var elapsed = endTime - startTime;
		ok(true, "Built test json in " + elapsed + "ms");
		startTime = new Date().getTime();
		var testBook = new calcWorkbook(workbookJson);
		
		endTime = new Date().getTime();
		elapsed = endTime - startTime;
		ok(testBook, 'Workbook created successfully with random test json in ' + elapsed + 'ms');
		var numIters = 1;
		for(var iter = 0; iter < numIters; iter++) {
			startTime = new Date().getTime();
			var outArray = [];
			var testSheet =  testBook.worksheets['testWorksheet'];
			for(var calcRow = 1; calcRow <= numRows; calcRow++) {
				for(var calcCol = 1; calcCol <= numCols; calcCol++) {
					outArray.push(testSheet.getCell(calcRow, calcCol).v());
				}
			}
			endTime = new Date().getTime();
			elapsed = endTime - startTime;

			ok(testBook, 'All randomly generated cells (' + outArray.length + ') calculated successfully in ' + elapsed + 'ms');
			for(var calcRow = 1; calcRow <= numRows; calcRow++) {
				for(var calcCol = 1; calcCol <= numCols; calcCol++) {
					testSheet.getCell(calcRow, calcCol).dirty = true;
				}
			}
		}
		
	});
	
	asyncTest("Benchmark", 6, function() {

		var workbookJson = {
			name: 'buildTestWorkbook',
			namedRanges: {
				dummyNamedRange: {
					worksheet: 'testWorksheet',
					startRow: 5,
					startCol: 5,
					endRow: 5,
					endCol: 9
				}
			},
			worksheets: {
				testWorksheet: {
					namedRanges: {
					},
					cells: [
						

					]
				}
			}
		}
		workbookJson.worksheets.testWorksheet.cells[0] = {row: 1, col: 1, expression: {	type: 'value',
				value: 1
		}};
		
		var startTime = new Date().getTime();

		
		var numRows = 1500;
		var numCols = 10;
		var formDepth = 2;
		for(var buildCol = 2; buildCol <= numCols; buildCol++) {
			var cellOb = {row: 1, col: buildCol};
			cellOb.expression = createRandomExpression(1, 1, 1, buildCol - 1, formDepth);
			workbookJson.worksheets.testWorksheet.cells.push(cellOb);
		}
		for(var buildRow = 2; buildRow <= numRows; buildRow++) {
			for(var buildCol = 1; buildCol <= numCols; buildCol++) {
				var cellOb = {row: buildRow, col: buildCol};
				cellOb.expression = createRandomExpression(1, buildRow - 1, 1, numCols, formDepth);
				workbookJson.worksheets.testWorksheet.cells.push(cellOb);
			}
		}
		var endTime = new Date().getTime();
		var elapsed = endTime - startTime;
		ok(true, "Built test json in " + elapsed + "ms");
		startTime = new Date().getTime();
		var testBook = new calcWorkbook(workbookJson);
		
		endTime = new Date().getTime();
		elapsed = endTime - startTime;
		ok(testBook, 'Workbook created successfully with random test json in ' + elapsed + 'ms');
		
		startTime = new Date().getTime();
		testBook.onCalculationDone(function() {
			var endTime = new Date().getTime();
			var elapsed = endTime - startTime;
			ok(true, "Asynch benchmark finished calculating asynchronously in " + elapsed + "ms");
			var allClean = true;
			var allNumeric = true;
			var dirtCount = 0;
			var cleanCount = 0;
			var valArray = [];
			var testSheet =  testBook.worksheets['testWorksheet'];
			for(var testRow = 1; testRow <= numRows; testRow++) {
				for(var testCol = 1; testCol <= numCols; testCol++) {
					var testCell = testSheet.getCell(testRow, testCol);
					allClean = allClean && !testCell.dirty;
					if(testCell.dirty) {
						//SHMOOG
						//alert("Shmoog.");
						dirtCount += 1;
					} else {
						cleanCount +=1;
					}
					var cellVal = testCell.v();
					valArray.push(cellVal);
					if(isNaN(cellVal) || cellVal == Number.POSITIVE_INFINITY || cellVal == Number.NEGATIVE_INFINITY) {
						var address = "R" + testCell.row + "C" + testCell.col;
						var errType = "";
						if(isNaN(cellVal)) errType = "NaN";
						if(cellVal == Number.POSITIVE_INFINITY) errType = "pInfinity";
						if(cellVal == Number.NEGATIVE_INFINITY) errType = "pInfinity";
						//if it's NaN it should have an error
						if(!testCell.errorStatus) {
							console.log(errType + " " + address + ": " + JSON.stringify(testCell.debugExpressionData, undefined, 5));
							allNumeric = false;
						} else {
							console.log(testCell.worksheet.name + "!R" + testCell.row + "C" + testCell.col + ": " + testCell.errorStatus.text);
													console.log(JSON.stringify(testCell.debugExpressionData));
						}
					}
				}
			}
			ok(allClean, cleanCount + "/" + (dirtCount + cleanCount) + " cells calculated");
			ok(allNumeric, "All cells have a numeric result or appropriate bubbled error code");
			var frameTimeDiff = testBook.animFrameTimes[testBook.animFrameTimes.length - 1] - testBook.animFrameTimes[0];
			var avgFrameTime = frameTimeDiff/(testBook.animFrameTimes.length - 1);
			ok(true, "Average frame time was " + avgFrameTime + "ms");
			start();
		});
		
	});

	function createRandomExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth) {
		var outExpression;
		if(depth == 0) {
			//need to be a value or a reference
			var isValue = Math.random() > 0.5;
			if(isValue) {
				outExpression = createRandomValueExpression(-10, 10);
			} else {
				outExpression = createRandomReferenceExpression(minRowRef, maxRowRef, minColRef, maxColRef);
			}
		} else {
			var expType = Math.floor(7 * Math.random());
			switch(expType) {
				case 0:
					outExpression = createRandomBinaryExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth, 'add');
					break;
				case 1:
					outExpression = createRandomBinaryExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth, 'sub');
					break;
				case 2:
					outExpression = createRandomBinaryExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth, 'div');
					break;
				case 3:
					outExpression = createRandomBinaryExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth, 'mul');
					break;
				case 4:
					outExpression = createRandomBinaryExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth, 'exp');
					break;
				case 5:
					outExpression = createRandomValueExpression(-10, 10);
					break;
				case 6:
					outExpression = createRandomReferenceExpression(minRowRef, maxRowRef, minColRef, maxColRef);
					break;
				default:
					alert("This shouldn't occur - error building test expression");
					break;
			}
		}
		return outExpression;
	}

	function createRandomValueExpression(minVal, maxVal) {
		var outExpression = {};
		outExpression.type = 'value';
		var outVal = 0;
		while (outVal == 0) {
			outVal = minVal + (maxVal - minVal) * Math.random();
		}
		outExpression.value = outVal;
		return outExpression;
	}

	function createRandomReferenceExpression(minRowRef, maxRowRef, minColRef, maxColRef) {
		var outExpression = {};
		outExpression.type = 'reference';
		var startRow = Math.floor((maxRowRef - minRowRef) * Math.random()) + minRowRef;
		var startCol =  Math.floor((maxColRef - minColRef) * Math.random()) + minColRef;
		outExpression.startRow = startRow;
		outExpression.startCol = startCol;
		return outExpression;
	}

	function createRandomBinaryExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth, opType) {
		var outExpression = {};
		outExpression.type = 'binary';
		outExpression.operator = opType;
		outExpression.A = createRandomExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth - 1);
		outExpression.B = createRandomExpression(minRowRef, maxRowRef, minColRef, maxColRef, depth - 1);
		return outExpression;
	}
});