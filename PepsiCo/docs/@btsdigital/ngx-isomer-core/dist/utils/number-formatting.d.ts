/**
 * NumberFormatting utility that uses momentjs / numeraljs to format numbers as date / various number formats
 *
 */
export declare class NumberFormatting {
    /**
     * Default formatStrings that can be passed as a valid format type
     *
     */
    private static formatStrings;
    /**
     * Format function to format a number to desired format
     *
     * @param {any} value Numeric Value to be formatted
     *
     * @param {string} format String value specifying the format what needs to be applied
     *
     * @param {number} [scaler] optional scaler to be applied when formatting
     */
    static format(value: any, format: string, scaler?: number): any;
    /**
     * UnFormat function to format a value to its numeric equivalent
     *
     * @param {any} value Numeric Value to be formatted
     *
     * @param {number} [scaler] optional scaler to be applied when formatting
     */
    static unformat(value: string | number, scaler?: number): string | number;
}
