import { Component, OnInit, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs/Rx';


@Component({
  selector: 'app-integrationplan',
  templateUrl: './integrationplan.component.html',
  styleUrls: ['./integrationplan.component.styl']
})
export class IntegrationPlanComponent implements OnInit {
	private activeIndex: number = 0;
    private currentRound: number;
    private tab1:string;
    private tab2:string;
    private tab3:string;
    private tab4:string;
    private tab5:string;
    private tab6:string;
    @ViewChild("scrollContainer") scrollContainerRef : ElementRef;

    constructor(private textengineService: TextEngineService, private calcService: CalcService) {}

    ngOnInit() {
        this.currentRound = this.calcService.getValue("xxCurrentRound");
        this.tab1 = this.textengineService.getText("TabLabel1");
        this.tab2 = this.textengineService.getText("TabLabel2");
        this.tab3 = this.textengineService.getText("TabLabel3");
        this.tab4 = this.textengineService.getText("TabLabel4");
        this.tab5 = this.textengineService.getText("TabLabel5");
        this.tab6 = "Scenario"//this.textengineService.getText("TabLabel3");
    }

    ngOnDestroy() {
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        if(this.scrollContainerRef){
            this.scrollContainerRef.nativeElement.scrollTop = 0;
        }
    }

}