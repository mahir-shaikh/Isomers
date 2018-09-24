require(['workbook', 'calcParser'], function (calcWorkbook, calcParser) {
	test("Detect Build Error: Nonexistent Function", function() {
		var calcJson0 = {
			type: 'wsFunc',
			name: 'NOTAREALFUNCTION',
			argExpressionArray: [
				{
					type: 'value',
					value: 5,
				}
			]
		}
		
		
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
						{
							row: 5,
							col: 5,
							expression: calcJson0,
						}
					]
				}
			}
		}
		var testBook = new calcWorkbook(workbookJson);
		equal(testBook.buildErrors.length, 1, 'Workbook shows build error from unimplemented function');
		var errString = testBook.buildErrors[0];
		var addressLoc = errString.indexOf('testWorksheet!R5C5');
		ok(addressLoc >= 0, 'Workbook build error log contains address of cell with unimplemented function');
		var addressLoc = errString.indexOf('NOTAREALFUNCTION');
		ok(addressLoc >= 0, 'Workbook build error log contains name of unimplemented function');	
	});


	test("Error Bubbling", function() {
		var calcJson0 = {
			type: 'binary',
			A: {
				type: 'value',
				value: -2,
			},
			operator: 'exp',
			B: {
				type: 'value',
				value: 0.5,
			}
		}
		
		var calcJson1 = {
			type: 'binary',
			A: {
				type: 'value',
				value: 1,
			},
			operator: 'add',
			B: {
				type: 'reference',
				startRow: 5,
				startCol: 5
			}
		}
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
						{
							row: 5,
							col: 5,
							expression: calcJson0,
						},
						{
							row: 5,
							col: 6,
							expression: calcJson1,
						}
					]
				}
			}
		}
		var startTime = new Date().getTime();
		var testBook = new calcWorkbook(workbookJson);
		ok(testBook, 'Workbook created successfully');
		var res0 = testBook.worksheets['testWorksheet'].getCell(5, 5).calculate();
		testBook.worksheets['testWorksheet'].getCell(5, 6).calculate();
		var res1 = testBook.worksheets['testWorksheet'].getCell(5, 6);
		ok(res1.errorStatus, "Error Bubbled Appropriately");
		var endTime = new Date().getTime();
		var elapsed = endTime - startTime;
	});

		
	function makeValueExpression(val) {
		return {
					type: 'value',
					value: val,
		};
	}

	test("Formula to calculation", function() {
		var calcJson0 = {
			type: 'binary',
			A: {
				type: 'value',
				value: -2,
			},
			operator: 'exp',
			B: {
				type: 'value',
				value: 0.5,
			}
		}
		var testCells = [{
			row: 10,
			col: 6,
			formula: '=62 + E$5 - (E$6 * efficiencyCoefficient ^ A2)',
		}, {
			row: 10,
			col: 7,
			formula: '=62 + E$5 - (E$6 * efficiencyCoefficient ^ (A2 * 0.7))',
		}, {
			row: 10,
			col: 8,
			formula: '=62 + E$5 - (E$6 * efficiencyCoefficient ^ A2)',
		},
		{
			row: 10,
			col: 9,
			formula: '=62 + E$5 - (E$6 * efficiencyCoefficient ^ A2*3)',
		},
		{
			row: 10,
			col: 10,
			formula: '=62 + E$5 - (SUM(E10:I10) ^ A2*3)',
		}]
		for(var i = 0; i < testCells.length; i++) {
			testCells[i] = calcParser.processCell(testCells[i]);
		}
		var calcJson1 = {
			type: 'binary',
			A: {
				type: 'value',
				value: 1,
			},
			operator: 'add',
			B: {
				type: 'reference',
				startRow: 5,
				startCol: 5
			}
		}
		var workbookJson = {
			name: 'buildTestWorkbook',
			namedRanges: {
				efficiencyCoefficient: {
					worksheet: 'testWorksheet',
					startRow: 10,
					startCol: 5,
					endRow: 10,
					endCol: 5
				}
			},
			worksheets: {
				testWorksheet: {
					namedRanges: {
					},
					cells: [
						{
							row: 5,
							col: 5,
							expression: makeValueExpression(10),
						},
						{
							row: 6,
							col: 5,
							expression: makeValueExpression(0.27),
						},
						{
							row: 2,
							col: 1,
							expression: makeValueExpression(2.5),
						},
						{
							row: 10,
							col: 5,
							expression: makeValueExpression(.117),
						},
						testCells[0],
						testCells[1],
						testCells[2],
						testCells[3],
						testCells[4],
					]
				}
			}
		}

		var testBook = new calcWorkbook(workbookJson);
		testBook.forceCalculate();
		ok(testBook, 'Workbook created successfully');
		var res0 = testBook.worksheets['testWorksheet'].getCell(10, 6);
		var res1 = testBook.worksheets['testWorksheet'].getCell(10, 7);
		var res2 = testBook.worksheets['testWorksheet'].getCell(10, 8);
		var res3 = testBook.worksheets['testWorksheet'].getCell(10, 9);
		var res4 = testBook.worksheets['testWorksheet'].getCell(10, 10);
		
		equal(res0.v(), 71.99873576322707, "Calculation from parse returns correct result");
		equal(res4.v(), -4226573.544620629, "SUM function aggregating other results returns correct result");

	});

	test("Basic Worksheet Function", function() {
		var calcJson0 = {
			type: 'wsFunc',
			name: 'SUM',
			argExpressionArray: [
				{
						type: 'reference',
						startRow: 5,
						startCol: 5,
						endRow: 5,
						endCol: 9
				},
				makeValueExpression(5),
				{
					type: 'binary',
					A: {
						type: 'value',
						value: 1,
					},
					operator: 'add',
					B: {
						type: 'namedRangeReference',
						name: 'dummyNamedRange',
					}
				},
				{
					type: 'namedRangeReference',
					name: 'dummyNamedRange',
				}
			]
		}
		
		
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
						{
							row: 5,
							col: 5,
							expression: makeValueExpression(1),
						},
						{
							row: 5,
							col: 6,
							expression: makeValueExpression(2),
						},
						{
							row: 5,
							col: 7,
							expression: makeValueExpression(3),
						},
						{
							row: 5,
							col: 8,
							expression: makeValueExpression(4),
						},
						{
							row: 5,
							col: 9,
							expression: makeValueExpression(5),
						},
						{
							row: 6,
							col: 5,
							expression: calcJson0,
						},
						{
							row: 6,
							col: 6,
							expression: calcJson0,
						},
						{
							row: 6,
							col: 7,
							expression: calcJson0,
						},
						{
							row: 6,
							col: 8,
							expression: calcJson0,
						},
						{
							row: 6,
							col: 9,
							expression: calcJson0,
						},
						
					]
				}
			}
		}
		var testBook = new calcWorkbook(workbookJson);
		testBook.forceCalculate();

		equal(testBook.buildErrors.length, 0, 'Workbook built without error');
		var res = [testBook.worksheets['testWorksheet'].getCell(6, 5).v(),
					testBook.worksheets['testWorksheet'].getCell(6, 6).v(),
					testBook.worksheets['testWorksheet'].getCell(6, 7).v(),
					testBook.worksheets['testWorksheet'].getCell(6, 8).v(),
					testBook.worksheets['testWorksheet'].getCell(6, 9).v()];
		deepEqual(res, [37, 38, 39, 40, 41], 'Worksheet function outputs correct value');
	});

	
	
	asyncTest("Build basic workbook", 5, function() {
		var calcJson0 = {
			type: 'binary',
			A: {
				type: 'value',
				value: 1,
			},
			operator: 'sub',
			B: {
				type: 'binary',
				A: {
					type: 'value',
					value: 3,
				},
				operator: 'exp',
				B: {
					type: 'binary',
					A: {
						type: 'value',
						value: 5,
					},
					operator: 'div',
					B: {
						type: 'value',
						value: 3,
					}
				}
			}
		}
		var calcJson1 = {
			type: 'reference',
			startRow: 5,
			startCol: 5
		}
		var calcJson2 = {
			type: 'binary',
			A: {
				type: 'value',
				value: 1,
			},
			operator: 'sub',
			B: {
				type: 'binary',
				A: {
					type: 'value',
					value: 3,
				},
				operator: 'exp',
				B: {
					type: 'binary',
					A: {
						type: 'value',
						value: 5,
					},
					operator: 'div',
					B: {
						type: 'reference',
						startRow: 5,
						startCol: 5
					}
				}
			}
		}
		var calcJson3 = {
			type: 'binary',
			A: {
				type: 'value',
				value: 1,
			},
			operator: 'sub',
			B: {
				type: 'binary',
				A: {
					type: 'value',
					value: 3,
				},
				operator: 'exp',
				B: {
					type: 'binary',
					A: {
						type: 'value',
						value: 5,
					},
					operator: 'div',
					B: {
						type: 'namedRangeReference',
						name: 'dummyNamedRange',
					}
				}
			}
		}
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
						{
							row: 5,
							col: 5,
							expression: calcJson0,
						},
						{
							row: 6,
							col: 5,
							expression: calcJson1,
						},
						{
							row: 7,
							col: 5,
							expression: calcJson2,
						},
						{
							row: 8,
							col: 5,
							expression: calcJson3,
						},

					]
				}
			}
		}
		var startTime = new Date().getTime();
		var testBook = new calcWorkbook(workbookJson);
		ok(testBook, 'Workbook created successfully');
		testBook.onCalculationDone(function() {
			var res0 = testBook.worksheets['testWorksheet'].getCell(5, 5).v();
			var endTime = new Date().getTime();
			var elapsed = endTime - startTime;
			equal(Math.abs(res0 - -5.24025146915571) < epsilon, true,"Built workbook cell returns correct calc result (in " + elapsed + "ms)");
			var res1 = testBook.worksheets['testWorksheet'].getCell(6, 5).v();
			
			equal(Math.abs(res1 - -5.24025146915571) < epsilon, true,"Built workbook cell returns correct calc result");
			var res2 = testBook.worksheets['testWorksheet'].getCell(7, 5).v();
			
			equal(Math.abs(res2 - 0.649447172351715) < epsilon, true,"Built workbook cell with reference returns correct calc result");
			var res3 = testBook.worksheets['testWorksheet'].getCell(8, 5).v();
			
			equal(Math.abs(res3 - 0.649447172351715) < epsilon, true,"Built workbook cell with reference returns correct calc result");
			start();
		});
	});
});