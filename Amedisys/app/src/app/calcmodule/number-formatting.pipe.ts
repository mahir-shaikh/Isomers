import { Pipe, PipeTransform } from '@angular/core';
import * as numberFormatting from '../../libs/jsCalc/numberFormatting';

/* number formatting using numberformatting.js (numeraljs) */
@Pipe({ name: 'numFormat' })
export class NumberFormattingPipe implements PipeTransform {
    transform(value: string, format: string, scaler?: number): string {
        // let unformattedVal = NumberFormatting.unformat(value, scaler);
        if (!format) {
            return value;
        }
        var out: string = String(numberFormatting.format(value, format, scaler));
        return (out === "NaN") ? "" : out;
    }

    parse(value: string, scaler?: number) {
        let parsedVal = numberFormatting.unformat(value, scaler);
        // if (parsedVal % 1 !== 0) {
        //     parsedVal = parsedVal.toFixed(2);
        // }
        return parsedVal;
    }
}