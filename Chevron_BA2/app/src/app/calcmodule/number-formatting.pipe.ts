import { Pipe, PipeTransform } from '@angular/core';
import * as numberFormatting from '../../libs/jsCalc/numberFormatting';

/* number formatting using numberformatting.js (numeraljs) */
@Pipe({ name: 'numFormat' })
export class NumberFormattingPipe implements PipeTransform {
    transform(value: string, format: string, scaler?: number, showBlank?: boolean): string {
        let SHOW_BLANK = (typeof showBlank !== "undefined" && showBlank) ? showBlank : false;
        // let unformattedVal = NumberFormatting.unformat(value, scaler);
        if ((!(value && format) && !SHOW_BLANK) || (value == "NA")) {
            return value;
        }
        // replacing scientific notation with whole value, since the number isn't parsed nicely with the "e-10" format
        // may need to revisit this if displaying in scientific notation is required at some point
        let strValue = value.toString();
        if (strValue.length != undefined) {
            if (strValue.indexOf('e') != -1) {
                value = this.toFixed(parseFloat(value));
            }
        }
        value = String(value);
        var out: string = String(numberFormatting.format(value, format, scaler));
        return (out === "NaN") ? "" : out;
    }

    parse(value: string, scaler?: number) {
        if (!value) return value;
        value = String(value);
        let parsedVal = numberFormatting.unformat(value, scaler);
        // if (parsedVal % 1 !== 0) {
        //     parsedVal = parsedVal.toFixed(2);
        // }
        return parsedVal;
    }

    toFixed(x) {
        if (Math.abs(x) < 1.0) {
            var e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10,e-1);
                if(x.toString().indexOf(".") != -1){
                    x = x.toString().replace(".","");
                }
                x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
        } else {
            var e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10,e);
                x += (new Array(e+1)).join('0');
            }
        }
        return x;
    }
}