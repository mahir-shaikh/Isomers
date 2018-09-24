define(['numeral'], function(numeral) {
	var actionOb = {};
	
	actionOb["SetSimMode"] = function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			var simMode = self.getValue("xxSim0Tool1");
			self.setValue("xxSim0Tool1", 0);
			self.completeCalculation().then(resolve);
		});
	}

	actionOb["StoreHistoricalData"] = function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			//Store historical data
			self.saveCurrentPeriodHistoricalData('xxYear');
			resolve();
		});
	}
	
	actionOb["ExecuteTSFBCopy"]  = function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			var prevYearValue = numeral().unformat(self.getValue("xxYear"));
			
			//Store historical data
			self.saveCurrentPeriodHistoricalData('xxYear');
			
			//FFB Copy (for trend slides)
			var ffbNameRegex = /^ffbCopy.+$/i;
			var ffbNames = self.workbook.getNames(ffbNameRegex);
			
			var pasteRows = prevYearValue + 1;
			for(var i = 0; i < ffbNames.length; i++) {
				var curRef = self.getRangeRef(ffbNames[i]);
				var pasteAddress = curRef.resize(pasteRows, curRef.w).address();
				self.copyAndPasteByValue(pasteAddress, pasteAddress);
			}
			self.completeCalculation().then(resolve);
		});
	}
	
	actionOb["ExecuteNewYear"] = function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.copyAndPasteByValue("xxcbalNewYearCopy", "obalCashValue");
			var yearVal = numeral().unformat(self.getValue("xxYear"));
			self.setValue("xxYear", yearVal +1);
			self.setValue("xxSim0Tool1", 1);
			self.completeCalculation().then(function() {
				resolve();
			});
		});
	}
	
	actionOb["ResetDecisions"] = function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			
			self.setValue("tlInputSpecProg1Chosen", false);
			self.setValue("tlInputSpecProg2Chosen", false);
			self.setValue("tlInputSpecProg3Chosen", false);
			self.setValue("tlInputSpecProg4Chosen", false);
			self.setValue("tlInputSpecProg5Chosen", false);
			self.setValue("tlInputSpecProg6Chosen", false);
			self.setValue("tlInputSpecProg7Chosen", false);
			self.setValue("tlInputSpecProg8Chosen", false);
			self.setValue("tlInputSpecProg9Chosen", false);
			self.setValue("tlInputSpecProg10Chosen", false);
			self.setValue("tlInputSpecProg11Chosen", false);
			self.setValue("tlInputSpecProg12Chosen", false);
			self.setValue("tlInputSpecProg13Chosen", false);
			self.setValue("tlInputSpecProg14Chosen", false);
			self.setValue("tlInputSpecProg15Chosen", false);
			self.setValue("tlInputSpecProg16Chosen", false);
			self.setValue("tlInputSpecProg17Chosen", false);
			self.setValue("tlInputSpecProg18Chosen", false);
			self.setValue("tlInputSpecProg19Chosen", false);
			self.setValue("tlInputSpecProg20Chosen", false);
			self.setValue("tlInputSpecProg21Chosen", false);
			self.setValue("tlInputSpecProg22Chosen", false);
	
    //Event Page

			self.setValue("tlInputEvent101Chosen", false);
			self.setValue("tlInputEvent102Chosen", false);
			self.setValue("tlInputEvent103Chosen", false);
   
    
			self.setValue("tlInputEvent201Chosen", false);
			self.setValue("tlInputEvent202Chosen", false);
			self.setValue("tlInputEvent203Chosen", false);
   
			self.setValue("tlInputEvent301Chosen", false);
			self.setValue("tlInputEvent302Chosen", false);
			self.setValue("tlInputEvent303Chosen", false);
   
			self.setValue("tlInputEvent401Chosen", false);
			self.setValue("tlInputEvent402Chosen", false);
			self.setValue("tlInputEvent403Chosen", false);
   
			self.setValue("tlInputEvent501Chosen", false);
			self.setValue("tlInputEvent502Chosen", false);
			self.setValue("tlInputEvent503Chosen", false);
   
			self.setValue("tlInputEvent601Chosen", false);
			self.setValue("tlInputEvent602Chosen", false);
			self.setValue("tlInputEvent603Chosen", false);
   
			self.setValue("tlInputEvent701Chosen", false);
			self.setValue("tlInputEvent702Chosen", false);
			self.setValue("tlInputEvent703Chosen", false);
   
			self.setValue("tlInputEvent801Chosen", false);
			self.setValue("tlInputEvent802Chosen", false);
			self.setValue("tlInputEvent803Chosen", false);
   
			self.setValue("tlInputEvent901Chosen", false);
			self.setValue("tlInputEvent902Chosen", false);
			self.setValue("tlInputEvent903Chosen", false);
   
			//RD Page
			self.setValue("tlInputProd1ProdTechLvl", 0);
			self.setValue("tlInputProd2ProdTechLvl", 0);
			self.setValue("tlInputProd1TTMIntFTEs", 0);
			self.setValue("tlInputProd2TTMIntFTEs", 0);
			self.setValue("tlInputProd1TTMConFTEs", 0);
			self.setValue("tlInputProd2TTMConFTEs", 0);
			self.setValue("tlInputContentLvl", 0);
			
			//People Page
			self.setValue("tlInputEmp1Change", 0);
			self.setValue("tlInputEmp1TrainingLvl", 0);
			
			//Operations Page
			self.setValue("tlInputGlobalExpansion", 0);
			self.setValue("tlInputSFCoverage", 0);

			self.completeCalculation().then(function() {
				resolve();
			});
		});
	}
	
	
	
	actionOb["NewYear"] = function() {
		var self = this;
		
		return new Promise(function(resolve, reject) {
			/*var simMode = self.getValue("xxSim0Tool1");
			self.setValue("xxSim0Tool1", 0);
			self.completeCalculation().then(function (){
				executeNewYear.call(self).then(function() {
					resolve();
				});
			});*/
			self.runCourseAction("SetSimMode").then(function() {
				self.runCourseAction("StoreHistoricalData").then(function() {
					self.runCourseAction("ExecuteTSFBCopy").then(function() {
						self.runCourseAction("ExecuteNewYear").then(function() {
							self.runCourseAction("ResetDecisions").then(function() {
								resolve();
							});
						});
					});
				});
			});
		});
	};
	
	return actionOb;
});