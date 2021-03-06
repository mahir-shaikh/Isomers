define(['../numeral/numeral', '../moment/moment'], function (numeral, moment) {
    //Thin layer to numeral - provides formatting for some named defaults
    var numberFormatting = {};
    numberFormatting.formatStrings = {};
    numberFormatting.formatStrings.AbbreviatedDollars = "($0.00a)";
    numberFormatting.formatStrings.Date = "date:l";
    numberFormatting.formatStrings.DecimalWithCommas = "0,0";
    numberFormatting.formatStrings.Percent = "0.0%";
    numberFormatting.formatStrings.Percentage = "0.0%";
    numberFormatting.customFormatFunctions = {};
    numberFormatting.customUnformatFunctions = {};
    numberFormatting.customFormatFunctions.Date = function (value) {
        return moment("18991231", "YYYYMMDD").add('days', value).format("l");
    }

    numberFormatting.customUnformatFunctions.Date = function (dateString) {

    }

    //takes format enum name or format string
    numberFormatting.format = function (value, formatName, scaler) {
        //fix scaler = 0 and scaler not provided
        if (formatName.toLowerCase() == "string") {
            return value.toString();
        }
        scaler = scaler ? scaler : 1;
        value = numeral().unformat(value);
        if (isNaN(value)) return "NaN";
        value = value / scaler;
        var formatString = formatName;
        if (numberFormatting.formatStrings.hasOwnProperty(formatName)) {
            formatString = numberFormatting.formatStrings[formatName];
        }

        if (formatString.length >= 6 && formatString.substring(0, 5) == "date:") {
            formatString = formatString.substring(5);
            return moment("18991231", "YYYYMMDD").add('days', value).format(formatString);
        }
        //		else if(numberFormatting.formatStrings.hasOwnProperty(formatName)) {
        //			if(numberFormatting.customFormatFunctions.hasOwnProperty(formatName)) {
        //				return numberFormatting.customFormatFunctions[formatName](value);
        //			} else {
        //				return numeral(value).format(numberFormatting.formatStrings[formatName]);
        //			}
        else {
            return numeral(value).format(formatString);
        }
    }

    //takes format enum name or format string
    numberFormatting.unformat = function (value, scaler) {
        //fix scaler = 0 and scaler not provided
        scaler = scaler ? scaler : 1;
        value = numeral().unformat(value);
        value = value * scaler;
        return value
    }
    return numberFormatting;
});

//# sourceURL=numberFormatting.js