define(['jquery', 'jsCalc/jsCalc', 'jsCalc/parseUtils', 'jqueryui', 'jsCalc/calcParser'], function($, jsCalcAPI, parseUtils, jqui, calcParser) {
	if(!window.isArray) {
		window.isArray = function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		}
	}
	wbProbe = function(params) {
		//targetDiv, url, api) {
		this.targetDiv = params.targetDiv;
		this.url = params.url;
		this.customActions = params.customActions?params.customActions:null;
		var self = this;
		this.curAPI = params.api?params.api:null;
		this.modelJSON = params.modelJSON?params.modelJSON:null;
		this.loadStartTime =  new Date().getTime();
		this.loadEndTime =  new Date().getTime();
		this.loadElapsed = 0;
		$(this.targetDiv).find("#modelBuildProgress").progressbar({
			value: 0
		});
		if(params.api) {
			this.curAPI = params.api;
			this.onLoad();
		} else {
			$(document).ready(function() {
				self.startLoad(function() {
					self.onLoad();
				});
			});
		}
		$(this.targetDiv).append("<div id='modelBuildProgress'><div class='progress-label'>Loading...</div></div>");

	};
	
	wbProbe.prototype.onBuildProgress = function(progOb) {
		var pct = progOb.numComplete / progOb.numTotal;
		var val = 100 * pct;
		$(this.targetDiv).find("#modelBuildProgress").progressbar({
			value: val
		});
		$(this.targetDiv).find(".progress-label").text(progOb.message);
	}
	
	wbProbe.prototype.startLoad = function() {
		var self = this;
		if(this.modelJSON) {
			this.curAPI = new jsCalcAPI({
				model: self.modelJSON, 
				loadCallback: function() {
					self.onLoad();
				},
				customActions: this.customActions,
				buildProgressCallback: function(progOb) {
					self.onBuildProgress(progOb);
				},
			});
		} else if (this.url) {
			this.curAPI = new jsCalcAPI({
				modelURL: self.url, 
				loadCallback: function() {
					self.onLoad();
				}, 
				customActions: this.customActions,
				buildProgressCallback: function(progOb) {
					self.onBuildProgress(progOb);
				},
			});
		}
	}
	
	
	wbProbe.prototype.onLoad = function() {
		/*var testOut = this.curAPI.getValue("tlOutputSUM");
		this.curAPI.addCalculationCallback([this, wbProbe.onCalculate]);
		this.curAPI.setValue("FunctionTests!E2", 3);*/
		this.loadEndTime = new Date().getTime();
		this.loadElapsed = this.loadEndTime - this.loadStartTime;

		var self = this;
		$(this.targetDiv).empty();
		$(this.targetDiv).append("<div id='selectionTools'><form><label for='rangeSpecifierInput'>Target Range:</label><input id='rangeSpecifierInput' type='text' name='rangeSpecifier'></input><label for='calculationBreakpointInput'>Calculation Breakpoint:</label><input id='calculationBreakpointInput' type='text' name='calculationBreakpointSpecifier'></input><button id='forceCalculate'>Force Calculate</button><button id='forceRebuild'>Force Rebuild</button><button id='newYearTrigger'>Trigger New Year</button><button id='saveModelStateButton'>Save State</button><button id='restoreModelStateButton'>Restore State</button></form><span class='smallText' id='calcTimeOutput'></span><span class='smallText' id='buildTimeOutput'>Built in " + this.loadElapsed.toString() + "ms</span></div>");
		$(this.targetDiv).append("<div id='cellOutput'><div id='addressInfo'><span id='sheetName'></span><span id='rangeAddress'></span><span id='cellFormula'></span><button id='setAsBreakButton'>Set as Breakpoint</button><form id='valueSetForm'><label for='valueSpecifier'>Value:</label><input id='valueInput' type='text' name='valueSpecifier'></input></form></div><span><table id='cellTable'></table></span><span id='cellInfo'><ul id='referenceList'></ul><span id='errorOutput'></span></span></div>");
		var rangeSpec = $(this.targetDiv).find("#rangeSpecifierInput").get(0);
		$(this.targetDiv).on('change', '#rangeSpecifierInput', function() {
//		$(rangeSpec).change(function() {
			//alert("Change event fired");
			self.updateCellOutputs(this);
		});
		
		$(this.targetDiv).on('keyup', '#rangeSpecifierInput', function() {
//		$(rangeSpec).change(function() {
			//alert("Change event fired");
			self.updateCellOutputs(this);
		});
		
		$(this.targetDiv).on('change', '#valueInput', function() {
			var inputValue = this.value;
			self.curAPI.setValue($("#rangeSpecifierInput").val(), inputValue);
		});
		$(this.targetDiv).on('keyup', '#valueInput', function() {
			var inputValue = this.value;
			self.curAPI.setValue($("#rangeSpecifierInput").val(), inputValue);
		});
		
		$(this.targetDiv).on('keyup', '#calculationBreakpointInput', function() {
			var rangeText = this.value;
			var rangeOb = null;
			if(parseUtils.range1Regex.test(rangeText) || parseUtils.rangeRCRegex.test(rangeText)) {
				//is valid
				rangeOb = parseUtils.getRangeOb(rangeText);
				rangeOb.endCol = rangeOb.endCol?rangeOb.endCol:rangeOb.startCol;
				rangeOb.endRow = rangeOb.endRow?rangeOb.endRow:rangeOb.startRow;
			}
			if(self.curAPI.isNamedRange(rangeText)) {
				rangeOb = {};
				var rangeRef = self.curAPI.getBook().getRange(rangeText)
				rangeOb.sheetName = rangeRef.targetSheetOb.name;
				rangeOb.startCol = rangeRef.startCol;
				rangeOb.startRow = rangeRef.startRow;
				rangeOb.endCol = rangeRef.endCol?rangeRef.endCol:rangeOb.startCol;
				rangeOb.endRow = rangeRef.endRow?rangeRef.endRow:rangeOb.startRow;
			}
			if(rangeOb) {
				self.curAPI.getBook().calculationBreakpointObject = rangeOb;
			}
		
		});
		
		$(this.targetDiv).find("#forceCalculate").button().click(function( event ) {
			event.preventDefault();
			self.curAPI.getBook().recalculate();
		});
		$(this.targetDiv).find("#forceRebuild").button().click(function( event ) {
			event.preventDefault();
			self.curAPI.getBook().init();
		});
		
		$(this.targetDiv).find("#newYearTrigger").button().click(function( event ) {
			event.preventDefault();
			self.curAPI.runCourseAction("NewYear");
		});
		$(this.targetDiv).find("#setAsBreakButton").button().click(function( event ) {
			event.preventDefault();
			var rangeSpecifier = $(self.targetDiv).find("#rangeSpecifierInput").get(0);
			if(rangeSpecifier) {
				var rangeSpecValue = rangeSpecifier.value;
				$(self.targetDiv).find('#calculationBreakpointInput').val(rangeSpecValue);
				$(self.targetDiv).find('#calculationBreakpointInput').trigger('keyup');
			}
		});
		
		$(this.targetDiv).find("#saveModelStateButton").button().click(function( event ) {
			event.preventDefault();
			var stateJSON = JSON.stringify(self.curAPI.getFullState());
			localStorage["workbookProbeState"] = stateJSON;
			
		});
		$(this.targetDiv).find("#restoreModelStateButton").button().click(function( event ) {
			event.preventDefault();
			var stateJSON = localStorage["workbookProbeState"];
			var stateOb = JSON.parse(stateJSON);
			self.curAPI.setState(stateOb.cells, stateOb.historicalData, function() {
				alert("Model loaded.");
			});
		});

		this.curAPI.addCalculationCallback(function() {
			self.onCalculate();
		});
	}
	
	wbProbe.prototype.onCalculate = function() {
		//var testOut = this.curAPI.getValue("tlOutputSUM");
		var elapsed = this.curAPI.getBook().calcTimeElapsed;
		var calcCount = this.curAPI.getBook().calcCount;
		$("#calcTimeOutput").html("Calculated " + calcCount + " cells in " + elapsed + "ms");
		this.updateCellOutputs($('#rangeSpecifierInput').get(0));
	}
	
	wbProbe.prototype.updateCellOutputs = function(inputElem) {
		var rangeText = inputElem.value;
		$("#valueSetForm").hide();
		$(this.targetDiv).find("#cellTable").empty();
		$(this.targetDiv).find("#sheetName").empty();
		$(this.targetDiv).find("#rangeAddress").empty();
		$(this.targetDiv).find("#errorOutput").empty();
		$(this.targetDiv).find("#referenceList").empty();
    	$(this.targetDiv).find('#cellFormula').empty();
		var rangeOb = null;
		if(parseUtils.range1Regex.test(rangeText) || parseUtils.rangeRCRegex.test(rangeText)) {
			//is valid
			rangeOb = parseUtils.getRangeOb(rangeText);
			rangeOb.endCol = rangeOb.endCol?rangeOb.endCol:rangeOb.startCol;
			rangeOb.endRow = rangeOb.endRow?rangeOb.endRow:rangeOb.startRow;
		}
		if(this.curAPI.isNamedRange(rangeText)) {
			rangeOb = {};
			var rangeRef = this.curAPI.getBook().getRange(rangeText)
			rangeOb.sheetName = rangeRef.targetSheetOb.name;
			rangeOb.startCol = rangeRef.startCol;
			rangeOb.startRow = rangeRef.startRow;
			rangeOb.endCol = rangeRef.endCol?rangeRef.endCol:rangeOb.startCol;
			rangeOb.endRow = rangeRef.endRow?rangeRef.endRow:rangeOb.startRow;
			
			
		}
		if(rangeOb && this.curAPI.getBook().isWorksheet(rangeOb.sheetName)) {
			

			$(this.targetDiv).find("#sheetName").html(rangeOb.sheetName);
			var addressString = "R" + rangeOb.startRow + "C" + rangeOb.startCol;			
			if(rangeOb.endRow > rangeOb.startRow || rangeOb.endCol > rangeOb.startCol) {
				addressString += ":R" + rangeOb.endRow + "C" + rangeOb.endCol;
			}
			$(this.targetDiv).find("#rangeAddress").html(addressString);
			var w = rangeOb.endCol - rangeOb.startCol + 1;
			var h = rangeOb.endRow - rangeOb.startRow + 1;
			var minWidth = 8;
			var minHeight = 8;
			var origTopLeft = [rangeOb.startRow, rangeOb.startCol];
			var origBotRight = [rangeOb.endRow, rangeOb.endCol];

			if (w < minWidth) {
				rangeOb.startCol = Math.max(1, rangeOb.startCol - 4);
				rangeOb.endCol = rangeOb.startCol + minWidth - 1;
			}
			if (h < minHeight) {
				rangeOb.startRow = Math.max(1, rangeOb.startRow - 4);
				rangeOb.endRow = rangeOb.startRow + minHeight - 1;
			}
			w = rangeOb.endCol - rangeOb.startCol + 1;
			h = rangeOb.endRow - rangeOb.startRow + 1;
			
			var startRowNum = rangeOb.startRow;
			var startColNum = rangeOb.startCol;
			for(var i = 0; i < h + 1; i++) {
				var ct = $(this.targetDiv).find("#cellTable").get(0);
				var curRowNum =  (startRowNum + i - 1)
				if(i==0) {
					$(this.targetDiv).find("#cellTable").append("<tr id='row" + curRowNum + "'><td></td></tr>");
				} else {
					$(this.targetDiv).find("#cellTable").append("<tr id='row" + curRowNum + "'><td id='rowHeader" + curRowNum + "' class='rowHeader'>" + curRowNum + "</td></tr>");	
				}
				var curRow = $(this.targetDiv).find("#row" + curRowNum);
				for(var j = 0; j < w; j++) {
					if(i == 0) {
						var curColNum = startColNum + j;
						$(this.targetDiv).find(curRow).append("<td id='colHeader" + curColNum + "' class='colHeader'>" + curColNum + "</td>");
					} else {
						var curColNum = startColNum + j;
						var focusClass = "unfocused";
						if(curRowNum >= origTopLeft[0] && curRowNum <= origBotRight[0]) {
							if(curColNum >= origTopLeft[1] && curColNum <= origBotRight[1]) {
								focusClass = "focused";
							}
						}

						var cellId = rangeOb.sheetName + "!R" + curRowNum+ "C" + curColNum;
						var val = this.curAPI.getValue(cellId);
						if(!val) val = "";
						$(this.targetDiv).find(curRow).append("<td id='" + cellId + "' class='" + focusClass + " uiCell'>" + val.toString() + "</td>");
					}
				}
			}
			
			
			var self = this;
			$(this.targetDiv).find(".uiCell").click(function() {
				var myId = $(this).attr("id");
				self.setTarget(myId);
			
			});
			
			this.updateTargetCellInfo(rangeOb.sheetName + "!R" + origTopLeft[0] + "C" + origTopLeft[1]);
		}
	}
	
	wbProbe.prototype.setTarget = function(rangeId) {
		$(this.targetDiv).find('#rangeSpecifierInput').val(rangeId);
		this.updateCellOutputs($(this.targetDiv).find('#rangeSpecifierInput').get(0));
	}
	
	wbProbe.prototype.updateTargetCellInfo = function(rangeId) {
		var targetCell = this.curAPI.getBook().getRange(rangeId);
		if(targetCell) {
			targetCell = targetCell.getSingleCellReference();
			if(targetCell.isValue) {
				$("#valueInput").val(this.curAPI.getBook().getValue(targetCell.address()));
				$("#valueSetForm").show();
			}
			if(targetCell.formula) $(this.targetDiv).find('#cellFormula').html(targetCell.formula);
			var referenceList = [];
			if(targetCell.debugExpressionData) {
				referenceList = this.getCellReferences(targetCell.debugExpressionData, targetCell);
			}

			for(var i = 0; i < referenceList.length; i++) {
				var name = referenceList[i].rangeID;
				var valueType = referenceList[i].type;
				var value = valueType=="ref"?this.curAPI.getValue(name):this.curAPI.getBook().getContextualValue(name, targetCell);
				var valueString = window.isArray(value)?wbProbe.getArrayString(value):value;
				var html = "<li class='reference'><span id='referenceName'>" + name + "</span>:" +" " +  "<span>[" + value.toString() + "]</span>" + "</li>";
				//$("#referenceList").append(html);
				$(this.targetDiv).find("#referenceList").append(html);
			}
			var self = this;
			$("li.reference").click(function() {
				var targetName = $(this).find("#referenceName").text();
				self.setTarget(targetName);
			});
			if(targetCell.errorStatus) {
				var cellError = targetCell.errorStatus;
				var errorContextString = cellError.errorContext? cellError.errorContext.address(): "unknown";
				var errHTML = "<h2>ERROR: " + cellError.data + ": " + cellError.text + "  (Error source: " + errorContextString + ")</h2>";
				$(this.targetDiv).find("#errorOutput").append(errHTML);
			}
		}
	}
	wbProbe.getArrayString = function(arr) {
		var outString = "[";
		for(var i = 0; i < arr.length; i++) {
			outString += arr[i].toString() + ", ";
		}
		outString += "]";
		return outString;
	}
	
	wbProbe.prototype.getCellReferences = function(expression, curCell, lastType) {
		var out = [];
		if(expression.type) {
			switch(expression.type) {
				case 'wsFunc': 
					if(window.isArray( expression.argExpressionArray)) {
						for(var i = 0; i < expression.argExpressionArray.length; i++) {
							out = out.concat(this.getCellReferences(expression.argExpressionArray[i], curCell, expression.type));
						}
					} else {
						out = out.concat(this.getCellReferences(expression.argExpressionArray, curCell, expression.type));
					}
					break;
				case 'binary':
					out = out.concat(this.getCellReferences(expression.A, curCell, expression.type));
					out = out.concat(this.getCellReferences(expression.B, curCell, expression.type));
					break;
				case 'namedRangeReference':
					out.push({rangeID: expression.name,
							type: lastType == 'wsFunc'?'ref':'val'});
					break;
				case 'reference':
				
					var address;
					if(expression.worksheet) {
						address = expression.worksheet;
					} else {
						address = curCell.worksheet.name
					}
					address += "!" + "R" + expression.startRow + "C" + expression.startCol;
					if(expression.endRow > expression.startRow || expression.endCol > expression.startCol) {
						address += ":R" + expression.endRow + "C" + expression.endCol;
					}
					
					out.push({rangeID: address,
							type: lastType == 'wsFunc'?'ref':'val'});
					break;
			
			}
		
		}
		return out;
	}
	
	return wbProbe;
});