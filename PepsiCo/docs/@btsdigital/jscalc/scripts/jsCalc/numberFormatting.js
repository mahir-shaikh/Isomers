define([], function () {
    //Thin layer to numeral - provides formatting for some named defaults
    var numberFormatting = {},
    numeral = require('numeral'),
    moment = require('moment');
    numberFormatting.formatStrings = {};
    numberFormatting.formatStrings.AbbreviatedDollars = "($0.00a)";
    numberFormatting.formatStrings.Date = "date:l";
    numberFormatting.formatStrings.ExpectedLaunchDays = "days:l"
    numberFormatting.formatStrings.DecimalWithCommas = "0,0";
    numberFormatting.formatStrings.Percent = "0.0%";
    numberFormatting.formatStrings.Percentage = "0.0%";
    numberFormatting.formatStrings.millions = "0,0.0";
    numberFormatting.formatStrings.millionsnodecimal = "0,0";
    numberFormatting.customFormatFunctions = {};
    numberFormatting.customUnformatFunctions = {};
    numberFormatting.customFormatFunctions.Date = function (value) {
        return moment("18991231", "YYYYMMDD").add('days', value).format("l");
    }
    numberFormatting.customFormatFunctions.ExpectedLaunchDays = function(value) {
        return moment("18991231", "YYYYMMDD").add('days', value).format("DD-MMM");
    }

    numberFormatting.customUnformatFunctions.Date = function (dateString) {

    }

    //takes format enum name or format string
    numberFormatting.format = function (value, formatName, scaler) {
        //fix scaler = 0 and scaler not provided
        if (formatName.toLowerCase() == "string") {
            return value.toString();
        }
        value = String(value);
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
        else if (formatName.toLowerCase() === "expectedlaunchdays") {
            return moment("19000101", "YYYYMMDD").add('days', value).format("DD-MMM");
        }
        //      else if(numberFormatting.formatStrings.hasOwnProperty(formatName)) {
        //          if(numberFormatting.customFormatFunctions.hasOwnProperty(formatName)) {
        //              return numberFormatting.customFormatFunctions[formatName](value);
        //          } else {
        //              return numeral(value).format(numberFormatting.formatStrings[formatName]);
        //
        else if (formatName.toLowerCase() === "millions" || formatName.toLowerCase() === "millionsnodecimal" ) {
            return numeral((numeral(value) / 1000000)).format(formatString);
        }
        else {
            return numeral(value).format(formatString);
        }
    }

    //takes format enum name or format string
    numberFormatting.unformat = function (value, scaler) {
        if (!value) {
            return value;
        }
        //fix scaler = 0 and scaler not provided
        scaler = scaler ? scaler : 1;
        // numeral unformatted value is 0, but direct conversion to number fails - maybe encountering a string value so send ahead unprocessed but isnt a % or $ value
        // numeral processed obj value processes parsed strings
        if (value && typeof value.trim === "function" && numeral(value)._value === 0 && Number(value) !== 0 && value.indexOf('%') === -1 && value.trim().indexOf('$') !== 0) {
            return value;
        }
        value = numeral().unformat(value);
        value = value * scaler;
        return value
    }
    return numberFormatting;
});

//# sourceURL=numberFormatting.js
