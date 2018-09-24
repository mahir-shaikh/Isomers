import { Pipe, PipeTransform, Input } from '@angular/core';
import { NumberFormatting } from '../../../utils/number-formatting';

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
@Pipe({
  name: 'numFormat'
})
export class NumberFormattingPipe implements PipeTransform {
  /**
   * Numberformatting Class reference
   *
   */
  private numberFormatting = NumberFormatting;

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
  transform(value: string | number, format: string, scaler?: number): string|number {
    if (!(value && format)) {
      return value;
    }
    value = String(value);
    const out: string = String(this.numberFormatting.format(value, format, scaler));
    return (out === 'NaN') ? '' : out;
  }

  /**
   * Parse function to unformat a formatted value to its numerical value
   *
   * @param {(string|number)} value The formatted value to be parsed to a number
   *
   * @param {number} [scaler] The scaler value to be applied before unformatting the number
   */
  parse(value: string|number, scaler?: number): string | number {
    if (!value) {
      return value;
    }
    value = String(value);
    return this.numberFormatting.unformat(value, scaler);
  }

}
