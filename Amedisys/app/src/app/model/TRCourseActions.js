define(['./../../libs/numeral/numeral', './../../libs/promise-js/promise'], function(numeral, promise) {
	var actionOb = {};
	
	var executeNewYear = function() {
		//FFB Copy (for trend slides)
		var ffbNameRegex = /^ffbCopy.+$/i;
		var ffbNames = this.workbook.getNames(ffbNameRegex);
		var prevYearValue = numeral().unformat(this.getValue("xxYear"));
		var pasteRows = prevYearValue + 1;
		for(var i = 0; i < ffbNames.length; i++) {
			var curRef = this.getRangeRef(ffbNames[i]);
			var pasteAddress = curRef.resize(pasteRows, curRef.w).address();
			this.copyAndPasteByValue(pasteAddress, pasteAddress);
		}
		this.copyAndPasteByValue("xxcbalNewYearCopy", "obalCashValue");
		var yearVal = numeral().unformat(this.getValue("xxYear"));
		this.setValue("xxYear", yearVal +1);
	}
	
	actionOb["NewYear"] = function() {
			var simMode = this.getValue("xxSim0Tool1");
			if(simMode == 1) {
				this.onNextRecalculate([this, executeNewYear]);
				this.setValue("xxSim0Tool1", 0);
			} else {
				executeNewYear.call(this);
			}
		};
	
	return actionOb;
});