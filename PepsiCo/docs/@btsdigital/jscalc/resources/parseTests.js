require(['jsCalcLib/workbook', 'jsCalcLib/calcParser', 'jquery', 'jsCalcLib/numberFormatting'], function (calcWorkbook, calcParser, $, numberFormatting) {
	var testParams = {};
	testParams.tolerance = 0.0000001;
	testParams.tlOutputRegex = /^tlOutput.*$/i;
	test( "Processing Cell", function() {
		var testCell = {
			row: 10,
			col: 6,
			formula: '=62 + E$5 - (E$6 * efficiencyCoefficient ^ A2)',
		}
		var outCell = calcParser.processCell(testCell);
		ok(true, 'Ran without blowing up');
		
	});
	test( "Initial string tokens", function() {
		var testCell = {
			row: 10,
			col: 6,
			formula: '=1+1',
		};
		deepEqual(calcParser.processCell(testCell).expression,{
			type: 'binary',
			operator: 'add',
			A: {
				type: 'value',
				value: 1
			},
			B: {
				type: 'value',
				value: 1
			}}, "Initial tokenify creates correct string");
		testCell = {
			row: 10,
			col: 6,
			formula: '= 1 + 1',
			};
			
		deepEqual(calcParser.processCell(testCell).expression, {
			type: 'binary',
			operator: 'add',
			A: {
				type: 'value',
				value: 1
			},
			B: {
				type: 'value',
				value: 1
			}}, "Initial tokenify creates correct string");
			
			testCell = {
			row: 10,
			col: 6,
			formula: '=10*5%',
			};
			
		deepEqual(calcParser.processCell(testCell).expression, {
			type: 'binary',
			operator: 'mul',
			A: {
				type: 'value',
				value: 10
			},
			B: {
				type: 'value',
				value: .05
			}}, "Percentage tokenify creates correct string");
		//deepEqual(calcParser.tokenify(" 1 + (1+B)"), [{type: 1, token: "1"},{type: 2, token: "+"},{type: 1, token: "1"}], "Initial tokenify creates correct string");
		//deepEqual(calcParser.tokenify(" 1 + SUM(1,B)"), [{type: 1, token: "1"},{type: 2, token: "+"},{type: 1, token: "1"}], "Initial tokenify creates correct string");
		//deepEqual(calcParser.tokenify("SUM($AF32:AH35)"), [{type: 1, token: "1"},{type: 2, token: "+"},{type: 1, token: "1"}], "Initial tokenify creates correct string");
		testCell = {
			row: 10,
			col: 6,
			formula: '=MATCH(4.5, D3:J3,-1)',
			};
		var check = calcParser.processCell(testCell).expression;
		ok(check, "Initial tokenify creates correct string");
			testCell = {
			row: 10,
			col: 6,
			formula: 'Select Initiative',
			};
		var check = calcParser.processCell(testCell).expression;
		equal(check.type, 'string', "Initial tokenify creates correct string");
		testCell = {row: 10,col: 6,	formula: '=IFERROR(E7,12) * 12'};	
		check  = calcParser.processCell(testCell).expression;


		ok(check, "Initial tokenify creates correct string");	
		check  = calcParser.processCell({row: 10,col: 6, formula: "=(M14/INDEX(obalPNLExistSubRev+obalPNLNewSubRev,xxIndexTeam))-1"}).expression;
		//deepEqual(calcParser.tokenify("SUM(1,2,-3)"), [{type: 1, token: "1"},{type: 2, token: "+"},{type: 1, token: "1"}], "Initial tokenify creates correct string for =" + "SUM(1,2,-3)");
		testCell = {
			row: 10,
			col: 6,
			formula: '=IFERROR((G4/INDEX(obalPNLExtraOrdExp,xxIndexTeam))-1,0)',
			};	
		check  = calcParser.processCell(testCell).expression;
		ok(check, "Initial tokenify creates correct string");	
		var out = calcParser.createToken("some_weird_woRkSHHEEE2323NAME!$c$11:$F$15");
		deepEqual(out, {type: 'reference',
						worksheet: 'some_weird_woRkSHHEEE2323NAME',
						startRow: 11,
						startCol: 3,
						endRow: 15,
						endCol: 6}, "Initial tokenify creates correct string");
	});
	test( "Paren matching", function() {
		equal(calcParser.matchParen("SUM(a,b,d,e,g,e,d) + OTHERSUM(bdha)", 3), 17, "matchParen finds correct first paren position");
		equal(calcParser.matchParen("SUM(a,b,d,e,g,e,d) + OTHERSUM(bdha)", 29),  34, "matchParen finds correct second paren close position");
		equal(calcParser.matchParen("SUM(a,b,d,e,g,e,d) + OTHERSUM(bdha", 29),  -1, "matchParen fails due to no matching paren");
		equal(calcParser.matchParen("SUM(a,b,d,e,g,e,d) + OTHERSUM(bdha)", 4), -1, "matchParen fails due to open position not being an open paren");
		equal(calcParser.matchParen("SUM(a,b,d,e,g,e,d) + OTHERSUM(bdha)", 26),  -1, "matchParen fails due to open position not being an open paren");
		//quote matching
		equal(calcParser.matchDelimiter("'Hello' & 21 & 'World'", 0, "'"), 6, "matchDelimiter found correct closing quote");
	});
	var epsilon = 0.000000001;
	test("Regex tests", function() {
		ok(calcParser.range1Regex.exec("A1"), "Basic single range accepted");
		ok(calcParser.range1Regex.exec("A1:B53"), "Basic range accepted");
		ok(!calcParser.range1Regex.exec("A1:"), "Rejected invalid range");
		ok(!calcParser.range1Regex.exec("A1:5"), "Rejected invalid range");
		ok(calcParser.range1Regex.exec("$A$1:$C$5"), "Accept Range with Anchors");
		ok(calcParser.range1Regex.exec("$C$26:$Q$103"), "Accept mid-book range with Anchors");
		ok(calcParser.range1Regex.exec("some_weird_woRkSHHEEE2323NAME!$A$1:$C$5"), "Accept Range with worksheet name and anchors");
		ok(calcParser.identifierRegex.exec("B"), "Accept identifier character");
		ok(calcParser.identifierRegex.exec("."), "Accept identifier character");
		ok(calcParser.identifierRegex.exec("1"), "Accept identifier character");
		ok(calcParser.identifierRegex.exec("a"), "Accept identifier character");
		ok(calcParser.booleanRegex.test("TRUE"), "Accept boolean true");
		ok(calcParser.booleanRegex.test("FALSE"), "Accept boolean false");
		ok(!calcParser.booleanRegex.test("FALSEish"), "Reject invalid boolean");	
		ok(calcParser.errorRegex.test("#REF!"), "correctly identify error");	
		ok(calcParser.fullOpRegex.test("+"), "correctly identify operator +");				
		ok(calcParser.fullOpRegex.test("-"), "correctly identify operator -");				
		ok(calcParser.fullOpRegex.test("*"), "correctly identify operator *");				
		ok(calcParser.fullOpRegex.test("/"), "correctly identify operator /");				
		ok(calcParser.fullOpRegex.test("^"), "correctly identify operator ^");				
		ok(calcParser.fullOpRegex.test("&"), "correctly identify operator &");				
		ok(calcParser.fullOpRegex.test("="), "correctly identify operator =");				
		ok(calcParser.fullOpRegex.test("<>"), "correctly identify operator <>");				
		ok(calcParser.fullOpRegex.test("<="), "correctly identify operator <=");				
		ok(calcParser.fullOpRegex.test(">="), "correctly identify operator >=");				
		ok(calcParser.fullOpRegex.test("<"), "correctly identify operator <");				
		ok(calcParser.fullOpRegex.test(">"), "correctly identify operator >");	
		ok(calcParser.fullOpRegex.test(","), "correctly identify seperator ,");	
		ok(!calcParser.fullOpRegex.test("*-"), "correctly reject operator *-");	
		ok(calcParser.sciNoteRegex.test('9.852363E12'), "Positive scientific notation correctly tested");
		var regOut = calcParser.sciNoteRegex.exec('9.852363E12');
		equal(regOut[1], '9.852363', "Positive scientific notation regex captures first part properly");
		equal(regOut[2], '12', "Positive scientific notation regex captures second part properly");

		ok(calcParser.sciNoteRegex.test('9.852363E-12'), "Negative scientific notation correctly tested");
		var regOut = calcParser.sciNoteRegex.exec('-9.852363E-12');
		equal(regOut[1], '-9.852363', "Negative scientific notation regex captures first part properly");
		equal(regOut[2], '-12', "Negative scientific notation regex captures second part properly");/*ok(calcParser.rangeMultiRegex.test("$E$183:$G$187,mmProd1!$E$207:$G$208,mmProd1!$E$222:$G$223,mmProd1!$E$237:$G$238,mmProd1!$E$252:$G$253,mmProd1!$E$267:$G$268"), "accept multi range range");
		var multiRangeRegexOut = calcParser.rangeMultiRegex.exec("$E$183:$G$187,mmProd1!$E$207:$G$208,mmProd1!$E$222:$G$223,mmProd1!$E$237:$G$238,mmProd1!$E$252:$G$253,mmProd1!$E$267:$G$268");*/
		ok(calcParser.rangeColRegex.test("Somegifushdfihu!F:F"), "column regex correctly accept columnar range");		
		ok(!calcParser.rangeColRegex.test("Somegifushdfihu!F1:F2"), "column regex correctly reject non-columnar range");		
		ok(calcParser.rangeRowRegex.test("Somegifushdfihu!3:4"), "row regex correctly accept row range");		
		ok(!calcParser.rangeRowRegex.test("Somegifushdfihu!F1:F2"), "row regexcorrectly reject non-row range");		
		var rowOut = calcParser.rangeRowRegex.exec("Somegifushdfihu!3:4");
		var rangeOut = calcParser.range1Regex.exec("some_weird_woRkSHHEEE2323NAME!$A$1:$C$5");
		var regexOutput = calcParser.worksheetFuncRegex.exec("SUM(sifdujoh(jhiads), dsjfhisd(fjkdshfik))");
		equal(regexOutput[1], "SUM", "Regex correctly captures function name");
		var valToken = calcParser.createToken("27.5%");
		deepEqual(valToken, {type: 'value',	value: .275}, 'Parser creates correct percentage token');
		equal(numberFormatting.customFormatFunctions.Date(0), "12/31/1899", 'Number Formatting module returns correct date for 0 value.');
		});
	
	test("Workbook XML - named range processing", function() {
			var xmlText = '<?xml version="1.0" encoding="ISO-8859-1"?><workbook name="testBook"><r n="tlInputOperandA" s="global" ts="Sheet1" ta="$E$3"></r><r n="tlInputOperandB" s="global" ts="Sheet1" ta="$E$4"></r><r n="tlOutputResult" s="global" ts="Sheet1" ta="$E$5"></r><r n="tlOutputMultiCellRange" s="global" ts="Sheet1" ta="$E$3:$E$5"></r><c f="1" a="$E$3" r="3" c="5" w="Sheet1"></c><c f="1" a="$E$4" r="4" c="5" w="Sheet1"></c><c f="=E3+E4" a="$E$5" r="5" c="5" w="Sheet1"></c></workbook>';
			var xmlOb = $.parseXML(xmlText);
			var wbookJson = calcParser.processWorkbookXml(xmlOb);
			equal(calcParser.errorLog.length, 0, "Workbook parse ran without blowing up.");
			deepEqual(wbookJson.namedRanges['tlInputOperandA'], {
				worksheet: 'Sheet1',
				startRow: 3,
				startCol: 5,
				endRow: 3,
				endCol: 5
				}, 'Workbook parser properly parses single cell named range');
			deepEqual(wbookJson.namedRanges['tlOutputMultiCellRange'], {
				worksheet: 'Sheet1',
				startRow: 3,
				startCol: 5,
				endRow: 5,
				endCol: 5
				}, 'Workbook parser properly parses multi cell named range');
				
			var testBook = new calcWorkbook({modelJSON: wbookJson});
			testBook.forceCalculate();
			ok(testBook, 'Workbook created successfully');
			var res0 = testBook.worksheets['Sheet1'].getCell(3, 5);
			equal(res0.num(), 1, "First input value from parsed workbook returns correct result");
			res0 = testBook.worksheets['Sheet1'].getCell(4, 5);
			equal(res0.num(), 1, "First input value from parsed workbook returns correct result");
			res0 = testBook.worksheets['Sheet1'].getCell(5, 5);
			equal(res0.num(), 2, "Calculated output from parsed workbook returns correct result");
		});
		
	
	
	asyncTest("Workbook XML - Import from SimpleWorkbook Sim XML file", 2, function() {	
		$.ajax({
			url: './models/simpleWorkbook.xml',
			dataType: 'xml',
			complete: function(response) {
				var wbookJson = calcParser.processWorkbookXml(response.responseXML);
				equal(calcParser.errorLog.length, 0, "Workbook parse ran without blowing up.");
				for(var i = 0; i < calcParser.errorLog.length; i++) {
					ok(true, calcParser.errorLog[i].toString());
				}
				var testBook = new calcWorkbook({modelJSON: wbookJson});
				testBook.forceCalculate();
				
				ok(true, "Calc workbook built containing " + testBook.cellCount + " cells.  Initial calculation took " + testBook.elapsed + "ms");
				for(var i in testBook.unsupportedFunctionList) {
					ok(true, "Unsupported function used: " + i + " (" + testBook.unsupportedFunctionList[i] + " times)");
				}
				
				start();
			}		
		});
	});
	asyncTest("Workbook XML - Import from SimpleWorkbook Sim XML file", 2, function() {	
		$.ajax({
			url: './models/WiBTRSimYr0.xml',
			dataType: 'xml',
			complete: function(response) {
				var wbookJson = calcParser.processWorkbookXml(response.responseXML);
				equal(calcParser.errorLog.length, 0, "Workbook parse ran without blowing up.");
				for(var i = 0; i < calcParser.errorLog.length; i++) {
					ok(true, calcParser.errorLog[i].toString());
				}
				var testBook = new calcWorkbook({modelJSON: wbookJson});
				testBook.forceCalculate();
			
				ok(true, "Calc workbook built containing " + testBook.cellCount + " cells.  Initial calculation took " + testBook.elapsed + "ms");
				for(var i in testBook.unsupportedFunctionList) {
					ok(true, "Unsupported function used: " + i + " (" + testBook.unsupportedFunctionList[i] + " times)");
				}
				
				start();
			}		
		});
	});
});
