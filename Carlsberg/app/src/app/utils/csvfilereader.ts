import { Injectable } from '@angular/core';
import * as Papa from 'papaparse'
import * as numberFormatting from '../../libs/jsCalc/numberFormatting';

@Injectable()
export class CsvFileReaderService {

    getDataAsJSON(dataString: string, delimiter?:string): any {
        let DELIMITER = (delimiter) ? delimiter : String.fromCharCode(59), /* defaults to ';' */
            config: PapaParse.ParseConfig = { delimiter: DELIMITER, header: false },
            parsedData: PapaParse.ParseResult = Papa.parse(dataString.trim(), config);

        return this.processData(parsedData);
    }

    private processData(parsedData: PapaParse.ParseResult): any {
        let jsonOb: any = {};

        parsedData.data.forEach(function(dataItem) {
            var rangeName = dataItem[0];
            var rangeVal = String(dataItem[1]).trim();
            var unformattedVal = Number(String(dataItem[1]).trim());
            rangeVal = (isNaN(unformattedVal)) ? rangeVal : numberFormatting.unformat(rangeVal);
            jsonOb[rangeName] = rangeVal;
        });

        return jsonOb;
    }
}