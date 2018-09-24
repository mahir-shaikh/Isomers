import { Component, OnInit } from '@angular/core';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';

@Component({
  selector: 'app-gss',
  templateUrl: './gss.component.html',
  styleUrls: ['./gss.component.styl']
})
export class GssComponent implements OnInit {
    private productRangeArray = ["Very Narrow","Narrow","Intermediate","Broad","Very Broad"];
    private hrLevelArray = ["1","2","3","4","5","6","7","8","9","10"];
    private techImpArray = ["1","2","3","4","5"];
    // private isCollapsed: boolean = true;
    private activeIndex: number = 1;
    private tabNo: number;
    private tab1:string;
    private tab2:string;
    private whatIfMode : boolean = false;
    private modelChangeListner: any;

    constructor(private textengineService: TextService, private calcService: CalcService) { }

    ngOnInit() {
        let self = this;
        this.tab1 = this.textengineService.getText("TabHeading1") || "Decision";
        this.tab2 = this.textengineService.getText("TabHeading2") || "Reports";
        this.whatIfMode = this.calcService.getValue("tlInputWhatIfActivate") == "0" || this.calcService.getValue("tlInputWhatIfActivate") == "false"  ? false : true;
        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            self.whatIfMode = self.calcService.getValue("tlInputWhatIfActivate") == "0" || this.calcService.getValue("tlInputWhatIfActivate") == "false" ? false : true;
        });
    }

    ngOnDestroy(){
        this.modelChangeListner.unsubscribe();
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

    onModeChange(event){
        //need to confirm this.
        if(event){
            this.calcService.setValue("tlInputWhatIfActivate","1");
        }else{
            this.calcService.setValue("tlInputWhatIfActivate","0");
        }
    }

}