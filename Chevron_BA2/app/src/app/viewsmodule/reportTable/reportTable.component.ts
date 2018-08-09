import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'report-table',
    templateUrl: './reportTable.component.html',
    styleUrls: ['./reportTable.component.styl']
})
export class ReportTableCompopnent {
    private routeObserver: any;
    private isCollpased: boolean = false;
    private _items: Array<String> = [];
    private _tables: Array<String> = [];
    private tablesValues: Array<number> = [];
    private tablesValues1: Array<number> = [];
    private tableValue: Array<any> = [];
    private tableRanges: Array<any> = [];
    private formerValueRangeRef: Array<any> = [];
    private _table2Titles: Array<string> = [];
    private tableColumsTitle: Array<any> = [];
    private table1Ranges: Array<string> = [];
    private table2Ranges: Array<string> = [];
    private tableHeading: string;
    private numberFormat: Array<string> =[];
    private suffix: string;
    @Input() type: number;

    constructor(private dataStore: DataStore, private utils: Utils, private router: Router, private calcService: CalcService, private textEngineService: TextEngineService, private dataAdaptor: DataAdaptorService) { };
    ngOnInit() {
        this.initializeTableRowColumnTitles();
        this.generateTableRanges(this.type);
        //this.getValues();
    }
    initializeTableRowColumnTitles() {
        this.intitalizeTableData(this.type);
    }
    generateTableRanges(type: number) {
        let rangeStart = "tlOutput_tlInputFinancials_";
        let formerRangeStart = "tlOutput_tlInputFinancials_A"
        let startColumn: string = "D";
        let formerRangeStartColumn: string = "A";
        this.numberFormat = [];
        this.formerValueRangeRef = [];
        this.suffix = "";
        switch (type) {
            case 3:
            case 1:
            this.suffix = "/BBL";
                let startCellTable1: number = 22;
                if (type == 3) {
                    startCellTable1 = 50;
                }
                let CellToSkip1 = startCellTable1 + 3;
                let CellToSkip2 = startCellTable1 + 8;
                for (let i = 0; i < 10; i++) {
                    startCellTable1++;
                    startColumn = "D";
                    let format = "$0aM";
                    if(i == 9)
                    {
                        format = "$0.00a";
                    }
                    else if(i==0)
                    {
                        format = "0.aK";
                    }
                    if (startCellTable1 != CellToSkip1 && startCellTable1 != CellToSkip2) {
                        for (let j = 0; j < 8; j++) {
                            startColumn = this.nextChar(startColumn);
                            if (startColumn.charAt(0) != "F" && startColumn.charAt(0) != "J") {
                                let range = rangeStart + startColumn + startCellTable1;
                                this.tableRanges.push(range);
                                this.numberFormat.push(format);
                            }
                        }
                    }
                }
                // if(type == 3){
                	startCellTable1 = 51;
                    CellToSkip1 = startCellTable1 + 3;
                    CellToSkip2 = startCellTable1 + 8;
                    for (let i = 0; i < 10; i++) {
                        startCellTable1++;
                        formerRangeStartColumn = "@";
                        if (startCellTable1 != CellToSkip1 && startCellTable1 != CellToSkip2) {
                            for (let j = 0; j < 8; j++) {
                                formerRangeStartColumn = this.nextChar(formerRangeStartColumn);
                                if (formerRangeStartColumn.charAt(0) != "B" && formerRangeStartColumn.charAt(0) != "F") {
                                    let range = formerRangeStart + formerRangeStartColumn + startCellTable1;
                                    if(type == 3){
                                        this.formerValueRangeRef.push(range);
                                    }else{
                                        this.formerValueRangeRef.push(0);
                                    }
                                }
                            }
                        }
                    }
                // }
                break;
            case 4:
            case 2:
                let startCellTable2 = 38;
                let totalRows = 5;
                if (type == 4) {
                    startCellTable2 = 66;
                    totalRows = 9;
                    this.suffix = "/BBL";
                }
                for (let i = 0; i < totalRows; i++) {
                    startCellTable2++;
                    startColumn = "D";
                    let format = "$0aM";
                    if(i == 5 &&  type == 4)
                    // if(i == 2 || (i == 5 &&  type == 4))
                    {
                        format = "$0.00a";
                    }
                    else if(i==8 && type == 4)
                    {
                        format = "0.0%";
                    }
                    if (startCellTable2 != 73) {
                        for (let j = 0; j < 8; j++) {
                            startColumn = this.nextChar(startColumn);
                            if (startColumn.charAt(0) != "F" && startColumn.charAt(0) != "J") {
                                let range = rangeStart + startColumn + startCellTable2;
                                this.tableRanges.push(range);
                                this.numberFormat.push(format);
                            }
                        }
                    }
                }
                // if(type == 4){
                    startCellTable2 = 67;
                    let CellToSkip = startCellTable2 + 7;

                    for (let i = 0; i < totalRows; i++) {
                        startCellTable2++;
                        formerRangeStartColumn = "@";
                        if (startCellTable2 != CellToSkip) {
                            for (let j = 0; j < 8; j++) {
                                formerRangeStartColumn = this.nextChar(formerRangeStartColumn);
                                if (formerRangeStartColumn.charAt(0) != "B" && formerRangeStartColumn.charAt(0) != "F") {
                                    let range = formerRangeStart + formerRangeStartColumn + startCellTable2;
                                    if(type == 4){
                                        this.formerValueRangeRef.push(range);
                                    }else{
                                        this.formerValueRangeRef.push(0);
                                    }
                                }
                            }
                        }
                    }
                // }

        }
        // this.tableRanges.push(this.table1Ranges);
        // this.tableRanges.push(this.table2Ranges);
    }


    intitalizeTableData(type: number) {
        switch (type) {
            case 3:
            case 1:
                for (let i = 1; i < 8; i++) {
                    let labelrangeRef = "PnLReportLabel" + i;
                    let label = this.textEngineService.getText(labelrangeRef);
                    this.tableColumsTitle.push(label);
                }
                this.tableColumsTitle.push(" ");
                this.generateTableRanges(type);
                break;
            case 4:
            case 2:
                for (let i = 1; i < 6; i++) {
                    let labelrangeRef = "CashFlowReportLabel" + i;
                    let label = this.textEngineService.getText(labelrangeRef);
                    this.tableColumsTitle.push(label);
                }
                this.tableColumsTitle.push(" ");
                if (type == 4) {
                    this.tableColumsTitle.push("Capital Employed");
                    this.tableColumsTitle.push("ROCE");
                }
                this.generateTableRanges(type);
                break;
        }
    }
    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }
}
