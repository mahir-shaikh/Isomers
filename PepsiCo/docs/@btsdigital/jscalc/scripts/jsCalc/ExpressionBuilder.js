define(['./jsCalcValue', './WorksheetFunctions'], function(jsCalcValue, WorksheetFunctions) {
	var ExpressionBuilder = function() {
		//I'm an object!

	}
	if(!window.log) {
		if(window.console) {
			window.log = console.log;
		} else {
			window.log = function() {};
		}
	}
	ExpressionBuilder.valueFunctions = {};
	ExpressionBuilder.valueConstructorFunctions = {};
	ExpressionBuilder.operatorConstructorFunctions = {};

	ExpressionBuilder.resultTypes = {};
	ExpressionBuilder.resultTypes.value = 0;
	ExpressionBuilder.resultTypes.generic = 1;
	ExpressionBuilder.activeWorkbook;

	ExpressionBuilder.getEvalFunction = function(expression, cellCtx, asValue) {
		var asValue = asValue?true:false;
		switch(expression.type) {
		case 'binary':
			var constructFunc = ExpressionBuilder.operatorConstructorFunctions[expression.operator];
			return constructFunc(expression.A, expression.B, cellCtx, expression);
		case 'value':
			if(expression.value == "TRUE") {
				alert("Oops!");
			}
			if(ExpressionBuilder.valueFunctions[expression.value]) {
				return ExpressionBuilder.valueFunctions[expression.value];
			} else {
				var type = 'number'; //ExpressionBuilder.getTypeFromValueString(expression.value);
				var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
				ExpressionBuilder.valueFunctions[expression.value] = constructFunc(expression.value);
				return ExpressionBuilder.valueFunctions[expression.value];
			}
		case 'string':
			if(expression.value.length == 0) {
				if(ExpressionBuilder.emptyStringFunction) return ExpressionBuilder.emptyStringFunction;
				var type = 'string'; //ExpressionBuilder.getTypeFromValueString(expression.value);
				var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
				ExpressionBuilder.emptyStringFunction = constructFunc(expression.value);
				return ExpressionBuilder.emptyStringFunction;
			}
			else if(ExpressionBuilder.valueFunctions[expression.value]) {
				return ExpressionBuilder.valueFunctions[expression.value];
			} else {
				var type = 'string'; //ExpressionBuilder.getTypeFromValueString(expression.value);
				var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
				ExpressionBuilder.valueFunctions[expression.value] = constructFunc(expression.value);
				return ExpressionBuilder.valueFunctions[expression.value];
			}
		case 'bool':
			if(ExpressionBuilder.valueFunctions[expression.value]) {
				return ExpressionBuilder.valueFunctions[expression.value];
			} else {
				var type = 'bool'; //ExpressionBuilder.getTypeFromValueString(expression.value);
				var constructFunc = ExpressionBuilder.valueConstructorFunctions[type];
				ExpressionBuilder.valueFunctions[expression.value] = constructFunc(expression.value);
				return ExpressionBuilder.valueFunctions[expression.value];
			}
		case 'reference':
			return ExpressionBuilder.referenceConstructorFunction(expression, cellCtx, asValue);
		case 'namedRangeReference':
			return ExpressionBuilder.namedReferenceConstructorFunction(expression, cellCtx, asValue);
		case 'wsFunc':
			return ExpressionBuilder.worksheetFunctionConstructor(expression, cellCtx);
		//handle other cases (unary operators, lists)
		}
	}

	ExpressionBuilder.valueConstructorFunctions.number = function(value) {
		var val = jsCalcValue.NumValue(parseFloat(value));
		return function() {
			return val;
		}
	}

	ExpressionBuilder.valueConstructorFunctions.string = function(value) {
		var val = jsCalcValue.StringValue(value);
		return function() {
			return val;
		}
	}

	ExpressionBuilder.valueConstructorFunctions.bool = function(value) {
		var val = jsCalcValue.BooleanValue(value);
		return function() {
			return val;
		}
	}
	ExpressionBuilder.operatorConstructorFunctions.add = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
	var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
	var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
		//if debug
		var A = funcA(ctx);
		if(A.errorContext) return A;
		var B = funcB(ctx);
		if(B.errorContext) return B;
		curExpression.curVal =  jsCalcValue.NumValue(A.num(ctx) + B.num(ctx));
		return curExpression.curVal;
		}
	}
	ExpressionBuilder.operatorConstructorFunctions.sub = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
	var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
	var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			curExpression.curVal = jsCalcValue.NumValue(funcA(ctx).num(ctx) - funcB(ctx).num(ctx))
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.mul = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
	var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
	var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
		var a = funcA(ctx);
		var b = funcB(ctx);
		curExpression.curVal =  jsCalcValue.NumValue(funcA(ctx).num(ctx) * funcB(ctx).num(ctx));
		return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.exp = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).num(ctx);
			var b = funcB(ctx).num(ctx);
			var c = Math.pow(a, b);
			curExpression.curVal = isNaN(c) || c == Number.POSITIVE_INFINITY || c == Number.NEGATIVE_INFINITY? jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.value, ctx, 'Div0 within exp function'):jsCalcValue.NumValue(c);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.div = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).num(ctx);
			var b =  funcB(ctx).num(ctx);
			//check for divide by 0
			curExpression.curVal = b?jsCalcValue.NumValue(funcA(ctx).num(ctx) / funcB(ctx).num(ctx)):jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.divideByZero, ctx);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.eq = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).s(ctx);
			var b =  funcB(ctx).s(ctx);

			curExpression.curVal = jsCalcValue.BooleanValue(a == b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.neq = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).s(ctx);
			var b =  funcB(ctx).s(ctx);

			curExpression.curVal = jsCalcValue.BooleanValue(a != b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.lt = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).num(ctx);
			var b =  funcB(ctx).num(ctx);

			curExpression.curVal = jsCalcValue.BooleanValue(a < b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.gt = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).num(ctx);
			var b =  funcB(ctx).num(ctx);

			curExpression.curVal = jsCalcValue.BooleanValue(a > b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.lte = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).num(ctx);
			var b =  funcB(ctx).num(ctx);

			curExpression.curVal = jsCalcValue.BooleanValue(a <= b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.gte = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).num(ctx);
			var b =  funcB(ctx).num(ctx);

			curExpression.curVal = jsCalcValue.BooleanValue(a >= b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.operatorConstructorFunctions.cat = function(A, B, cellCtx, expression) {
		//here�s the recursion � make sure we have
		var funcA = ExpressionBuilder.getEvalFunction(A, cellCtx, true);
		var funcB = ExpressionBuilder.getEvalFunction(B, cellCtx, true);
		var curExpression = expression;
		return function(ctx) {
			var a = funcA(ctx).s(ctx);
			var b = funcB(ctx).s(ctx);

			curExpression.curVal = jsCalcValue.StringValue(a + b);
			return curExpression.curVal;
		}
	}

	ExpressionBuilder.namedReferenceConstructorFunction = function(expression, cellCtx, asValue) {
		var workbookOb = cellCtx.workbook;
		var name = expression.name;
		if(name in workbookOb.namedRanges) {
			var refOb = workbookOb.namedRanges[name];
			if(asValue) {
				refOb = refOb.getReferenceAsValueReference(cellCtx);
			}
			cellCtx.parents.push(refOb);
		} else {
			window.log("Named range '" + name + "' is referenced in a formula, but is not defined in the workbook.", cellCtx.address());
		}
		var curExpression = expression;
		return function(ctx) {
			curExpression.curVal = name in workbookOb.namedRanges?workbookOb.namedRanges[name]:jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.nameErr, ctx);
			return curExpression.curVal;
		}
	};

	ExpressionBuilder.referenceConstructorFunction = function(expression, cellCtx, asValue) {
		var startRow = expression.startRow;
		var startCol = expression.startCol;
		var endRow = expression.endRow?expression.endRow: startRow;
		var endCol = expression.endCol?expression.endCol: startCol;
		var targetSheet = expression.worksheet?expression.worksheet: null;

		var refOb = jsCalcValue.ReferenceValue(startRow, startCol, endRow, endCol, cellCtx, targetSheet);
		if(asValue) {
			refOb = refOb.getReferenceAsValueReference(cellCtx);
		}
		cellCtx.parents.push(refOb);
		return ExpressionBuilder.referenceReturnFunction(refOb, expression);
	};

	ExpressionBuilder.referenceReturnFunction = function(refOb, expression) {
		var returnReference = refOb;
		var curExpression = expression;
		return function(ctx) {
			//curExpression.curVal = refOb.num(ctx);
			return refOb;
		}
	}

	ExpressionBuilder.worksheetFunctionConstructor = function(expression, cellCtx) {
		var wsFunc = WorksheetFunctions[expression.name];
		if(!wsFunc) {
			//currently unsupported worksheet function - need to flag this!
			//alert("Unsupported worksheet function in " + cellCtx.verboseAddress() + ": " + expression.FuncName);
			var errStr = "Unsupported worksheet function in " + cellCtx.verboseAddress() + ": " + expression.name;
			cellCtx.workbook.buildErrors.push(errStr);
			if(!cellCtx.workbook.unsupportedFunctionList[expression.name]) cellCtx.workbook.unsupportedFunctionList[expression.name] = 1;
			else cellCtx.workbook.unsupportedFunctionList[expression.name] = cellCtx.workbook.unsupportedFunctionList[expression.name] + 1;
			cellCtx.errorStatus = jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, cellCtx, errStr);
			return function(ctx) {
				return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.build, ctx, errStr);
			};
		} else {
			var expArgFuncArray = [];
			if(expression.argExpressionArray.length) {

				for(var i = 0; i < expression.argExpressionArray.length; i++) {
					var funcA = ExpressionBuilder.getEvalFunction(expression.argExpressionArray[i], cellCtx);
					expArgFuncArray.push(funcA);
				}
			} else {
				//only one arg
				expArgFuncArray.push(ExpressionBuilder.getEvalFunction(expression.argExpressionArray, cellCtx));
			}
			return ExpressionBuilder.worksheetFunctionReturnFunction(wsFunc, expArgFuncArray, cellCtx, expression);

		}
	}

	ExpressionBuilder.worksheetFunctionReturnFunction = function(func, args, cellCtx, expression) {
		var curArgs = args;
		var curFunc = func;
		var curExpression = expression;
		return function(ctx) {
			curExpression.curVal = curFunc(curArgs, ctx, expression);
			return curExpression.curVal;
		}
	}

	return ExpressionBuilder;
});

//# sourceURL=ExpressionBuilder.js
