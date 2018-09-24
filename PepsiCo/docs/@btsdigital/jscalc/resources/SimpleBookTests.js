require(['jsCalcLib/workbook', 'jsCalcLib/calcParser', '../lib/jquery', 'jsCalcLib/jsCalc', '../models/simpleWorkbook-require'], function (calcWorkbook, calcParser, $, jsCalcAPI, model) {
	var testParams = {};
	testParams.tolerance = 0.0000001;
	testParams.tlOutputRegex = /^tlOutput.*$/i;
	
	test("Simple Workbook Test", function() {	
		var curAPI = new jsCalcAPI({model: model, loadCallback: function(){}, buildAsync: false});
		var testBook = curAPI.getBook();
		for(var i in testBook.unsupportedFunctionList) {
			ok(true, "Unsupported function used: " + i + " (" + testBook.unsupportedFunctionList[i] + " times)");
		}
		testBook.forceCalculate();
		ok(true, "Calc workbook built containing " + testBook.cellCount + " cells.  Initial calculation took " + testBook.elapsed + "ms");
		var outputNames = testBook.getNames(testParams.tlOutputRegex);
		for(var i = 0; i < outputNames.length; i++) {
			var curName = outputNames[i];
			var testOutput = testBook.getRange(curName).eachCell(function() {
				if(parseFloat(this.origValue)) {
					var val = this.num();
					var testVal = parseFloat(this.origValue);
					ok(Math.abs(val - testVal) <= testParams.tolerance, curName + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
				} else {
					var val = this.s();
					var testVal = this.origValue;
					ok(testVal.toUpperCase() == val.toUpperCase(), curName + " results match those exported from workbook Expected[" + this.origValue + "] output[" + val.toString() + "]");
				} 
			});
		}
		var origValArray = curAPI.getRangeRef('tlOutputCopyRange').valueArray();
		curAPI.copyAndPasteByValue('tlOutputCopyRange', 'tlOutputPasteRange0');
		testBook.forceCalculate();
		var valOutArray = curAPI.getRangeRef('tlOutputPasteRange0').valueArray();
		deepEqual(origValArray, valOutArray, 'copy paste by value into same sized range returns correct result');
		curAPI.setValue('tlOutputPasteRange4', [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
		var resultValArray = curAPI.getRangeRef('tlOutputPasteRange4').valueArray();
		deepEqual(resultValArray, [[1,2,3,5],[4,5,6,5],[7,8,9,5],[5,5,5,5],[5,5,5,5],[5,5,5,5]], "array value to setValue works");
		var resultValArrayGet = curAPI.getValue('tlOutputPasteRange4');
		deepEqual(resultValArray, resultValArrayGet, 'getValue returns correct result for multi dimensional array');
		var resultValGet = curAPI.getValue('CopyPastaTests!O14');
		equal(resultValGet, 9, 'getValue returns correct result for single value');
		curAPI.setValue('CopyPastaTests!O14', 12);
		resultValGet = curAPI.getValue('CopyPastaTests!O14');
		equal(resultValGet, 12, 'getValue returns correct result for single set value');
	});
});
