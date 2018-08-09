import { Component, Input, OnInit, OnDestroy, EventEmitter, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DataStore, PRINT_DATA, EVENTS } from '../../utils';

@Component({
    selector: 'print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.styl'],
    providers: []
})

export class PrintComponent implements OnInit, OnDestroy {
    private content: string = "";
    private _printData: Object;
    private printObserver: EventEmitter<any>;
    private triggerPrintDialog: boolean = false;
    private NoOfVisiblePaths = [];

    constructor(private _domSanitizier:DomSanitizer, private textEngineService: TextEngineService, private calcService: CalcService, private router: Router, private dataStore: DataStore, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.printObserver = this.dataStore.getObservableFor(EVENTS.PRINT_PAGE).subscribe(() => {
            let totalActivePath = this.calcService.getValue("calcTotalActivePaths");
            this.NoOfVisiblePaths = [];
            if(totalActivePath == 0){
                this.NoOfVisiblePaths.push(1);
            }else{
                for(let i = 0; i < totalActivePath; i++){
                    this.NoOfVisiblePaths.push(1);
                }
            }
            this.triggerPrintDialog = true;
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