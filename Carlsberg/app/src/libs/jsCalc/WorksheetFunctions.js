define(['./jsCalcValue'], function(jsCalcValue) {
	var WorksheetFunctions = {},
		cleanFloat = function(num) {
			var power = 1e14;
			return Math.round(num * power) / power;
		};

	WorksheetFunctions.sqrt2PI = Math.sqrt(2 * Math.PI);
	WorksheetFunctions.recipSqrt2PI = 1.0/Math.sqrt(2 * Math.PI);
	
	WorksheetFunctions.SUM = function(argArray, ctx) {
		var curSum = 0;
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			curRange.each(function() {
				var tmpNum = cleanFloat(this.num(curCtx));
				curSum += tmpNum;
			})
		}
        // the toPrecision was added because of a known numeric precision bug in JS itself
        // try 0.55 + 0.15 in a console ... the result is 0.7000000000000001
        // toPrecision should truncate the bad data at the end
        // it is currently only done here as the issue seems to only be in addition at this point
        curSum = cleanFloat(curSum);
		return jsCalcValue.NumValue(curSum);
	}
	
	WorksheetFunctions.PRODUCT = function(argArray, ctx) {
		var curProduct = 1;
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			curRange.each(function() {
				curProduct *= this.num(curCtx);
			})
		}
		return jsCalcValue.NumValue(curProduct);
	}
	
	WorksheetFunctions.IF = function(argArray, ctx) {
		if(argArray[0](ctx).b(ctx)) {
			return argArray[1](ctx);
		} else {
			if(argArray[2]) return argArray[2](ctx);
			return jsCalcValue.NumValue(0);
		}
		
	}
	
	
	WorksheetFunctions.LARGE = function(argArray, ctx) {
		var valArray = [];
		var initialRef = argArray[0](ctx);
		var numIndex = Math.floor(argArray[1](ctx).num(ctx));
		var curCtx = ctx;
		argArray[0](ctx).each(function() {
				valArray.push(this.num(curCtx));
		});
		valArray = valArray.sort(function(a, b) {
			if(b < a) return -1; //put a first if it's bigger
			if(b > a) return 1; // put b first if it's bigger
			return 0
		});

		if(numIndex >= valArray.length) return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.num, ctx,  "LARGE had index greater than array size");
		return jsCalcValue.NumValue(valArray[numIndex-1]);
		
		
	}
	
	WorksheetFunctions.NOT = function(argArray, ctx) {
		var Bval = argArray[0](ctx).b(ctx);
		var Vval = argArray[0](ctx).v();
        
//        console.log ("NOT: " + Bval + ", " + !Bval + " --- " + Vval + ", " + !Vval);
        
		return jsCalcValue.BooleanValue(!Bval);
	}
	
	WorksheetFunctions.ROW = function(argArray, ctx) {
		var val = argArray[0](ctx).v();
		if(val.getSingleCellReference) {
			return jsCalcValue.NumValue(val.getSingleCellReference(ctx).row);
		}
	}
	
	WorksheetFunctions.INDEX = function(argArray, ctx) {
		var targ = argArray[0](ctx);
		var ind = argArray[1](ctx).num(ctx);
		if(argArray[2]) {
			var ind2 = argArray[2](ctx).num(ctx);

            if (targ.h == 1) {
                return targ.index(ind2, ctx);
            } else if (targ.w == 1) {
                return targ.index(ind, ctx);
            } else {
                return targ.index(ind, ind2, ctx);
            }
		} else {
			return targ.index(ind, ctx);
		}
	}
	
	WorksheetFunctions.ISERROR = function(argArray, ctx) {
		var testVal = argArray[0](ctx).v(ctx);
		if(testVal.errorContext) return jsCalcValue.BooleanValue(true);
		else return jsCalcValue.BooleanValue(false);
	}
	
	WorksheetFunctions.ISBLANK = function(argArray, ctx) {
		var testVal = argArray[0](ctx).v();
		return jsCalcValue.BooleanValue(!testVal);
	}
	
	WorksheetFunctions.IFERROR = function(argArray, ctx) {
		var testVal = argArray[0](ctx).v(ctx);
		if(testVal.errorContext) {
			ctx.errorStatus = null;
			return argArray[1](ctx);
		}
		else return argArray[0](ctx);
	}
	WorksheetFunctions.VLOOKUP = function(argArray, ctx) {
		var exact = true;
		if(argArray[3]) exact = !argArray[3](ctx).b(ctx);
		var colOffset = argArray[2](ctx).num(ctx);
		var testRange = argArray[1](ctx);
		if(exact) {
			var out = null;
			var testValue = argArray[0](ctx).s(ctx);
			for (var i = 0; i < testRange.h; i++) {
				var curTestCell =  testRange.index(1+i, 1).getSingleCellReference();
				if(!curTestCell.isBlank) {
					var curTestVal = curTestCell.s();
					if (curTestVal.toLowerCase() == testValue.toLowerCase()) {
						out = testRange.index(1+i, colOffset);
						break;
					}
				}
			}
		} else {
			var out = null;
			var testValue = argArray[0](ctx).num(ctx);
            var isNumber =  !isNaN(testValue);
			for(var i = 0; i < testRange.h; i++) {
				var curTestVal = testRange.index(i+1, 1).num(ctx);
                if (isNumber) {
                    var compare = (curTestVal >= testValue);
                    if (compare) {
                        out = testRange.index(i+1, colOffset);
                        break;
                    }
                }
                else {
                    if (curTestVal.toLowerCase() > testValue.toLowerCase()) {
                        out = testRange.index(i+1, colOffset);
                        break;
                    }
                }
			}
            // since it's the approximate match, set it to the last value
            if (out == null) {
                out = testRange.index(testRange.h, colOffset);
            }
		}
		if (out) {
            return out;
        } else {
            return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, "Vlookup didn't find valid result");
        }
	}
	WorksheetFunctions.HLOOKUP = function(argArray, ctx) {
		var exact = true;
		if(argArray[3]) exact = !argArray[3](ctx).b();
		var rowOffset = argArray[2](ctx).num();
		var testRange = argArray[1](ctx);
		if (exact) {
			var out = null;
			var testValue = argArray[0](ctx).s();
			for(var i = 0; i < testRange.w; i++) {
				var curTestCell =  testRange.index(1, 1+ i).getSingleCellReference();
				if(!curTestCell.isBlank) {
					var curTestVal = curTestCell.s();
					if (curTestVal.toLowerCase() == testValue.toLowerCase()) {
						out = testRange.index(rowOffset, 1 + i);
						break;
					}
				}
			}
		} else {
			var out = null;
			var testValue = argArray[0](ctx).num();
            var isNumber =  !isNaN(testValue);
			for(var i = 0; i < testRange.w; i++) {
				var curTestVal = testRange.index(1, 1+ i).s();
                if (isNumber) {
                    if (curTestVal > testValue) {
                        out = testRange.index(rowOffset, i);
                        break;
                    }
                }
                else {
                    if (curTestVal.toLowerCase() > testValue.toLowerCase()) {
                        out = testRange.index(rowOffset, i);
                        break;
                    }
                }
			}
		}
		if(out) return out;
		return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx,   "Hlookup didn't find valid result");
	}
	
	WorksheetFunctions.ABS = function(argArray, ctx) {
		return jsCalcValue.NumValue(Math.abs(argArray[0](ctx).num(ctx)));
	}
	
	WorksheetFunctions.AND = function(argArray, ctx) {
		var out = true;
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			var curVal = curRange.each(function() {
				out = out && this.b(curCtx);
			})
		}
		return jsCalcValue.BooleanValue(out);
	}
	
	WorksheetFunctions.OR = function(argArray, ctx) {
		var out = false;
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			var curVal = curRange.each(function() {
				out = out || this.b(curCtx);
			})
		}
		return jsCalcValue.BooleanValue(out);
	}

	WorksheetFunctions.IFNA = function(argArray, ctx) {
		var testVal = argArray[0](ctx).v(ctx);
		if(testVal.errorContext) {
			ctx.errorStatus = null;
			return argArray[1](ctx);
		}
		else return argArray[0](ctx);
	}

	WorksheetFunctions.ISNA = function(argArray, ctx) {
		var testVal = argArray[0](ctx).v(ctx);
		if(testVal.errorContext) {
			ctx.errorStatus = null;
			return jsCalcValue.BooleanValue(true);
		}
		else return jsCalcValue.BooleanValue(false);
	}

	WorksheetFunctions.AVERAGE = function(argArray, ctx) {
		var out = 0;
		var count = 0;
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			var curVal = curRange.each(function() {
				count = count + 1;
				out = out + this.num(curCtx);
			})
		}
		return jsCalcValue.NumValue(out/count);
	}
	
	WorksheetFunctions.CHOOSE = function(argArray, ctx) {
		var choice = argArray[0](ctx).num(ctx);
		return argArray[choice](ctx);
	}
	var calcHelper = {};
	calcHelper.createConditionFunction = function(condition) {
		if(condition.s) {
			var conditionRef = condition;
			return function(val, ctx) {
				return val.s(ctx) == conditionRef.s(ctx);
			}
		} else if(condition.toUpperCase() == "TRUE" || condition.toUpperCase() == "=TRUE") {
			return function(val, ctx) {
				return val.b(ctx);
			}
		} else if (condition.toUpperCase() == "FALSE" || condition.toUpperCase() == "=FALSE") {
			return function(val, ctx) {
				return !val.b(ctx);
			}
		} else {
			var i = 0;
			var regex =  /^(\=|\<\=|\>\=|\<\>|\<|\>)*([0-9\.]+)$/i;
			if(regex.test(condition)) {
				var regOut = regex.exec(condition);
				var cmpNum = parseFloat(regOut[2]);
				var cmp;
				switch(regOut[1]) {
					
					case '<':
						return function(a, ctx) {
							return a.num(ctx) < cmpNum;
						}
						break;
						case '>':
						return function(a, ctx) {
							return a.num(ctx) > cmpNum;
						}
						break;
						case '>=':
						return function(a, ctx) {
							return a.num(ctx) >= cmpNum;
						}
						break;
						case '<=':
						return function(a, ctx) {
							return a.num(ctx) <= cmpNum;
						}
						break;
						case '<>':
						return function(a, ctx) {
							return a.num(ctx) != cmpNum;
						}
						break;
						case '=':
						default:
						return function(a, ctx) {
							return a.num(ctx) == cmpNum;
						}
						break;
						
				}
			} else {
				var condString = condition;
				return function(a, ctx) {
					return a.s(ctx) == condString;
				}
			}
		}
	};
	
	WorksheetFunctions.COUNTIF = function(argArray, ctx) {
		var curSum = 0;
		var curCtx = ctx;

			var v2 = argArray[1](ctx);
			var curRange = argArray[0](ctx);
//      console.log (curRange);
//      console.log (curRange.targetSheetOb.name);
			curRange.each(function() {
				var tmpNum = Number(this.num(curCtx));
			})

		var range = argArray[0](ctx);
		var condition = argArray[1](ctx).s(ctx);
		var condFunc = calcHelper.createConditionFunction(condition);
		var count = 0;

		var v1 = argArray[0];
		var v2 = v1(ctx);
		var curRange = argArray[0](ctx);
        
			curRange.each(function() {
				var tmpNum = Number(this.num(curCtx));
//                if (tmpNum == v2.v(ctx)) {
//                    console.log ("range: " + tmpNum);
//                }
//				curSum += Number(this.num(curCtx));
			})

		var curVal = curRange.each(function() {
			var val = this;
//            console.log (this);
//            console.log (this.s(ctx));
//            console.log (this.v(ctx));
//            console.log (this.num(ctx));
			if(condFunc(val, ctx)) count = count + 1;
		})

		return jsCalcValue.NumValue(count);
	}
	
	WorksheetFunctions.SUMIF = function(argArray, ctx) {
		var range = argArray[0](ctx);
		var condition = argArray[1](ctx).s(ctx);
		var condFunc = calcHelper.createConditionFunction(condition);
		var sum = 0;
		if(argArray[2]) {
			var range2 = argArray[2](ctx);
			var count = range.count > range2.count? range2.count: range.count;
			for(var i = 0; i < count; i++) {
				var testVal = range.get(i);
				if(condFunc(testVal, ctx)) sum = sum + range2.get(i).num(ctx);
			}
		} else {
			for(var i = 0; i < range.count; i++) {
				var testVal = range.get(i);
				if(condFunc(testVal, ctx)) sum = sum + testVal.num(ctx);
			}
		
		}
		return jsCalcValue.NumValue(sum);
	}
	
	WorksheetFunctions.MATCH = function(argArray, ctx) {
		var val = argArray[0](ctx);
		var range = argArray[1](ctx);
		var mode = (argArray[2]) ? argArray[2](ctx).num(ctx) : 0;
		var cmp;
		if(mode < 0) {
            for(var i = 0; i < range.count; i++) {
                var testVal = range.get(i);
                var testNum = testVal.num(ctx);

                if (val.num(ctx) == testVal.num(ctx))
                        return jsCalcValue.NumValue(i + 1);
                else
                    if (val.num(ctx) > testVal.num(ctx)) {
                        if (i == 0) {
                            break;
                        }
                        return jsCalcValue.NumValue(i);
                    }
            }
            if ((val.num(ctx) < testVal.num(ctx)) && (i != 0))
                return jsCalcValue.NumValue(i);
		} else if (mode > 0) {
            for(var i = 0; i < range.count; i++) {
                var testVal = range.get(i);
                var testNum = testVal.num(ctx);
                
                if(testVal.num(ctx) > val.num(ctx)) {
                    if (i == 0) {
                        break;
                    }
                    return jsCalcValue.NumValue(i);
                }
            }
            if ((val.num(ctx) >= testVal.num(ctx)) && (i != 0))
                return jsCalcValue.NumValue(i);
		} else {
            for(var i = 0; i < range.count; i++) {
                var testVal = range.get(i);
                var testNum = testVal.num(ctx);
                
                if(testVal.s(ctx) == val.s(ctx)) {
                    return jsCalcValue.NumValue(i + 1);
                }
            }
		}
        
		return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, "Match didn't find valid result");
	}
	
	WorksheetFunctions.MAX = function(argArray, ctx) {
		var max =  jsCalcValue.NumValue(-99999999999999);
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			// check if curRange is a calcValue or calcCell instance
			if (curRange instanceof calcCell) {
				curRange = curRange.value;
			}
			curRange.eachCell(function() {
				if(!this.isBlank) max = this.num(curCtx) > max.num(curCtx)? this : max;
			})
		}
		return max;
	}
	
	WorksheetFunctions.MIN = function(argArray, ctx) {
		var min =  jsCalcValue.NumValue(99999999999999);
		var curCtx = ctx;
		for(var i = 0; i < argArray.length; i++) {
			var v1 = argArray[i];
			var v2 = v1(ctx);
			var curRange = argArray[i](ctx);
			// check if curRange is a calcValue or calcCell instance
			if (curRange instanceof calcCell) {
				curRange = curRange.value;
			}
			curRange.eachCell(function() {
				if(!this.isBlank) min = this.num(curCtx) < min.num(curCtx)? this : min;
			})
		}
		return min;
	}
	
	WorksheetFunctions.NA = function(argArray, ctx) {
		return jsCalcValue.ErrorValue(jsCalcValue.jsCalcErrorValue.na, ctx, "NA Function Manually Called");
	}
	
	WorksheetFunctions.NORMDIST = function(argArray, ctx)
		{
			var x = argArray[0](ctx).num(ctx);
			var mean = argArray[1](ctx).num(ctx);
			var dev = argArray[2](ctx).num(ctx);
			var cum = argArray[3](ctx).b(ctx);
			var invDev = 1.0 / dev;

			var curFunc = function (t)
			{
				var inExp = (t - mean)/dev;
				var eExp = -0.5 * inExp * inExp;
				return Math.pow(Math.E, eExp) * WorksheetFunctions.recipSqrt2PI * invDev;
			}
			if (cum)
			{
				var cumul = 0;
				var numSteps = 5000;
				var stepSize = dev / (numSteps/5);
				var step = dev * 0.005;
				var curVal;
				var prevVal;
				var curCalc;
				var prevCalc;

				curVal = x;

				while (numSteps > 0)
				{
					curCalc = curFunc(curVal);
					cumul += curCalc * stepSize;
					curVal = curVal - stepSize;
					numSteps -= 1;
				}
				prevCalc = curCalc;
				curCalc = curFunc(x);
				return jsCalcValue.NumValue(cumul);
			}
			else
			{
				return jsCalcValue.NumValue(curFunc(x));
			}		
		}
	
	WorksheetFunctions.NETWORKDAYS = function(argArray, ctx) {
        
        var rawStartDate = TimeToJavaScript(argArray[0](ctx).num(ctx));
        var rawEndDate = TimeToJavaScript(argArray[1](ctx).num(ctx));
        
        var startDate = new Date(rawStartDate);
        var endDate = new Date(rawEndDate);
        
        var haveHolidays = (argArray.length > 2);
        var numHolidays = (haveHolidays ? argArray[2](ctx).count : 0);
        var excelHolidays = (haveHolidays ? argArray[2](ctx) : 0);
        var holidays = [];

        for(var i = 0; i < numHolidays; i++) {
            var newHoliday = new Date(TimeToJavaScript(excelHolidays.get(i).num(ctx)));
            newHoliday.setHours(12);
            newHoliday.setMinutes(0);
            newHoliday.setSeconds(0);
            holidays.push(newHoliday.valueOf());
        }
        
        startDate.setHours(12);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate.setHours(12);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        
        var count = 0;
        var curDate = startDate;
        while (curDate <= endDate) {
            var dayOfWeek = curDate.getDay();
            var skipHoliday = false;
            
            for(var i = 0; i < numHolidays; i++) {
                skipHoliday = (haveHolidays && (holidays[i] == curDate.valueOf()));
                if (skipHoliday) {
                    break;
                }
            }
            
            if ((!((dayOfWeek == 6) || (dayOfWeek == 0))) && (!skipHoliday)) {
                count++;
            }
            curDate.setDate(curDate.getDate() + 1);
            curDate.setHours(12);
            curDate.setMinutes(0);
            curDate.setSeconds(0);
        }
    
        return jsCalcValue.NumValue(count);
    }
	
	WorksheetFunctions.NOW = function(argArray, ctx) {
        
        return jsCalcValue.NumValue(TimeToExcel(Date.now()));
    }
    
	WorksheetFunctions.DAY = function(argArray, ctx) {
        
        var time = argArray[0](ctx).num(ctx);
        var date = new Date();
        date.setTime(TimeToJavaScript(time));
        
        return jsCalcValue.NumValue(date.getDate());
    }
    
	WorksheetFunctions.DATE = function(argArray, ctx) {
        
        var year = argArray[0](ctx).num(ctx);
        var month = argArray[1](ctx).num(ctx);
        var day = argArray[2](ctx).num(ctx);
        var date = new Date();
        date.setMonth(month-1);
        date.setFullYear(year);
        date.setDate(day);

        return jsCalcValue.NumValue(TimeToExcel(date.getTime()));
    }
    
	WorksheetFunctions.MONTH = function(argArray, ctx) {
        
        var time = argArray[0](ctx).num(ctx);
        var date = new Date();
        date.setTime(TimeToJavaScript(time));
        
        return jsCalcValue.NumValue(date.getMonth()+1);
    }
    
	WorksheetFunctions.EOMONTH = function(argArray, ctx) {
        
        var time = argArray[0](ctx).num(ctx);
        var offset = (argArray.length > 1 ? argArray[1](ctx).num(ctx) : 0);
        
        var date = new Date();
        date.setTime(TimeToJavaScript(time));
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        
        // get first day of month after the one indicated
        var nextMonth = month + offset + 1;
        date.setMonth(nextMonth);
        date.setDate(1);
        
        var newTime = date.getTime();
        newTime = newTime - 86400000;
        
        // subtract 1 day and set date
        date.setTime(newTime);
                
        return jsCalcValue.NumValue(TimeToExcel(date.getTime()));
    }
    
	WorksheetFunctions.YEAR = function(argArray, ctx) {
        
        var time = argArray[0](ctx).num(ctx);
        var date = new Date();
        date.setTime(TimeToJavaScript(time));
        
        return jsCalcValue.NumValue(date.getFullYear());
    }
    
	WorksheetFunctions.WEEKDAY = function(argArray, ctx) {
        
        var time = argArray[0](ctx).num(ctx);
        var date = new Date();
        date.setTime(TimeToJavaScript(time));
        
        return jsCalcValue.NumValue(date.getDay()+1);
    }
    
    Date.prototype.getWeek = function (startDay) {
        
        var excelStartDay = 7; // Sunday
        switch (startDay) {
            case 1:  excelStartDay = 7; break;      // Sunday
            case 2:  excelStartDay = 1; break;      // Monday
            case 11: excelStartDay = 1; break;      // Monday
            case 12: excelStartDay = 2; break;      // Tuesday
            case 13: excelStartDay = 3; break;      // Wednesday
            case 14: excelStartDay = 4; break;      // Thursday
            case 15: excelStartDay = 5; break;      // Friday
            case 16: excelStartDay = 6; break;      // Saturday
            case 17: excelStartDay = 7; break;      // Sunday
            case 21: excelStartDay = 1; break;      // Monday
            default: excelStartDay = 7; break;      // Sunday
        }
        
        var target  = new Date(this.valueOf());
        var dayNr   = (this.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        var firstDay = target.valueOf();
        target.setMonth(0, 1);
        
        if (target.getDay() != excelStartDay) {
            target.setMonth(0, 1 + ((excelStartDay - target.getDay()) + 7) % 7);
        }
        
        return 1 + Math.ceil((firstDay - target) / 604800000);
    }
    
	WorksheetFunctions.WEEKNUM = function(argArray, ctx) {
        
        var time = argArray[0](ctx).num(ctx);
        var date = new Date();
        date.setTime(TimeToJavaScript(time));
        
        var startDay = (argArray.length > 2 ? argArray[2](ctx).num(ctx) : 1);
        
        return jsCalcValue.NumValue(date.getWeek(startDay));
    }
    
    TimeToExcel = function(time) {
        
        return ((time / 86400 / 1000) + (25567 + 1));
    }
    
    TimeToJavaScript = function(time) {
        
        return ((time - (25567 + 1)) * 86400 * 1000);
    }
    
	WorksheetFunctions.STDEVP = function(argArray, ctx)
		{
			var mean = 0;
			var count = 0;
			var SSD = 0;
			var s2 = 0;
			var nodes = argArray[0](ctx);
			var curCtx = ctx;
			for(var i = 0; i < argArray.length; i++) {
				var curRange = argArray[i](ctx);
				curRange.each(function() {
					mean += this.num(curCtx);
					count += 1;
				})
			}
			mean /= count;
			
			for(var i = 0; i < argArray.length; i++) {
				var curRange = argArray[i](ctx);
				curRange.each(function() {
					SSD += Math.pow(this.num(curCtx) - mean, 2.0);
				})
			}
			
			SSD = SSD /= count;
			
			var rootPart = Math.sqrt(SSD);
			
			return jsCalcValue.NumValue(rootPart);
			
		}
		
	WorksheetFunctions.SUMPRODUCT = function(argArray, ctx) {
		var range = argArray[0](ctx);
		var range2 = argArray[1](ctx);
		var count = range.count > range2.count? range2.count: range.count;
		var sum = 0;
		for(var i = 0; i < count; i++) {
			sum += range.get(i).num(ctx) * range2.get(i).num(ctx);
		}
		return jsCalcValue.NumValue(sum);
	}
	
    // Excel version takes a second parameter which is a 'multiple' to take the floor down to
    // Meaning, if the multiple is 2, then the floor has to be the next multiple of 2 lower than the number given
	WorksheetFunctions.FLOOR = function(argArray, ctx) {
		var num = argArray[0](ctx).num(ctx);
		var multiple = 1;
		if(argArray[1]) multiple = argArray[1](ctx).num(ctx);
        
        var roundDown = num % multiple;
        num = num - roundDown;
        
		return jsCalcValue.NumValue(num);
	}
	
	WorksheetFunctions.ROUND = function(argArray, ctx) {
		var num = argArray[0](ctx).num(ctx);
		var numPlaces = 0;
		if(argArray[1]) numPlaces = argArray[1](ctx).num(ctx);
		var mult = Math.pow(10, numPlaces);
		num *= mult;
		num = Math.round(num);
		num /= mult;
		return jsCalcValue.NumValue(num);
		
	}
	
	WorksheetFunctions.ROUNDDOWN = function(argArray, ctx) {
		var num = argArray[0](ctx).num(ctx);
		var numPlaces = 0;
		if(argArray[1]) numPlaces = argArray[1](ctx).num(ctx);
		var mult = Math.pow(10, numPlaces);
		num *= mult;
		num = Math.floor(num);
		num /= mult;
		return jsCalcValue.NumValue(num);
	}
	
	WorksheetFunctions.ROUNDUP = function(argArray, ctx) {
		var num = argArray[0](ctx).num(ctx);
		var numPlaces = 0;
		if(argArray[1]) numPlaces = argArray[1](ctx).num(ctx);
		var mult = Math.pow(10, numPlaces);
		num *= mult;
		num = Math.ceil(num);
		num /= mult;
		return jsCalcValue.NumValue(num);
	}
	
	WorksheetFunctions.RANK = function(argArray, ctx) {
		var testVal = argArray[0](ctx).num(ctx);
		var range = argArray[1](ctx);
		var order = 0;
		if(argArray[2]) order = argArray[2](ctx).num(ctx);
		var greaterCount = 0;
		var lessCount = 0;
		
		for(var i = 0; i < range.count; i++) {
			var testNum = range.get(i).num(ctx);
			if(testNum > testVal) greaterCount++;
			else if(testNum < testVal) lessCount++;
		}
		return order?jsCalcValue.NumValue(lessCount + 1):jsCalcValue.NumValue(greaterCount + 1);
	}
	
	// (UN)SUPPORTED FUNCTION - ONLY ADDED HERE SO IT DOESNT GIVE ERRORS WHEN PROCESSING / IMPORT / EXPORT -
    WorksheetFunctions.OFFSET = function(argArray, ctx) {
        var curRange = argArray[0](ctx);
        var moveRowsBy = argArray[1](ctx).num(ctx);
        var moveColsBy = argArray[2](ctx).num(ctx);
        var numRowsToReturn = (argArray[3]) ? argArray[3](ctx).num(ctx) : 0;
        numRowsToReturn = (numRowsToReturn > 0) ? numRowsToReturn - 1 : (numRowsToReturn < 0) ? numRowsToReturn + 1 : numRowsToReturn;
        var numColsToReturn = (argArray[4]) ? argArray[4](ctx).num(ctx) : 0;
        numColsToReturn = (numColsToReturn > 0) ? numColsToReturn - 1 : (numColsToReturn < 0) ? numColsToReturn + 1 : numColsToReturn;
        var targetRangeStartRow = (curRange.startRow + moveRowsBy) || 0,
            targetRangeStartCol = (curRange.startCol + moveColsBy) || 0,
            targetRangeEndRow = (targetRangeStartRow + numRowsToReturn) || 0,
            targetRangeEndCol = (targetRangeStartCol + numColsToReturn) || 0,
            targetRangeSheetName = curRange.targetSheetOb.name || "";
        var targetRange = jsCalcValue.ReferenceValue(targetRangeStartRow, targetRangeStartCol, targetRangeEndRow, targetRangeEndCol, ctx, targetRangeSheetName);
        // console.log(curRange);
        // console.log(targetRange)
        // console.log(targetRange(ctx).num(ctx));
        // return jsCalcValue.NumValue(targetRange(ctx).num(ctx));
        // return jsCalcValue.NumValue(0);
        return targetRange;
    }

    WorksheetFunctions.NPV = function(argArray, ctx) {
		var rate = argArray[0](ctx).num(ctx);
        var value = 0;
        

        for (var j = 1; j < argArray.length; j++) {
            if (argArray[j](ctx) instanceof calcCell) {
//                console.log (argArray[j](ctx).num(ctx) );
                value += argArray[j](ctx).num(ctx) / Math.pow(1 + rate, j);
            } else {
                var idx = 0;
                argArray[j](ctx).eachCell(function() {
                    value += this.num(ctx) / Math.pow(1 + rate, (j+idx));
                    idx++;
                    // console.log ("in each2: (" + j + ") " + rate + ", " + this.num(ctx) + " = " + value);
                })
            }
        }
        
//        console.log ("NPV = " + value);
        return jsCalcValue.NumValue(value);


//		for(var i = 0; i < argArray.length; i++) {
//			var v1 = argArray[i];
//			var v2 = v1(ctx);
//			var curRange = argArray[i](ctx);
			// check if curRange is a calcValue or calcCell instance
//			if (curRange instanceof calcCell) {
//				curRange = curRange.value;
//			}
//			curRange.eachCell(function() {
//				if(!this.isBlank) max = this.num(curCtx) > max.num(curCtx)? this : max;
//			})
//		}

    }

    // UNSUPPORTED FUNCTION - ONLY ADDED HERE SO IT DOESNT GIVE ERRORS WHEN PROCESSING / IMPORT / EXPORT -
    WorksheetFunctions.FORECAST = function(argArray, ctx) {
        var x = argArray[0](ctx).num(ctx), 
        data_y_ranges = argArray[1](ctx), 
        data_x_ranges = argArray[2](ctx),
        data_y = [],
        data_x = [],
        hasError = false;

        for(var i = 0; i < data_y_ranges.count; i++) {
            if (data_y_ranges.get(i).v(ctx).errorContext) {
                hasError = true;
                break;
            }
            data_y.push(data_y_ranges.get(i).num(ctx) || 0);
        }
        for(var i = 0; i < data_x_ranges.count; i++) {
            if (data_x_ranges.get(i).v(ctx).errorContext) {
                hasError = true;
                break;
            }
            data_x.push(data_x_ranges.get(i).num(ctx) || 0);
        }
        if (hasError) {
            console.log("Error in calculating forecast", data_x, data_y);
        }
        // process the data if no errors found
        var xmean = getMean(data_x);
        var ymean = getMean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        var b = num / den;
        var a = ymean - b * xmean;

        return jsCalcValue.NumValue(a + b * x);
    }
    
    function getMean(dataArr) {
        var sum = 0;
        for (var i= 0; i < dataArr.length; i++) {
            sum += dataArr[i];
        }

        return sum / dataArr.length;
    }

    WorksheetFunctions.VALUE = function(argArray, ctx) {
        var text = argArray[0](ctx).s(ctx);
        return jsCalcValue.StringValue(text);
    }

    WorksheetFunctions.LEFT = function(argArray, ctx) {
        var text = argArray[0](ctx).s(ctx),
            num = (argArray[1](ctx) && argArray[1](ctx).num(ctx)) ? argArray[1](ctx).num(ctx) : 1;

        text = text ? text.substring(0, num) : null;

        return jsCalcValue.StringValue(text);
    }

    WorksheetFunctions.RIGHT = function(argArray, ctx) {
        var text = argArray[0](ctx).s(ctx),
            num = (argArray[1](ctx) && argArray[1](ctx).num(ctx)) ? argArray[1](ctx).num(ctx) : 1;
        text = text ? text.substring(text.length - num) : null;
        return jsCalcValue.StringValue(text);
    }

    WorksheetFunctions.LEN = function(argArray, ctx) {
    	var text = argArray[0](ctx).s(ctx);
    	if (typeof text === "undefined" || text.errorContext) {
    		return jsCalcValue.jsCalcErrorValue(text, ctx, "Error in calculating length");
    	}
    	if (typeof text === 'string') {
			return jsCalcValue.NumValue(text ? text.length : 0);
		}

		if (text.length) {
			return jsCalcValue.NumValue(text.length);
		}
		return jsCalcValue.jsCalcErrorValue(text, ctx, "Error in calculating length");
    }

    WorksheetFunctions.SUBSTITUTE = function(argArray, ctx) {
    	var text = argArray[0](ctx).s(ctx),
    		oldText = (argArray[1]) ? argArray[1](ctx).s(ctx) : "",
    		newText = (argArray[2]) ? argArray[2](ctx).s(ctx) : "",
    		occurence = (argArray[3]) ? argArray[3](ctx).n(ctx) : undefined;

    	if (typeof text === "undefined" || typeof oldText === "undefined" || typeof newText ==="undefined" || text.errorContext || oldText.errorContext || newText.errorContext) {
    		return jsCalcValue.jsCalcErrorValue(text, ctx, "Error in substitute function");
    	}
    	else if (occurence === undefined) {
    		var outVal = text.replace(new RegExp(oldText, 'g'), newText);
    		return jsCalcValue.StringValue(outVal);
    	}
    	else {
    		var index = 0;
			var i = 0;
			while (text.indexOf(oldText, index) > 0) {
				index = text.indexOf(oldText, index + 1);
				i++;
				if (i === occurence) {
					var outVal = text.substring(0, index) + newText + text.substring(index + oldText.length);
					return jsCalcValue.StringValue(outVal);
				}
			}
    	}
    }


    WorksheetFunctions.IRR = function(argArray, ctx) {
        var values = argArray[0](ctx);
        var guess = (argArray[1]) ? argArray[1](ctx).num(ctx) : 0;
        var valuesArray = [], hasError = false;
        for(var i = 0; i < values.count; i++) {
            if (values.get(i).v(ctx).errorContext) {
                hasError = true;
                break;
            }
            valuesArray.push(values.get(i).num(ctx) || 0);
        }
        if (hasError) {
            console.log("Error in calculating IRR");
            return jsCalcValue.jsCalcErrorValue(values, ctx, "Error in calculating IRR");
        }

        // calculate the resulting amount
        var irrResult = function(values, dates, rate) {
            var r = rate + 1;
            var result = values[0];
            for (var i = 1; i < values.length; i++) {
                result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
            }
            return result;
        }
        // Calculates the first derivation
        var irrResultDeriv = function(values, dates, rate) {
            var r = rate + 1;
            var result = 0;
            for (var i = 1; i < values.length; i++) {
                var frac = (dates[i] - dates[0]) / 365;
                result -= frac * values[i] / Math.pow(r, frac + 1);
            }
            return result;
        };

        // Initialize dates and check that values contains at least one positive value and one negative value
        var dates = [];
        var positive = false;
        var negative = false;
        for (var i = 0; i < valuesArray.length; i++) {
            dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
            if (valuesArray[i] > 0) {
                positive = true;
            }
            if (valuesArray[i] < 0) {
                negative = true;
            }
        }

        // Return error if values does not contain at least one positive value and one negative value
        if (!positive || !negative) {
            return jsCalcValue.jsCalcErrorValue(values, ctx, "Error in calculating IRR");
        }

        // Initialize guess and resultRate
        guess = (guess === undefined) ? 0.1 : guess;
        var resultRate = guess;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Implement Newton's method
        var newRate, epsRate, resultValue;
        var contLoop = true;
        do {
            resultValue = irrResult(valuesArray, dates, resultRate);
            newRate = resultRate - resultValue / irrResultDeriv(valuesArray, dates, resultRate);
            epsRate = Math.abs(newRate - resultRate);
            resultRate = newRate;
            contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
        } while (contLoop);
        // Return internal rate of return
        return jsCalcValue.NumValue(resultRate);
    }
	return WorksheetFunctions;
});

//# sourceURL=WorksheetFunctions.js