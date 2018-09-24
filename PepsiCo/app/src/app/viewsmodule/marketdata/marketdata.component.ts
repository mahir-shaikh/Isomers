import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'marketdata',
  templateUrl: './marketdata.component.html',
  styleUrls: ['./marketdata.component.styl']
})
export class MarketdataComponent implements OnInit {
    @Input() marketNumber:number = 0;
    private arrRangeName = ["","Vetera","Escendia"];
    // private isCollapsed: boolean = true;
    private activeIndex: number = 1;
    private tabNo: number;
    private tab1:string;
    private tab2:string;
    private isWhatIfEnabled: boolean = false;
    @ViewChild('errorModal') public errorModalRef: ModalDirective;
    
    constructor(private textengineService: TextService, private calcService: CalcService) { }

    ngOnInit() {
        this.tab1 = this.textengineService.getText("TabHeading1") || "Decision";
        this.tab2 = this.textengineService.getText("TabHeading2") || "Reports";
        this.checkWhatIfStatus();
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {
            case 1:
                this.tabNo = 1;
                break;            
            case 2:
                this.tabNo = 2;
                break;
            default:
                this.tabNo = 1;
                break;
        }
    }

    checkWhatIfStatus(){
        this.isWhatIfEnabled = this.calcService.getValue("tlInputWhatIfActivate") == "0" ? false : true;
    }

    showErrorModal() {
        this.errorModalRef.show();
    }

    hideErrorModal() {
        this.errorModalRef.hide();
    }

}