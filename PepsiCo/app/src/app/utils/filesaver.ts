import { Injectable } from '@angular/core';

@Injectable()
export class FileSaver {

    constructor() { }

    fileSaveAs(fileName: string, jsonOb: any, delim?: string, lineEnding?: string) {
        if (typeof jsonOb === 'undefined') {
            return;
        }
        if (typeof jsonOb === 'string') {
            jsonOb = JSON.parse(jsonOb);
        }
        const csvString = this.generateStringDataFromJSON(jsonOb, delim, lineEnding)
            , dataURI = this.constructCsvFileBlobURI(csvString, fileName)
            , link = this.createAnchorEl(dataURI, fileName);
        // click the link element to prompt saveas or download file directly
        link.click();
    }


    private createAnchorEl(dataURI: string, fileName: string) {
        const anchorEl = document.createElement('a');
        anchorEl.setAttribute('href', dataURI);
        anchorEl.setAttribute('download', fileName);
        return anchorEl;
    }

    private constructCsvFileBlobURI(dataString: string, fileName: string) {
        const properties = { type: 'text/csv' };
        let file = null;
        dataString = dataString.trim();
        try {
            file = new File([dataString], fileName, properties);
        } catch (e) {
            file = new Blob([dataString], properties);
        }

        return URL.createObjectURL(file);
    }

    private generateStringDataFromJSON(jsonOb, delimChar, lineEnding) {
        let header,
            rows = '';
        const DELIMITER = (typeof delimChar !== 'undefined' && delimChar) ? delimChar : String.fromCharCode(59) /* defaults to ';' */
            , NEW_LINE = (typeof lineEnding !== 'undefined' && lineEnding) ? lineEnding : '\n';

        header = 'RangeName' + DELIMITER + 'RangeValue';

        Object.keys(jsonOb).forEach((key) => {
            const content = '"' + this.escapeQuotes(jsonOb[key]) + '"';
            rows += key + DELIMITER + content + NEW_LINE;
        });

        return rows;
        // return ('sep=' + DELIMITER + NEW_LINE + rows);
    }

    // private escapeText(content: string, delimiter?: any) {
    //     content = this.escapeQuotes(content);
    //     content = this.escapeDelims(content, delimiter);
    //     return content;
    // }

    // private escapeDelims(content:any, delimiter:any): string {
    //     let pattern = new RegExp('(' + delimiter + ')', 'g');
    //     return String(content).replace(pattern, "\"$1\"");
    // }

    private escapeQuotes(content: any): string {
        return String(content).replace(/"/g, '\"\"\"');
    }
}