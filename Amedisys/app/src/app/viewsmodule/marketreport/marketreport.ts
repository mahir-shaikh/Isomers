import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { EOR_FEEDBACK } from '../../utils/utils';

@Component({
    selector: 'marketreport',
    templateUrl: './marketreport.html',
    styleUrls: ['./marketreport.css']
})

export class MarketReport implements OnInit, OnDestroy {
    // @ViewChild('marketModal') public childModal: ModalDirective;
    public isVisible:boolean;
    private yearRange = "tlInputTeamYear";
    private range1Base="tlOutputMarketReportProd1";
    private range2Base="tlOutputMarketReportProd2";
    private range3Base="tlOutputMarketReportProd3";
    private range4Base="tlOutputMarketReportProd5";
    private rangeref = "";
    private categorylabels = "Year0, Year1, Year2, Year3";
    private serieslabels = "EnterpriseHW, EnterpriseSW, Consumer, Services";

    constructor(private calcService: CalcService, private router: Router) {}

    ngOnInit() {
        let range1 = "";
        let range2 = "";
        let range3 = "";
        let range4 = "";
        let year = parseInt(this.calcService.getValue(this.yearRange));
        for (let i=0; i<=year; i++) {
            range1 = range1 + (this.range1Base + "_R" + i + ",");
            range2 = range2 + (this.range2Base + "_R" + i + ",");
            range3 = range3 + (this.range3Base + "_R" + i + ",");
            range4 = range4 + (this.range4Base + "_R" + i + ",");
        }
        let remaining = (year+1);
        for (let j=(year+1); j<=3; j++) {
            range1 = range1 + ("null,");
            range2 = range2 + ("null,");
            range3 = range3 + ("null,");
            range4 = range4 + ("null") + (j < 3 ? "," : "");
        }
        this.rangeref = range1 + range2 + range3 + range4; 
    }

    ngOnDestroy() {

    }

    showAlert() {
        // this.childModal.show();
    }

    hideAlert() {
        // this.childModal.hide();
        this.isVisible = false;
    }
}