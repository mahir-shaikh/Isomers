import { Component, Input, OnInit, OnDestroy, EventEmitter, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DataStore, PRINT_DATA } from '../../utils';

@Component({
    selector: 'print',
    templateUrl: './print.html',
    styleUrls: ['./print.css'],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintComponent implements OnInit, OnDestroy {
    private content: string = "";
    private _printData: Object;
    private printObserver: EventEmitter<any>;
    private triggerPrintDialog: boolean = false;
    
    constructor(private _domSanitizier:DomSanitizer, private textEngineService: TextEngineService, private calcService: CalcService, private router: Router, private dataStore: DataStore, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.printObserver = this.dataStore.getObservableFor(PRINT_DATA).subscribe((printData) => {
            this._printData = printData;
            this.triggerPrintDialog = true;
            this.cdRef.markForCheck();
            // setTimeout(() => {
            //     window.print();
            // }, 500)
        });
    }

    ngOnDestroy() {
        this.printObserver.unsubscribe();
    }

    ngAfterViewChecked() {
        if (this.triggerPrintDialog) {
            this.triggerPrintDialog = false;
            window.print();
        }
    }
}