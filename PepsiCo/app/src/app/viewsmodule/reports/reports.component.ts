import { Component, OnInit } from '@angular/core';
import { TextService } from '@btsdigital/ngx-isomer-core';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.styl']
})
export class ReportsComponent implements OnInit {
    private activeIndex: number = 1;
    private reportNo: number;
    private report1: string;
    private report2: string;
    private report3: string;
    private report4: string;

    constructor(private textengineService: TextService) { }

    ngOnInit() {
        this.report1 = this.textengineService.getText("ReportTabHeading1");
        this.report2 = this.textengineService.getText("ReportTabHeading2");
        this.report3 = this.textengineService.getText("ReportTabHeading3");
        this.report4 = this.textengineService.getText("ReportTabHeading4");
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {
            case 1:
                this.reportNo = 1;
                break;
            case 2:
                this.reportNo = 2;
                break;
            case 3:
                this.reportNo = 3;
                break;
            case 4:
                this.reportNo = 4;
                break;
            default:
                this.reportNo = 1;
                break;
        }
    }

}