import { Component, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { CsvFileReaderService } from '../../utils';

@Component({
    selector: 'im-importfile',
    templateUrl: 'importfile.component.html'
})

export class ImportFileComponent implements OnInit {
    
    @Output() fileLoaded: EventEmitter<any> = new EventEmitter<any>();
    private el: HTMLElement;

    constructor(private elRef: ElementRef, private csvFileReader: CsvFileReaderService) {}


    ngOnInit() {
        this.el = this.elRef.nativeElement;
    }

    showFileChooser() {
        // let fileInputel = this.el.querySelector('.fileInput').dispatchEvent(new MouseEvent('click'));
        this.el.querySelector('.fileInput')['click']();
    }

    onFileSelect(event) {
        let files: FileList = event.target.files,
            reader: FileReader = new FileReader(),
            self = this;

        reader.onload = function(e) {
            // logger.log(e.target.result);
            var jsonOb = self.csvFileReader.getDataAsJSON(e.target['result'], ',');
            // self.logger.log("Parsed CSV Data - ", jsonOb);
            // self.appendToModel(jsonOb, model);
            self.fileLoaded.emit(jsonOb);
            event.target.value = null; // reset the input element
            // resolve(true); // resolve the promise
        }
        reader.onerror = function(e) {
            // reject(e);
        }
        reader.readAsText(files[0]);
    }
}