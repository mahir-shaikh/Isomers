import { Component, Input, OnInit, OnChanges, EventEmitter, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { Chart } from 'highcharts'
import { BasicLineComponent, StackedColumnComponent} from '../../charts';


@Component({
    selector: 'report-data',
    templateUrl: './reportdata.component.html',
    styleUrls: ['./reportdata.component.styl']
})

export class ReportDataComponent {
    @Input() PathName: String;
    private years=[1,2,3];
    private totalSlide:boolean=false;
    private basicLineRangeRef: string;
    private basiclineSeriesLabel: string;
    private basicColRangeRef: string;
    private basicColSeriesLabel: string;
    private isChartVisible : boolean = false;
    private productNameSelected: boolean = false;
    private switchNameSelected: boolean = false;
   
    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
            
        if(this.PathName=="Total"){
            this.totalSlide=true;
        }

        let PleaseSelect = this.calcService.getValue("nmSelect");
        let temp = this.calcService.getValue("tlInput"+this.PathName+"_ProdMT");
        if(temp == PleaseSelect){
            this.productNameSelected = false;
        }else{
            this.productNameSelected = true;
        }
        temp = this.calcService.getValue("tlInput"+this.PathName+"_ProdSub");
        if(temp == PleaseSelect){
            this.switchNameSelected = false;
        }else{
            this.switchNameSelected = true;
        }
        
        this.basicLineRangeRef = "[[tlOutput_Cht_"+this.PathName+"_Y1_M2SInv,tlOutput_Cht_"+this.PathName+"_Y2_M2SInv,tlOutput_Cht_"+this.PathName+"_Y3_M2SInv],[tlOutput_Cht_"+this.PathName+"_Y1_SRPDisc,tlOutput_Cht_"+this.PathName+"_Y2_SRPDisc,tlOutput_Cht_"+this.PathName+"_Y3_SRPDisc],[tlOutput_Cht_"+this.PathName+"_Y1_MTDisc,tlOutput_Cht_"+this.PathName+"_Y2_MTDisc,tlOutput_Cht_"+this.PathName+"_Y3_MTDisc]]";
        this.basiclineSeriesLabel = "tlOutput_Cht_"+this.PathName+"_M2SLabel, tlOutput_Cht_"+this.PathName+"_SRPDiscLabel, tlOutput_Cht_"+this.PathName+"_MTDiscLabel";
        
        //this.basicColRangeRef = "[[tlOutput_Cht_"+this.PathName+"Yr1_CostYr1,tlOutput_Cht_"+this.PathName+"Yr1_CostYr2,tlOutput_Cht_"+this.PathName+"Yr1_CostYr3],[tlOutput_Cht_"+this.PathName+"Yr2_CostYr1,tlOutput_Cht_"+this.PathName+"Yr2_CostYr2,tlOutput_Cht_"+this.PathName+"Yr2_CostYr3],[tlOutput_Cht_"+this.PathName+"Yr3_CostYr1,tlOutput_Cht_"+this.PathName+"Yr3_CostYr2,tlOutput_Cht_"+this.PathName+"Yr3_CostYr3],[tlOutput_Cht_"+this.PathName+"MTCost_Yr1,tlOutput_Cht_"+this.PathName+"MTCost_Yr2,tlOutput_Cht_"+this.PathName+"MTCost_Yr3],[tlOutput_Cht_"+this.PathName+"SubSRP1,tlOutput_Cht_"+this.PathName+"SubSRP2,tlOutput_Cht_"+this.PathName+"SubSRP]]";
        this.basicColRangeRef = "[[tlOutput_Cht_"+this.PathName+"Yr1_CostYr1,tlOutput_Cht_"+this.PathName+"Yr2_CostYr1,tlOutput_Cht_"+this.PathName+"Yr3_CostYr1,tlOutput_Cht_"+this.PathName+"MTCost_Yr1],[tlOutput_Cht_"+this.PathName+"Yr1_CostYr2,tlOutput_Cht_"+this.PathName+"Yr2_CostYr2,tlOutput_Cht_"+this.PathName+"Yr3_CostYr2,tlOutput_Cht_"+this.PathName+"MTCost_Yr2],[tlOutput_Cht_"+this.PathName+"Yr1_CostYr3,tlOutput_Cht_"+this.PathName+"Yr2_CostYr3,tlOutput_Cht_"+this.PathName+"Yr3_CostYr3,tlOutput_Cht_"+this.PathName+"MTCost_Yr3]]";
       
        this.basicColSeriesLabel = "tlOutput_Cht_"+this.PathName+"_HorizLbl1, tlOutput_Cht_"+this.PathName+"_HorizLbl2, tlOutput_Cht_"+this.PathName+"_HorizLbl3";
        
    }

    onViewChange(event){
        this.isChartVisible = !this.isChartVisible;
        if(event){
            setTimeout(()=>{
                if(typeof(Event) === 'function') {
                  // modern browsers
                  window.dispatchEvent(new Event('resize'));
                }else{
                  // for IE and other old browsers
                  // causes deprecation warning on modern browsers
                  var evt = window.document.createEvent('UIEvents'); 
                  evt.initUIEvent('resize', true, false, window, 0); 
                  window.dispatchEvent(evt);
                }
            },200);
        }
    }

    ngOnDestroy() {
    }

    ngOnChanges(){

    }
}
