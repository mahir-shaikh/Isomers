
var fs = require('fs');
var console = require('console');
var calcParser = require('../scripts/jsCalc/calcParser.js').calcParser;
var DOMParser = require('xmldom').DOMParser;


var args = {};
args.verbose = false;
args.outputDir = "./";
args.fileName = "";
args.requireable = false;

process.argv.forEach(function(val, index, array) {
	var split = val.indexOf("=");
	if(split >= 0) {
		var name = val.substring(0, split);
		var value = val.substring(split + 1);
		console.log("Command line argument: [" + name + "] - [" + value + "]");
		if(name.length > 0 && value.length > 0) {
			args[name] = value;
		} else if (name.length > 0) {
			args[name] = true;
		}
	} else {
		args[val] = true;
	}
  
});


var strippedName = args.fileName.substring(0, args.fileName.lastIndexOf("."));
console.log("calcParser successfully evaluated " + strippedName);
var common = fs.readFileSync(args.fileName, 'utf8');

//console.log(common);
var xml = new DOMParser().parseFromString(common);
var outJson = JSON.stringify(calcParser.processWorkbookXml(xml));
var extension = "js";

fs.writeFile(args.outputDir + strippedName + "." + extension, outJson, function(err) {
	if(err) {
	
	} else {
		console.log("Model XML for " + strippedName + " successfully converted to JSON with " + calcParser.errorLog.length + " errors.");
		if(args.verbose) {
			for(var i = 0; i < calcParser.errorLog.length; i++) {
				console.log(calcParser.errorLog[i]);
			}
		}
	}

});


//console.log("Outputting requireable version of model.");
outJson = 'define(' + outJson + ');';
extension = "js";

fs.writeFile(args.outputDir + strippedName + "-require." + extension, outJson, function(err) {
	if(err) {
	
	} else {
		console.log("Model XML for " + strippedName + " successfully converted to JSON with " + calcParser.errorLog.length + " errors.");
		if(args.verbose) {
			for(var i = 0; i < calcParser.errorLog.length; i++) {
				console.log(calcParser.errorLog[i]);
			}
		}
	}

});

//console.log("json successfully generated: " + JSON.stringify(outJson));

