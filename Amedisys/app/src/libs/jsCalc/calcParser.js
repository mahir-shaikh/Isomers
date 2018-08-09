// var fs = require('fs');
//
//if(!define) 
//define(function() {
var cp = function() {
	var calcParser = {};
	calcParser.operators = ["+", "-", "*", "/", "^", "&", "=", "<=", ">=", "<>", "<", ">", ",", "&&", "||", "==", "!="];

	/*
	pseudo:
	get next token - consume characters off of front of formula until an operator or parentheses are encountered

	identify token: if numeric, is constant
		otherwise, is an identifier
		if followed by open parens, function -
			Get function identifier and parse each comma seperated argument to the function via recursion
		else reference
		
		When open parens are encountered



	*/
	try {
	if(window !== undefined) {
		calcParser.log = window.console ? console.log : function(){};
	} 
	} catch(e) {
		if (console) {
			calcParser.log = console.log;
		} else {
			calcParser.log = function(){};
		}
	}
	calcParser.alphaRegex = /^[a-zA-Z]{1}$/i;
	calcParser.numRegex = /^[0-9]$/i;
	calcParser.fullNumRegex = /^[0-9\.\%]+$/i;
	calcParser.booleanRegex = /^(TRUE|FALSE)$/i;
	calcParser.opRegex = /^[\+\-\*\/\^\&\=\<\>\,\|]+$/i;
	calcParser.fullOpRegex = /^(\+|\-|\*|\/|\^|\&|\=|\<\=|\>\=|\<\>|\<|\>|\,|\|\||\&\&|\=\=|\!\=)$/i;
	calcParser.identifierRegex = /^[a-zA-Z\:\.\!\$\_0-9]+$/i;
	calcParser.range1Regex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*))?$/i;
	calcParser.rangeColRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})(?::\$?([a-zA-Z]{1,2}))?$/i;
	calcParser.rangeRowRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([1-9][0-9]*)(?::\$?([1-9][0-9]*))?$/i;
	calcParser.rangeMultiRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*))(\,(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)))+?$/i;
	calcParser.errorRegex = /^(#REF\!|#VALUE\!|#DIV0\!|#NAME\!)$/i;
	calcParser.worksheetFuncRegex = /^([A-Z\.]+)\(.*$/;
	//?[:[a-zA-Z]+[1-9][0-9]*]?$/i;
	calcParser.sciNoteRegex = /^(\-?[0-9]+\.[0-9]+)[Ee](\-?[0-9]+)$/i;	
	calcParser.charTypes = {};
	calcParser.charTypes.alpha = 1;
	calcParser.charTypes.number = 2;
	calcParser.charTypes.operator = 3;
	calcParser.charTypes.unknown = -1;
	calcParser.charTypes.openParen = 10;
	calcParser.charTypes.openQuotes = 11;
	calcParser.tokenTypes = {};
	calcParser.tokenTypes.identifier = 1;
	calcParser.tokenTypes.number = 2;
	calcParser.tokenTypes.operator = 3;
	calcParser.tokenTypes.subExpression = 4;
	calcParser.tokenTypes.func = 5;
	calcParser.tokenTypes.stringLiteral = 6;
	calcParser.tokenTypes.unknown = -1;
	calcParser.curCell;
	calcParser.curSheet;
	/*
	<?xml version="1.0" encoding="ISO-8859-1"?>
	<workbook name='testBook'>
		<r n="tlInputOperandA" s="global" ts="Sheet1" ta="$E$3"></r>
		<r n="tlInputOperandB" s="global" ts="Sheet1" ta="$E$4"></r>
		<r n="tlOutputResult" s="global" ts="Sheet1" ta="$E$5"></r>
		<c f="1" a="$E$3" r="3" c="5" w="Sheet1"></c>
		<c f="1" a="$E$4" r="4" c="5" w="Sheet1"></c>
		<c f="=E3+E4" a="$E$5" r="5" c="5" w="Sheet1"></c>
	</workbook>

	to
	
	{
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
					]
				}
		}
	}
	
	
	
	*/
	calcParser.errorLog = [];
	
	calcParser.findXMLElem = function(xml, findElement) {
		var out = [];
		var curChild = xml.firstChild;
		if(curChild) {
			if(curChild.localName == findElement) {
				out.push(curChild);
			}
			out = out.concat(calcParser.findXMLElem(curChild, findElement));
			while(curChild.nextSibling) {
				curChild = curChild.nextSibling;
				if(curChild.localName == findElement) {
					out.push(curChild);
				}
				out = out.concat(calcParser.findXMLElem(curChild, findElement));
			}
		}
		return out;
	}
	
	calcParser.forEach = function(elemArray, func) {
		for(var i = 0; i < elemArray.length; i++) {
			func.call(elemArray[i]);
		}
	}
	
	calcParser.getAttributeValue = function(xml, attributeName) {
		for(var i = 0; i < xml.attributes.length; i++) {
			if(xml.attributes[i].localName == attributeName) return xml.attributes[i].nodeValue;
		}
		return null;
	}
	
	calcParser.processWorkbookXml = function(xml) {
		//try {
		
		//calcParser.log(xml.toString());
		
		calcParser.errorLog = [];
		var workbookJson = {};
		var workbook = calcParser.findXMLElem(xml,'workbook');
		if(!workbook.length) return;
		workbook = workbook[0];
		workbookJson.name = calcParser.getAttributeValue(workbook, 'name') || 'defaultWorkbookName';
		//var workbookOb = $(xml).find('workbook').get(0);
		//var workbook = $(xml).find('workbook');
		//workbookJson.name = $(workbook).attr('name') || 'defaultWorkbookName';
		workbookJson.namedRanges = {};
		workbookJson.worksheets = {};
		//find all worksheets and create sheet objects (ideally there would be a more efficient way of doing this, but with current xml
		//I think this is the only robust way
		var cells = calcParser.findXMLElem(workbook, 'c');
		calcParser.forEach(cells,function() {
			if(calcParser.getAttributeValue(this,"w")) {
				var sheetName = calcParser.getAttributeValue(this,"w");
				if(!workbookJson.worksheets[sheetName]) {
					workbookJson.worksheets[sheetName] = {
						namedRanges: {},
						cells: [],
					};
				}
			}
		});
		var rangeNames = calcParser.findXMLElem(workbook, 'r');
		calcParser.forEach(rangeNames, function() {
			var name = calcParser.getAttributeValue(this,"n") || 'undefined'; //if undefined, should log a parsing error
			if(name == 'undefined') {
				calcParser.errorLog.push("Named range has undefined name: " + this.toString());
				return;
			}
			var scope = calcParser.getAttributeValue(this, "s") || "global";
			var worksheetTarget = calcParser.getAttributeValue(this,"ts") || "undefined";
			if(worksheetTarget == 'undefined') {
				calcParser.errorLog.push("Named range '"+ name +"'has undefined target sheet: " + this.toString());
				return;
			}
			
			var address = calcParser.getAttributeValue(this,"ta") || "undefined";
			var a = address.indexOf("REF");
	
			if(address == "undefined" || calcParser.errorRegex.test(address)) {
				calcParser.errorLog.push("Named range '"+ name +"'has undefined or errored target address: " + address);
				return;
			}
			var addressOb = calcParser.getRCNotation(address);
			if(!addressOb) {
				calcParser.errorLog.push("Named range '"+ name +"'has undefined target address: " + this.toString());
				return;
			}
			if(scope == "global") {
				workbookJson.namedRanges[name] = {
					worksheet: worksheetTarget,
					startRow: addressOb.startRow,
					startCol: addressOb.startCol,
					endRow: addressOb.endRow || addressOb.startRow,
					endCol: addressOb.endCol || addressOb.startCol
				}
			} else {
				if(workbookJson.worksheets[scope]) {
					workbookJson.worksheets[scope].namedRanges[name] = {
							worksheet: worksheetTarget,
							startRow: addressOb.startRow,
							startCol: addressOb.startCol,
							endRow: addressOb.endRow || addressOb.startRow,
							endCol: addressOb.endCol || addressOb.startCol
						
					}
				}
			}
		});
		//process cells
//        eventContentJSON = "{\"scenes\": [\n{\n";
//        var oldEventID = ""        
        
		calcParser.forEach(cells,function() {
            
			var sheetName = calcParser.getAttributeValue(this,"w");
			var sheetOb = workbookJson.worksheets[sheetName];
			var cellData = {};
			cellData.row = calcParser.getAttributeValue(this,"r");
			cellData.col = calcParser.getAttributeValue(this,"c");
			cellData.formula = calcParser.getAttributeValue(this,"f");
            
//            var textRanges = (sheetName.indexOf("tx_") != -1 ? true : false);
//            
//            if (textRanges || (sheetName == "Opportunities") || (sheetName == "Events") || (sheetName == "ReadUpdates") || (sheetName == "Investments") || (sheetName == "Meetings") || (sheetName == "Messages") || (sheetName == "Initiatives") || (sheetName == "Feedback") || (sheetName == "General")) {
//                calcParser.forEach(rangeNames, function() {
//                    var address = calcParser.getAttributeValue(this,"ta") || "undefined";
//                    var addressOb = calcParser.getRCNotation(address);
//                    var name = calcParser.getAttributeValue(this,"n") || "undefined";
//                    var worksheetTarget = calcParser.getAttributeValue(this,"ts") || "undefined";
//                   
//                    if ((cellData.row == addressOb.startRow) && (cellData.col == addressOb.startCol) && (sheetName == worksheetTarget)) {
//                        // 'xx.' is the separator between the event ID (needed for the range name) and the local attribute name
//                        // such as xxR1E1xx.revenue and xxR1E1xx.narrative
//                        nameLoc = name.indexOf("xx.");
//                        if (nameLoc != -1) {
//                            attribute = name.slice(nameLoc+3);
//                            eventID = name.slice(2, nameLoc);
//                        } else {
//                            eventID = name;
//                        }
//                        // this section makes the assumption that all range names will be grouped in the export. this should be verified.
//                        if ((eventID != oldEventID) && (oldEventID != "")) {
//                            eventContentJSON = eventContentJSON.slice(0,eventContentJSON.length-2) + "\n}, {\n";
//                        }
//                        oldEventID = eventID;
//                        var localFormula = cellData.formula;
//                        localFormula = localFormula.replace(/["]+/g, '&quot;');
//                        eventContentJSON += ("    \"" + attribute + "\": \"" + localFormula + "\",\n");
//                    }
//                });
//            }
//            
//            
			if(calcParser.getAttributeValue(this,"v")) {
				cellData.v = calcParser.getAttributeValue(this,"v");
				if (calcParser.sciNoteRegex.test(cellData.v)) {
					var regOut = calcParser.sciNoteRegex.exec(cellData.v);
					var num = parseFloat(regOut[1]);
					var exp = parseFloat(regOut[2]);
					cellData.v = num * Math.pow(10, exp);
				}
			}
			if(calcParser.getAttributeValue(this,"fmt")) {
				var tempFormat = calcParser.getAttributeValue(this,"fmt");
				if(tempFormat.indexOf(';') >= 0) {
					tempFormat = tempFormat.substring(0, tempFormat.indexOf(';'));
				}
				tempFormat = tempFormat.replace(/_/g, " ");
				tempFormat = tempFormat.replace(/#/g, "0");
				tempFormat = tempFormat.replace(/\*/g, "");
				tempFormat = tempFormat.replace(/\(/g, "");
				tempFormat = tempFormat.replace(/\)/g, "");
				if(tempFormat.indexOf("d-mmm") >= 0) {
					//date format - days after 12/31/1899
					tempFormat = "Date";
				}
				cellData.fmt = tempFormat;
				if(tempFormat != calcParser.getAttributeValue(this,"fmt")) {
				//console.log("Took initial format string: " + calcParser.getAttributeValue(this,"fmt"));
				//console.log("And transformed it into: " + tempFormat);
				}
			}
			cellData.sheetName = sheetName;

			sheetOb.cells.push(calcParser.processCell(cellData));

		});
//        
//        eventContentJSON = eventContentJSON.slice(0,eventContentJSON.length-2) + "\n}\n]}";
//        
//        fs.writeFile("EventContent.json", eventContentJSON, function(err) {
//            if(err) {
//                console.log("Unknown error saving EventContent.json");
//            } else {
//                console.log("EventContent.json saved successfully");
//            }
//
//        });
//
		return workbookJson;
		//}
		//catch(e) {
		//	calcParser.errorLog.push(e);
		//	return null;
		//}
	}
	
	
	calcParser.processCell = function(cellData) {
		//try {
			calcParser.curCell = cellData;
			var formula = cellData.formula;
			var cellJson = {};
			cellJson.row = cellData.row;
			cellJson.col = cellData.col;
			cellJson.f = cellData.formula;
			if(cellData.v) cellJson.v = cellData.v;
			if(cellData.fmt) cellJson.nf = cellData.fmt;
			cellJson.expression = calcParser.processFormula(cellJson.f);
			/*if(formula.length > 0) {
				if(formula.charAt(0) == '=') {
					//for setting breakpoints on specific cells while debugging parser
					
					cellJson.expression = calcParser.tokenify(formula.substring(1));
					if(!cellJson.expression) {
						cellJson.expression	= calcParser.createToken('0');
					}
					cellJson.expression = calcParser.processOpOrder(cellJson.expression);
					//formula
				} else {
					//value
					if(calcParser.fullNumRegex.test(formula)) {
						cellJson.expression	= calcParser.createToken(formula);
					} else if(formula.toUpperCase() == "TRUE" || formula.toUpperCase() == "FALSE") {
						var boolVal = formula.toUpperCase() == "TRUE";
						cellJson.expression	= {
							type: 'bool',
							value: boolVal,
						}
					} else	{
						cellJson.expression	= {
							type: 'string',
							value: formula,
						}					
					}
				}
			}*/
			return cellJson;
		/*} catch(e) {
			calcParser.errorLog.push(e);
			return null;
		}*/
	
	}
	
	calcParser.processFormula = function(formula) {
		var outExpression = null;
		if(formula.length > 0) {
			if(formula.charAt(0) == '=') {
				//for setting breakpoints on specific cells while debugging parser
				/*if(cellData.row == 46 && cellData.col == 8 && cellData.sheetName == 'toolForecastingPrice') {
					alert("Stop here");
				}
				if(cellData.row == 273 && cellData.col == 5 && cellData.sheetName == 'cap') {
					alert("Stop here");
				}*/
				outExpression = calcParser.tokenify(formula.substring(1));
				if(!outExpression) {
					outExpression	= calcParser.createToken('0');
				}
				outExpression = calcParser.processOpOrder(outExpression);
				//formula
			} else {
				//value
				if(calcParser.fullNumRegex.test(formula)) {
					outExpression	= calcParser.createToken(formula);
				} else if(formula.toUpperCase() == "TRUE" || formula.toUpperCase() == "FALSE") {
					var boolVal = formula.toUpperCase() == "TRUE";
					outExpression	= {
						type: 'bool',
						value: boolVal,
					}
				} else	{
					outExpression = {
						type: 'string',
						value: formula,
					}					
				}
			}
		}
		return outExpression;
	}
	
	
	
	
	
	
	
	calcParser.tokenify = function(inString, inFunctionParens) {
		var output = "";
		if(inString.length < 1) return;
		var curChar = inString[0];

		var tokenArray = [];
		var tokenStarted = false;
		var tokenType = -1;
		var curToken = "";
		var checkCurTypeRegex = null;
		//start at 1 to skip leading =
	
			
				
		var i = 0;
		while(i < inString.length) {
			var curChar = inString.charAt(i)
			tokenType = calcParser.getCharType(curChar);
			while(tokenType == calcParser.charTypes.unknown && i < inString.length) {
				i++;
				if(i < inString.length) {
					curChar = inString.charAt(i);
					tokenType = calcParser.getCharType(curChar);
				}
			}
			if(i >= inString.length && tokenType == calcParser.charTypes.unknown) {
				break;
			}
			tokenType = calcParser.getCharType(curChar);
			switch(tokenType) {
				case calcParser.charTypes.alpha:
					tokenType = calcParser.tokenTypes.identifier;
					checkCurTypeRegex = calcParser.identifierRegex;
					break;
				case calcParser.charTypes.number:
					tokenType = calcParser.tokenTypes.number;
					checkCurTypeRegex = calcParser.fullNumRegex;
					break;
				case calcParser.charTypes.operator:
					tokenType = calcParser.tokenTypes.operator;
					checkCurTypeRegex = calcParser.opRegex;
					break;
				case calcParser.charTypes.openQuotes:
					var delimiter = curChar;
					var endString = calcParser.matchDelimiter(inString, i, delimiter);
					var quoteString = inString.substring(i + 1, endString);
					var token = {type: 'string', value: quoteString};
					if(endString == -1) {
						throw("expression can't be tokenized: Open quote encountered without closing quote");
					}
					tokenArray.push(token);
					i = endString + 1;
					continue;
					break;
				case calcParser.charTypes.openParen:
					var endParen = calcParser.matchParen(inString, i);
					var subToken = inString.substring(i + 1, endParen);
					if(tokenArray.length > 0) {
						if(tokenArray[tokenArray.length - 1].type == 'namedRangeReference') {
							tokenArray[tokenArray.length - 1].type = 'wsFunc';
							if(subToken.length > 0) tokenArray[tokenArray.length - 1].argExpressionArray = calcParser.tokenify(subToken, true);
							else tokenArray[tokenArray.length - 1].argExpressionArray = [];
						} else {
							tokenArray.push({type: calcParser.tokenTypes.subExpression, expression: calcParser.tokenify(subToken)});;
						}
					} else {
						tokenArray.push({type: calcParser.tokenTypes.subExpression, expression: calcParser.tokenify(subToken)});
					}
					//
					i = endParen + 1;
					continue;
					break;
				default:
					checkCurTypeRegex = null;
			}
			if(checkCurTypeRegex) {
				tokenStarted = true;
			}
			if(tokenType == calcParser.tokenTypes.operator) {
				while(i < inString.length && checkCurTypeRegex.test(curChar) && calcParser.fullOpRegex.test(curToken + curChar)) {
					curToken += curChar;
					i++;
					if(i < inString.length) curChar = inString.charAt(i);
				}
			} else {
				while(i < inString.length && checkCurTypeRegex.test(curChar)) {
					curToken += curChar;
					i++;
					if(i < inString.length) curChar = inString.charAt(i);
				}
			}
			var fullToken = calcParser.createToken(curToken);
			//if(inFunctionParens) fullToken = calcParser.wrapExpression(fullToken);
			tokenArray.push(fullToken);
			curToken = "";
			
		}
			
		

		return tokenArray;
		
	}

	calcParser.wrapExpression = function(token) {
	return {
			type: calcParser.tokenTypes.subExpression, 
			expression: token
		}
	}
	
	calcParser.createToken = function(tokenString) {
		if(calcParser.fullNumRegex.test(tokenString)) {
			if(!tokenString.charAt) {
				//Not a string
				//console.log("Stop!");
			}
			if(tokenString.charAt(tokenString.length - 1) == '%') {
				tokenString = tokenString.substring(0, tokenString.length - 1);
				val = parseFloat(tokenString) * 0.01;
			} else {
				val = parseFloat(tokenString);
			}
			var outVal = {
				type: 'value',
				value: val,
			}
			return outVal;
		} else if (calcParser.range1Regex.test(tokenString)) {
			var rangeParts = calcParser.range1Regex.exec(tokenString);
			
			var sheetName = rangeParts[1];
			var startCol = rangeParts[2]?calcParser.getRCColumn(rangeParts[2].toUpperCase()):null;
			var startRow = rangeParts[3];
			var endCol = rangeParts[4]?calcParser.getRCColumn(rangeParts[4].toUpperCase()):null;
			var endRow = rangeParts[5];
			var outVal = {
				type: 'reference',
				startCol: startCol,
				startRow: parseFloat(startRow)
			}
			if(endCol) outVal.endCol = endCol;
			if(endRow) outVal.endRow = parseFloat(endRow);				
			if(sheetName) outVal.worksheet = sheetName;
			return outVal;
			
		} else if (calcParser.booleanRegex.test(tokenString)) {
			var outVal = {
				type: 'bool',
				value: tokenString,
			}
			return outVal;
		} else if (calcParser.identifierRegex.test(tokenString)) {
			var outVal = {
				type: 'namedRangeReference',
				name: tokenString,
			}
			return outVal;
		} else if (calcParser.opRegex.test(tokenString)) {
			var opText = "";
			switch(tokenString) {
				case '+':
					opText = 'add';
					break;
				case '-':
					opText = 'sub';
					break;
				case '*':
					opText = 'mul';
					break;
				case '/':
					opText = 'div';
					break;
				case '^':
					opText = 'exp';
					break;
				case '=':
					opText = 'eq';
					break;	
				case '<>':
					opText = 'neq';
					break;	
				case '>':
					opText = 'gt';
					break;	
				case '<':
					opText = 'lt';
					break;	
				case '>=':
					opText = 'gte';
					break;	
				case '<=':
					opText = 'lte';
					break;	
				case '&':
					opText = 'cat';
					break;	
				case ',':
					opText = 'sep';
					break;
				case '&&':
					opText = 'and';
					break;
				case '||':
					opText = 'or';
					break;
				case '==':
					opText = 'eq';
					break;
				case '!=':
					opText = 'neq';
					break;
				}
			var outVal = {
				A: null,
				type: 'binary',
				B: null,
				operator: opText,
			}
			return outVal;
		}
	
	}

	calcParser.getRCColumn = function(columnCode) {
		var ACode = ("A").charCodeAt(0) - 1;
		var startColNum = 0;
		var mult = 1;
		var total = 0;
		for(var i = columnCode.length - 1; i >= 0; i--) {
			var curCharCode = columnCode.charCodeAt(i) - ACode;
			total += curCharCode * mult;
			mult *= 26;
		}
		return total;
	}	
	
	calcParser.getRCNotation = function(address) {

		var regexCapture = calcParser.range1Regex.exec(address);
		if(!regexCapture) {
			if(calcParser.rangeMultiRegex.test(address)) {
				var addresses = address.split(",");
				var outRanges = [];
				for(var i = 0; i < addresses.length; i++) {
					var testRange = calcParser.getRCNotation(addresses[i]);
					if(testRange) outRanges.push(testRange);
				}
				return outRanges;
			} else if(calcParser.rangeColRegex.test(address)){
				regexCapture = calcParser.rangeColRegex.exec(address);
				var out = {};
				if(regexCapture[1]) out.sheetName = regexCapture[1];
				out.startCol = parseInt(regexCapture[2]);
				out.endCol = parseInt(regexCapture[3]);
				out.startRow = 1;
				out.endRow = 65000;
				return out;
			} else if(calcParser.rangeRowRegex.test(address)){
				regexCapture = calcParser.rangeRowRegex.exec(address);
				var out = {};
				if(regexCapture[1]) out.sheetName = regexCapture[1];
				out.startRow = parseInt(regexCapture[2]);
				out.endRow = parseInt(regexCapture[3]);
				out.startCol = 1;
				out.endCol = 216;
				return out;
			} else {
				calcParser.errorLog.push("Error attempting to parse address: " + address);
				return;
			}
		}
		var out = {};
		if(regexCapture[1]) out.sheetName = regexCapture[1];
		out.startCol = parseInt(calcParser.getRCColumn(regexCapture[2]));
		out.startRow = parseInt(regexCapture[3]);
		
		if(regexCapture[4]) {
			out.endCol= parseInt(calcParser.getRCColumn(regexCapture[4]));
			out.endRow = parseInt(regexCapture[5]);
		}
		return out;
	}	
	
	calcParser.processOpOrder = function(expression) {
		expression = calcParser.reduceUnaryNegation('sub', expression);
		expression = calcParser.reduceUnaryNegation('add', expression);

		expression = calcParser.reduceBinaryOp(['exp'], expression);
		expression = calcParser.reduceBinaryOp(['mul', 'div'], expression);
		//expression = calcParser.reduceBinaryOp('div', expression);
		expression = calcParser.reduceBinaryOp(['add', 'sub'], expression);
		//expression = calcParser.reduceBinaryOp('sub', expression);
		expression = calcParser.reduceBinaryOp(['cat'], expression);
		expression = calcParser.reduceBinaryOp(['eq', 'neq', 'gt', 'lt', 'gte', 'lte'], expression);
		expression = calcParser.reduceBinaryOp(['and', 'or'], expression);
		/*expression = calcParser.reduceBinaryOp('neq', expression);
		expression = calcParser.reduceBinaryOp('gt', expression);
		expression = calcParser.reduceBinaryOp('lt', expression);
		expression = calcParser.reduceBinaryOp('gte', expression);
		expression = calcParser.reduceBinaryOp('lte', expression);*/
		expression = calcParser.removeBinaryOp('sep', expression);
		expression = calcParser.reduceArrays(expression);
		calcParser.forEachExpression(expression, calcParser.checkIndex);
			calcParser.forEachExpression(expression, calcParser.checkFuncArgs);
		return expression;
	}

	calcParser.reduceBinaryOp = function(opList, expression) {
		var curPos = 0;
		while(curPos < expression.length) {
			var opType = "none"
			for(var i = 0; i < opList.length; i++) {
				if(expression[curPos].operator == opList[i]) {
					opType = opList[i];
					break;
				}
			}
			if(opType != 'none') {
				if(expression[curPos].A && expression[curPos].B) {
					expression[curPos].A = calcParser.reduceBinaryOp(opList, expression[curPos].A);
					expression[curPos].B = calcParser.reduceBinaryOp(opList, expression[curPos].B);
					
					//alert("Already done");
				} else if(expression[curPos].type == 'binary' && curPos > 0 && curPos + 1 < expression.length){
					var A = calcParser.reduceBinaryOp(opList, expression[curPos - 1]);
					var B = calcParser.reduceBinaryOp(opList, expression[curPos + 1]);
					if(A.operator == 'sep') {
						A = {type: 'value', value: 0};
						var curOp = expression[curPos];
						curOp.A = A;
						curOp.B = B;
						expression.splice(curPos + 1, 1);
						expression[curPos] = curOp;
					
					} else if(B.operator == 'sep') {
						B = {type: 'value', value: 0};
						var curOp = expression[curPos];
						curOp.A = A;
						curOp.B = B;
						expression.splice(curPos - 1, 1);
						curPos--;
						expression[curPos] = curOp;
					} else {
						var curOp = expression[curPos];
						curOp.A = A;
						curOp.B = B;
						expression.splice(curPos + 1, 1);
						expression.splice(curPos - 1, 1);
						curPos--;
						expression[curPos] = curOp;
					}
				} else if(curPos + 1 < expression.length) {
					var A = {type: 'value', value: 0};
					var B = calcParser.reduceBinaryOp(opList, expression[curPos + 1]);
					var curOp = expression[curPos];
					curOp.A = A;
					curOp.B = B;
					expression.splice(curPos + 1, 1);
					expression[curPos] = curOp;
				} else {
					calcParser.log("Unhandled case for '" + expression + "' - may indicate a malformed expression");
				}
			} else if (expression[curPos].type == 'binary') {
				if(expression[curPos].A) expression[curPos].A = calcParser.reduceBinaryOp(opList, expression[curPos].A);
				if(expression[curPos].B) expression[curPos].B = calcParser.reduceBinaryOp(opList, expression[curPos].B);
			}else if (expression[curPos].type == 'wsFunc') {
				expression[curPos].argExpressionArray = calcParser.reduceBinaryOp(opList, expression[curPos].argExpressionArray);

			} else if(expression[curPos].expression) {// == calcParser.tokenTypes.subExpression) 
				expression[curPos].expression = calcParser.reduceBinaryOp(opList, expression[curPos].expression);
			} 

			curPos++;
		}
		if(expression.A) expression.A = calcParser.reduceBinaryOp(opList, expression.A);
		if(expression.B) expression.B = calcParser.reduceBinaryOp(opList, expression.B);
		if(expression.type == calcParser.tokenTypes.subExpression) {
			expression.expression = calcParser.reduceBinaryOp(opList, expression.expression);
		}
		if(expression.argExpressionArray) {
			expression.argExpressionArray = calcParser.reduceBinaryOp(opList, expression.argExpressionArray);
		}
		return expression;
	}
	
	calcParser.removeBinaryOp = function(op, expression) {
		var curPos = 0;
		while(curPos < expression.length) {
			if(expression[curPos].operator == op ) {
				expression.splice(curPos, 1);
				continue;
			} else if (expression[curPos].type == 'binary') {
				if(expression[curPos].A) expression[curPos].A = calcParser.removeBinaryOp(op, expression[curPos].A);
				if(expression[curPos].B) expression[curPos].B = calcParser.removeBinaryOp(op, expression[curPos].B);
			}else if (expression[curPos].type == 'wsFunc') {
				expression[curPos].argExpressionArray = calcParser.removeBinaryOp(op, expression[curPos].argExpressionArray);

			} else if(expression[curPos].expression) {// == calcParser.tokenTypes.subExpression) 
				expression[curPos].expression = calcParser.removeBinaryOp(op, expression[curPos].expression);
			} 

			curPos++;
		}
		if(expression.A) expression.A = calcParser.removeBinaryOp(op, expression.A);
		if(expression.B) expression.B = calcParser.removeBinaryOp(op, expression.B);
		if(expression.type == calcParser.tokenTypes.subExpression) {
			expression.expression = calcParser.removeBinaryOp(op, expression.expression);
		}
		if(expression.argExpressionArray) {
			calcParser.removeBinaryOp(op, expression.argExpressionArray);
		}
		return expression;
	}
	
	calcParser.forEachExpression = function(expression, func) {
		if(expression.type) {
			if(expression.type == 'binary') {
				expression.A = calcParser.forEachExpression(func(expression.A), func);
				expression.B = calcParser.forEachExpression(func(expression.B), func);
			} else if (expression.type == calcParser.tokenTypes.subExpression) {
				expression = calcParser.forEachExpression(func(expression.expression), func);
			} else if (expression.type == 'wsFunc') {
				expression.argExpressionArray = calcParser.forEachExpression(func(expression.argExpressionArray), func);
			}
		} else if(expression.length) {
			for(var i = 0; i < expression.length; i++) {
				expression[i] = calcParser.forEachExpression(func(expression[i]), func);
			}
		}
		return func(expression);
	}
	
	calcParser.checkIndex = function(expression) {
		if(expression.type == "wsFunc" && expression.name == "INDEX") {
			if(expression.argExpressionArray.length > 0 ) {
				if(expression.argExpressionArray[0].type=="binary") {
					calcParser.errorLog.push(calcParser.curCell.sheetName + "!R" + calcParser.curCell.row + "C" + calcParser.curCell.col +" is indexing into binary expression");
				}
			}
		}
		return expression;
	}
	calcParser.checkFuncArgs = function(expression) {
		if(expression.type == "binary") {
			if(!expression.A || !expression.B) {
					calcParser.errorLog.push(calcParser.curCell.sheetName + "!R" + calcParser.curCell.row + "C" + calcParser.curCell.col +" parsed with null operands on one or both sides of the operator");
			}
		}
		return expression;
	}
	
	
	calcParser.reduceUnaryNegation = function(op, expression) {
		var curPos = 0;
		if(expression.length) {
			while(curPos < expression.length) {
				if(expression[curPos].operator == op && ((curPos == 0) || expression[curPos - 1].type == 'binary' && !expression[curPos - 1].A) && curPos + 1 < expression.length) {
					if(expression[curPos + 1].type == 'value') {
						expression[curPos + 1].value = -1 * expression[curPos + 1].value;
						expression[curPos] = expression[curPos + 1];
						expression.splice(curPos + 1, 1);
					} else {
						var nextExp = expression[curPos + 1];
						
						var wrap = {
							A: {
								type: 'value',
								value: -1
							},
							type: 'binary',
							operator: 'mul',
							B: nextExp,
						}
						if(op == 'add') wrap.A.value = 1;
						expression[curPos] = wrap;
						expression.splice(curPos + 1, 1);
					}
				} else {
					if(expression[curPos].type == calcParser.tokenTypes.subExpression) {
						expression[curPos].expression = calcParser.reduceUnaryNegation(op, expression[curPos].expression);
					}
					curPos++;
				}
			}
		}
		return expression;
	}
	
	calcParser.reduceArrays = function(expression) {
		if(expression.length == 1) {
		//is array
			expression = calcParser.reduceArrays(expression[0]);
		} else if(expression.type) {
			if(expression.type == 'binary') {
				expression.A = calcParser.reduceArrays(expression.A);
				expression.B = calcParser.reduceArrays(expression.B);
			} else if (expression.type == calcParser.tokenTypes.subExpression) {
				expression = calcParser.reduceArrays(expression.expression);
			} else if (expression.type == 'wsFunc') {
				expression.argExpressionArray = calcParser.reduceArrays(expression.argExpressionArray);
			}
		} else if(expression.length > 1) {
			for(var i = 0; i < expression.length; i++) {
				expression[i] = calcParser.reduceArrays(expression[i]);
			}
		}
		return expression;
	}
	
	calcParser.getCharType = function(curChar) {
		if(curChar == "(") return calcParser.charTypes.openParen;
		if(curChar == "'" || curChar == '"') return calcParser.charTypes.openQuotes;
		var isNum = calcParser.numRegex.exec(curChar);
		
		if(isNum) {
			return 	calcParser.charTypes.number;
		} else {
			var isChar = calcParser.alphaRegex.exec(curChar);
			if(isChar) {
				return 	calcParser.charTypes.alpha;
			} else {
				var isOp = calcParser.opRegex.exec(curChar);
				if(isOp) return calcParser.charTypes.operator;
			}
		}
		return 	calcParser.charTypes.unknown;
	}

	calcParser.matchParen = function(testString, openParenIndex) {
		var balance = 0;
		if(testString.charAt(openParenIndex) != "(") return -1;
		for(var i = 1; openParenIndex + i < testString.length; i++) {
			var curChar = testString.charAt(openParenIndex + i);
			if(curChar == "(") balance++;
			if(curChar == ")") {
				if(balance == 0) return openParenIndex + i;
				else balance--;
			}
		}
		return -1;
	}
	
	calcParser.matchDelimiter = function(testString, openIndex, delimChar) {
		if(testString.charAt(openIndex) != delimChar) return -1;
		for(var i = 1; openIndex + i < testString.length; i++) {
			var curChar = testString.charAt(openIndex + i);
			if(curChar == delimChar) {
				return openIndex + i;
			}
		}
		return -1;
	}
	return calcParser;
};

try {
    if (typeof(exports) != 'undefined') {
		exports.calcParser = cp();
	} 
} catch(e) {
}
try {
	if(define) {
		define(function() {
			return cp();
		});
	}
} catch(e) {
	
}
//# sourceURL=calcParser.js