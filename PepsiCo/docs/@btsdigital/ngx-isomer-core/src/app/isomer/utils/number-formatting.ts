import * as numeral from 'numeral/numeral';
import * as moment from 'moment/moment';

/**
 * NumberFormatting utility that uses momentjs / numeraljs to format numbers as date / various number formats
 *
 */
export class NumberFormatting {
  /**
   * Default formatStrings that can be passed as a valid format type
   *
   */
  private static formatStrings = {
    AbbreviatedDollars: '($0.00a)',
    Date: 'date:l',
    ExpectedLaunchDays: 'expectedlaunchdays',
    DecimalWithCommas: '0,0',
    Percent: '0.0%',
    Millions: '0,0.0',
    MillionsNoDecimal: '0,0'
  };
  // private static customFormatFunctions = {}
  //   "Date": function (value) {
  //     const _moment = moment;
  //     return _moment('18991231', 'YYYYMMDD').add('days', value).format('l');
  //   },
  //   "ExpextedLaunchDays": function (value) {
  //     const _moment = moment;
  //     return _moment('18991231', 'YYYYMMDD').add('days', value).format('DD-MMM');
  //   }
  // }
  /**
   * Format function to format a number to desired format
   *
   * @param {any} value Numeric Value to be formatted
   *
   * @param {string} format String value specifying the format what needs to be applied
   *
   * @param {number} [scaler] optional scaler to be applied when formatting
   */
  static format(value: any, format: string, scaler?: number) {
    const _numeral = numeral,
      _moment = moment;
    if (!format) {
      return value;
    }
    if (format.toLowerCase() === 'string') {
      return value.toString();
    }
    scaler = scaler ? scaler : 1;
    const temp: number = _numeral(value).value();

    if (isNaN(temp)) {
      return value; // return NAN value
    }
    value = temp / scaler;
    let formatString: string = format;
    if (NumberFormatting.formatStrings.hasOwnProperty(formatString)) {
      formatString = NumberFormatting.formatStrings[format];
    }
    if (formatString.substring(0, 5) === 'date:') {
      formatString = formatString.substring(5);
      return  _moment('18991231', 'YYYYMMDD').add(value, 'days').format(formatString);
    } else if (formatString.toLowerCase() === 'expectedlaunchdays') {
        return _moment('19000101', 'YYYYMMDD').add(value, 'days').format('DD-MMM');
    } else if (format.toLowerCase() === 'millions' || format.toLowerCase() === 'millionsnodecimal' ) {
        return _numeral((_numeral(value).value() / 1000000)).format(formatString);
    } else {
        return _numeral(value).format(formatString);
    }
  }

  /**
   * UnFormat function to format a value to its numeric equivalent
   *
   * @param {any} value Numeric Value to be formatted
   *
   * @param {number} [scaler] optional scaler to be applied when formatting
   */
  static unformat(value: string | number, scaler?: number) {
    const _numeral = numeral;
    // fix scaler = 0 and scaler not provided
    scaler = scaler ? scaler : 1;
    // numeral unformatted value is 0, but direct conversion to number fails
    // maybe encountering a string value so send ahead unprocessed but isnt a % value
    // numeral processed obj value processes parsed strings
    if (_numeral(value).value() === 0 && Number(value) !== 0 && String(value).indexOf('%') === -1) {
        return value;
    }
    const temp = _numeral(value).value();
    if (isNaN(temp)) {
      return value;
    }
    value = temp * scaler;
    return value;
  }

}
