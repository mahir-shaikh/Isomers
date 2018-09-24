require(['jsCalcLib/workbook', 'jsCalcLib/calcParser', '../lib/jquery', '../models/WiBTRSimYr0-require', 'jsCalcLib/numberFormatting'], function (calcWorkbook, calcParser, $, model, numberFormatting) {
	var testParams = {};
	testParams.tolerance = 0.01;
	testParams.pctTolerance = 0.001;
	testParams.tlOutputRegex = /^tlOutput.*$/i;
	
	test("Workbook XML - Import from TR Sim JSON file", function() {	
		ok(true, "Starting TR validation tests - note: some failures in this test are expected due to calculation approximation functions and Excel date strangeness.  Calculations that are off by very small amounts are fine, and date strings which display a day later than the exported Excel data shouldn't be considered failures.");
		var startTime = new Date().getTime();
		var endTime;
		var elapsed;

		startTime = new Date().getTime();
		var testBook = new calcWorkbook({modelJSON: model});
		
		endTime = new Date().getTime();
		elapsed = endTime - startTime;
		equal(calcParser.errorLog.length, 0, "Workbook built in " + elapsed + "ms.");
		for(var i in testBook.unsupportedFunctionList) {
			ok(false, "Unsupported function used: " + i + " (" + testBook.unsupportedFunctionList[i] + " times)");
		}
		startTime = new Date().getTime();
		testBook.forceCalculate();
		
		var highParentCells = testBook.lotsOfParents.length;
		ok(true, 'Workbook contains ' + highParentCells + ' cells with extremely high quantities of parents');
		endTime = new Date().getTime();
		elapsed = endTime - startTime;
		ok(true, "Calc workbook built containing " + testBook.cellCount + " cells.  Initial calculation took " + testBook.elapsed + "ms (" + elapsed + "ms via external timing");
		
		var outputNames = testBook.getNames(testParams.tlOutputRegex);
		for(var i = 0; i < outputNames.length; i++) {
			var curName = outputNames[i];
			var curCellNum = 0;
			var testOutput = testBook.getRange(curName).eachCell(function() {
				if(this.nf && this.nf == "Date") {
					val = this.value.num(this);
					var dateString = numberFormatting.format(val, "Date");
					equal(dateString, this.origValue, curName + "[" + curCellNum + "]" + " results match those exported from workbook Expected[" + this.origValue + "] output[" + dateString + "]");
				} else if(parseFloat(this.origValue)) {
					if(this.origValue.charAt) {
						if (this.origValue.charAt(this.origValue.length - 1) == "M") {
							//date format, won't match up
							return;
						}
					}
					var val = this.value.num(this);
					var testVal = parseFloat(this.origValue);
					if(Math.abs(testVal) < 100) {
						if(Math.abs(val - testVal) > testParams.tolerance) {
							ok(Math.abs(val - testVal) <= testParams.tolerance, curName + "[" + curCellNum + "]" + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
						}
					} else {
						var pctDiff = Math.abs(val/testVal -1);
						if(pctDiff > testParams.pctTolerance) {
							var pctFormat = pctDiff * 100;
							ok(pctDiff <= testParams.pctTolerance, curName + "[" + curCellNum + "]" + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "] " + pctFormat + "%");
						}
					}
				} else {
					var val = this.value.s(this);
					var testVal = this.origValue;
					if(testVal == "#NA!") {
						if (val == "#N/A") {
							//ok(true, curName + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
						} else {
							ok(false, curName + "[" + curCellNum + "]" + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
						}						
					}
					else if(testVal) {
						if(testVal.toUpperCase && val.toUpperCase) {
							if(testVal == "0" && val == "#UNINITIALIZED!") {
							
							} else 	if(testVal.toUpperCase() != val.toUpperCase()) {
								ok(false, curName + "[" + curCellNum + "]" + " results match those exported from workbook Expected[" + testVal.toUpperCase() + "] output[" + val.toUpperCase() + "]");
							}
						}
						else {
							if(testVal.toString() != val.toString()) {
								ok(false, curName + "[" + curCellNum + "]" + " results match those exported from workbook Expected[" + testVal.toString() + "] output[" + val.toString() + "]");
							}
						}
					}
				} 
				curCellNum++;
			});

		}	
		ok("Hi");
	});
	
	/*
	asyncTest("Workbook XML - Import from TR Sim XML file", 1, function() {	
		$.ajax({
			url: './resources/WiBTRSimYr0.xml',
			dataType: 'xml',
			complete: function(response) {
				var startTime = new Date().getTime();
				var endTime;
				var elapsed;
				var wbookJson = calcParser.processWorkbookXml(response.responseXML);
				endTime = new Date().getTime();
				elapsed = endTime - startTime;
				equal(calcParser.errorLog.length, 0, "Workbook parse ran without blowing up in " + elapsed + "ms.");
				for(var i = 0; i < calcParser.errorLog.length; i++) {
					ok(true, calcParser.errorLog[i].toString());
				}
				startTime = new Date().getTime();
				var testBook = new calcWorkbook(wbookJson);
				endTime = new Date().getTime();
				elapsed = endTime - startTime;
				equal(calcParser.errorLog.length, 0, "Workbook built in " + elapsed + "ms.");
				for(var i in testBook.unsupportedFunctionList) {
					ok(true, "Unsupported function used: " + i + " (" + testBook.unsupportedFunctionList[i] + " times)");
				}
				startTime = new Date().getTime();
				testBook.forceCalculate();
								endTime = new Date().getTime();
				elapsed = endTime - startTime;
				ok(true, "Calc workbook built containing " + testBook.cellCount + " cells.  Initial calculation took " + testBook.elapsed + "ms (" + elapsed + "ms via external timing");
				
				var outputNames = testBook.getNames(testParams.tlOutputRegex);
				for(var i = 0; i < outputNames.length; i++) {
					var curName = outputNames[i];
					var testOutput = testBook.getRange(curName).eachCell(function() {
						if(parseFloat(this.origValue)) {
							var val = this.value.num(this);
							var testVal = parseFloat(this.origValue);
							ok(Math.abs(val - testVal) <= testParams.tolerance, curName + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
						} else {
							var val = this.value.s(this);
							var testVal = this.origValue;
							if(testVal) {
								ok(testVal.toUpperCase() == val.toUpperCase(), curName + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
							}
						} 
					});

				}
				startTime = new Date().getTime();
				res0 = testBook.getRange("xxSim0Tool1");
				res0.setValue(1);
				res0 = testBook.getRange("xxYear");
				res0.setValue(1);
				res0 = testBook.getRange("tlInputSpecProg1");
				res0.setValue('1: Selling Value in Transform');
				testBook.forceCalculate();
				res0 = testBook.getRange("tlInputProd1Units");
				res0.setValue(30000);			
				testBook.onCalculationDone(function() {
					endTime = new Date().getTime();
					elapsed = endTime - startTime;
					ok(true, "Asynch benchmark finished calculating asynchronously in " + elapsed + "ms");
					start();
				});
			}		
		});
	});
	*/
	/*asyncTest("Workbook XML - Import from TR Sim JSON file", 1, function() {	
		$.ajax({
			url: './resources/WinningTRSimYr0.json',
			dataType: 'json',
			complete: function(response) {
				var wbookJson = response.responseJSON;
				equal(calcParser.errorLog.length, 0, "Workbook parse ran without blowing up.");
				for(var i = 0; i < calcParser.errorLog.length; i++) {
					ok(true, calcParser.errorLog[i].toString());
				}
				var testBook = new calcWorkbook(wbookJson);
				ok(true, "Calc workbook built containing " + testBook.cellCount + " cells.");
				for(var i in testBook.unsupportedFunctionList) {
					ok(true, "Unsupported function used: " + i + " (" + testBook.unsupportedFunctionList[i] + " times)");
				}
				
				start();
			}		
		});
	});*/
});
