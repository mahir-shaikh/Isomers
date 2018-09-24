import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';
import * as PapaParse from 'papaparse';
@Injectable()
export class CsvFileReaderService {

    constructor(private numberFormatter: NumberFormattingPipe) { }

    getDataAsJSON(dataString: string, delimiter?: string): any {
        const DELIMITER = (delimiter) ? delimiter : String.fromCharCode(59), /* defaults to ';' */
            config: PapaParse.ParseConfig = { delimiter: DELIMITER, header: false },
            parsedData: PapaParse.ParseResult = Papa.parse(dataString.trim(), config);

        return this.processData(parsedData);
    }

    private processData(parsedData: PapaParse.ParseResult): any {
        const jsonOb: any = {};
        let self = this;

        parsedData.data.forEach(function (dataItem) {
            const rangeName = dataItem[0];
            let rangeVal: any = String(dataItem[1]).trim();
            const unformattedVal = Number(String(dataItem[1]).trim());
            rangeVal = (isNaN(unformattedVal)) ? rangeVal : self.numberFormatter.parse(rangeVal);
            if(rangeName){
                jsonOb[rangeName] = rangeVal;                
            }
        });

        return jsonOb;
    }
}
