import { Injectable } from '@angular/core';

@Injectable()
export class FileSaver {

    constructor() {
        console.log("Filesaver constructor called!");
    }

    fileSaveAs(fileName:string, jsonOb:any, delim?:string, lineEnding?:string) {
        if (typeof jsonOb === "undefined") {
            return;
        }
        if (typeof jsonOb === "string") {
            jsonOb = JSON.parse(jsonOb);
        }
        var csvString = this.generateStringDataFromJSON(jsonOb, delim, lineEnding)
            , dataURI = this.constructCsvFileBlobURI(csvString, fileName)
            , link = this.createAnchorEl(dataURI, fileName);
        // click the link element to prompt saveas or download file directly
        link.click();
    }


    private createAnchorEl(dataURI:string, fileName:string) {
        var anchorEl = document.createElement('a');
        anchorEl.setAttribute('href', dataURI);
        anchorEl.setAttribute('download', fileName);
        return anchorEl;
    }

    private constructCsvFileBlobURI(dataString:string, fileName:string) {
        var properties = { type: 'text/csv' }
            , file = null;
        dataString = dataString.trim();
        try {
            file = new File([dataString], fileName, properties);
        }
        catch (e) {
            file = new Blob([dataString], properties);
        }

        return URL.createObjectURL(file);
    }

    private generateStringDataFromJSON(jsonOb, delimChar, lineEnding) {
        var header
            , DELIMITER = (typeof delimChar !== "undefined" && delimChar) ? delimChar : String.fromCharCode(59) /* defaults to ';' */
            , rows = ''
            , NEW_LINE = (typeof lineEnding !== "undefined" && lineEnding) ? lineEnding : '\n';

        header = "RangeName" + DELIMITER + "RangeValue";

        Object.keys(jsonOb).forEach((key) => {
            let content = '"' + this.escapeQuotes(jsonOb[key]) + '"';
            rows += key + DELIMITER + content + NEW_LINE;
        });

        return ("sep=" + DELIMITER + NEW_LINE + rows);
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
        return String(content).replace(/"/g, "\"\"\"");
    }

    test() {
        /*data = [];
        data.push("This is a test\n");
        data.push("Of creating a file\n");
        data.push("In a browser\n");
        properties = {type: 'plain/text'}; // Specify the file's mime-type.
        try {
          // Specify the filename using the File constructor, but ...
          file = new File(data, "file.txt", properties);
        } catch (e) {
          // ... fall back to the Blob constructor if that isn't supported.
          file = new Blob(data, properties);
        }
        url = URL.createObjectURL(file);
        document.getElementById('link').href = url;*/
        var jsonString = '{"toolRD!R13C7":"4","toolRD!R17C7":"4","toolRD!R19C7":"4","toolRD!R21C7":"3","toolRD!R23C7":"3","toolRD!R15C7":"5"}';
        var jsonOb = JSON.parse(jsonString);
        this.fileSaveAs("Test File.csv", jsonOb);
    }
}