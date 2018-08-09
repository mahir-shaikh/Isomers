define([], function() {
	var parseUtils = {};
	parseUtils.range1Regex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*))?$/i;
	parseUtils.rangeRCRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?R([1-9][0-9]*)\$?C([1-9][0-9]*)(?::\$?R([1-9][0-9]*)\$?C([1-9][0-9]*))?$/i;
	parseUtils.rangeColRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})(?::\$?([a-zA-Z]{1,2}))?$/i;
	parseUtils.rangeRowRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([1-9][0-9]*)(?::\$?([1-9][0-9]*))?$/i;
	parseUtils.rangeMultiRegex = /^(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*))(\,(?:([a-zA-Z\_\-0-9]*)\!)?\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)(?::\$?([a-zA-Z]{1,2})\$?([1-9][0-9]*)))+?$/i;

	parseUtils.getRCColumn = function(columnCode) {
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
	
	parseUtils.getRangeOb = function(address) {
		if(parseUtils.rangeRCRegex.test(address)) {
			var out = {};
			var regexOut = parseUtils.rangeRCRegex.exec(address);
			out.sheetName = regexOut[1];
			out.startRow = regexOut[2];
			out.startCol = regexOut[3];
			out.endRow = regexOut[4]?regexOut[4]:out.startRow;
			out.endCol = regexOut[5]?regexOut[5]:out.startCol;
			return out;
		} else if(parseUtils.range1Regex.test(address)) {
			var regexCapture = parseUtils.range1Regex.exec(address);
			if(!regexCapture) {
				if(parseUtils.rangeMultiRegex.test(address)) {
					var addresses = address.split(",");
					var outRanges = [];
					for(var i = 0; i < addresses.length; i++) {
						var testRange = parseUtils.getRangeOb(addresses[i]);
						if(testRange) outRanges.push(testRange);
					}
					return outRanges;
				} else if(parseUtils.rangeColRegex.test(address)){
					regexCapture = parseUtils.rangeColRegex.exec(address);
					var out = {};
					if(regexCapture[1]) out.sheetName = regexCapture[1];
					out.startCol = parseInt(regexCapture[2]);
					out.endCol = parseInt(regexCapture[3]);
					out.startRow = 1;
					out.endRow = 65000;
					return out;
				} else if(parseUtils.rangeRowRegex.test(address)){
					regexCapture = parseUtils.rangeRowRegex.exec(address);
					var out = {};
					if(regexCapture[1]) out.sheetName = regexCapture[1];
					out.startRow = parseInt(regexCapture[2]);
					out.endRow = parseInt(regexCapture[3]);
					out.startCol = 1;
					out.endCol = 216;
					return out;
				} else {
					parseUtils.errorLog.push("Error attempting to parse address: " + address);
					return;
				}
			}
			var out = {};
			if(regexCapture[1]) out.sheetName = regexCapture[1];
			out.startCol = parseInt(parseUtils.getRCColumn(regexCapture[2].toUpperCase()));
			out.startRow = parseInt(regexCapture[3]);
			
			if(regexCapture[4]) {
				out.endCol= parseInt(parseUtils.getRCColumn(regexCapture[4].toUpperCase()));
				out.endRow = parseInt(regexCapture[5]);
			}
			return out;
		}
	}	
	return parseUtils;
});

//# sourceURL=parseUtils.js