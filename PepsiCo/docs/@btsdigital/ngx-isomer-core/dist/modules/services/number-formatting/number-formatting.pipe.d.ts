import { PipeTransform } from '@angular/core';
/**
 * Numberformatting Pipe for formatting numeric outputs into desired format
 *
 * __Usage :__
 * value | numFormat:format:scaler
 *
 * __Example :__
 * {{ value | numFormat:0.00a}}
 * Formats value to thousands / millions / billions format eg: 2.34b
 *
 */
export declare class NumberFormattingPipe implements PipeTransform {
    /**
     * Numberformatting Class reference
     *
     */
    private numberFormatting;
    /**
     * Transform function to format a given number to the desired format
     *
     * @param {(string|number)} value The value to be transformed
     *
     * @param {string} format The numberformatting to be applied
     *
     * @param {number} [scaler] The scaler value to be applied before formatting the number
     *
     */
    transform(value: string | number, format: string, scaler?: number): string | number;
    /**
     * Parse function to unformat a formatted value to its numerical value
     *
     * @param {(string|number)} value The formatted value to be parsed to a number
     *
     * @param {number} [scaler] The scaler value to be applied before unformatting the number
     */
    parse(value: string | number, scaler?: number): string | number;
}
