import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, OnChanges } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router,RouterModule, ActivatedRoute, Data, Params } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';     


@Component({
    selector: 'promotion-analysis',
    templateUrl: './promotionanalysis.component.html',
    styleUrls: ['./promotionanalysis.component.styl']
})

export class PromotionAnalysisComponent {
    @Input() ChannelNo : number;
    private observer: any;
    // private basicLineRangeRef: string;
    // private basiclineSeriesLabel : string;
    private stackedcolumnRangeRef: string;
    private stackedcolumnSeriesLabel : string;
    private stackedcolumnCategoryLabels: string;
    private gbcRangeRefXBubbleChart1: string;
    private gbcRangeRefYBubbleChart1: string;
    private gbcRangeRefZBubbleChart1: string;
    private gbcRangeRefXBubbleChart2: string;
    private gbcRangeRefYBubbleChart2: string;
    private gbcRangeRefZBubbleChart2: string;
    private gbcRangeRefXBubbleChart3: string;
    private gbcRangeRefYBubbleChart3: string;
    private gbcRangeRefZBubbleChart3: string;
    private gbcLabelChart1 : string ;
    private gbcLabelChart2 : string ;
    private gbcLabelChart3 : string ;
    // private basiclineCategoryLabels:string;
    // private basiclineDataPerSeries: number;
    private gcbChartOptions1 = '{  "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "yAxis": { "title": { "text": "ROI" } }, "xAxis": { "title": { "text": "GPal Uplift" } } }';
    // private gcbChartOptions1 = '{  "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "tooltip": { "useHTML": "true", "pointFormat": "GPal Uplift : {point.x} </br> ROI : {point.y} </br> Volume : {point.z} ",  "followPointer": "true" }, "yAxis": { "title": { "text": "ROI" } }, "xAxis": { "title": { "text": "GPal Uplift" } } }';
    private gcbChartOptions2 = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "yAxis": { "title": { "text": "GPaL Uplift" } }, "xAxis": { "title": { "text": "Customer Uplift" } } }';
    // private gcbChartOptions2 = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "tooltip": { "useHTML": "true", "pointFormat": "Customer Uplift : {point.x} </br> GPaL Uplift : {point.y} </br> Volume : {point.z} ",  "followPointer": "true" }, "yAxis": { "title": { "text": "GPaL Uplift" } }, "xAxis": { "title": { "text": "Customer Uplift" } } }';
    private gcbChartOptions3 = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "yAxis": { "title": { "text": "ROI" } }, "xAxis": { "title": { "text": "Volume Uplift" } } }';
    // private gcbChartOptions3 = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "verticalAlign": "bottom", "format": "{point.name}"} } }, "tooltip": { "useHTML": "true", "pointFormat": "Volume Uplift : {point.x} </br> ROI : {point.y} </br> Volume : {point.z} ",  "followPointer": "true" }, "yAxis": { "title": { "text": "ROI" } }, "xAxis": { "title": { "text": "Volume Uplift" } } }';
    // private PplChartOptions = '{  "yAxis": { "title": { "text": "Price Per Litre" } } }';
    private stackedColumnChartOptions = '{  "yAxis": { "max": "1" } }';
    private bubblePerSeriesArray = [];

    constructor( private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        let self = this;
        self.updateRangeref();
        this.observer = this.calcService.getObservable().subscribe(() => {
            self.updateRangeref();
        })
    }

    ngOnDestroy() {
        this.observer.unsubscribe();
    }

    updateRangeref(){
        
        this.initializeBPSArray();
        // this.basicLineRangeRef="";
        // this.basiclineSeriesLabel = "";
        this.gbcRangeRefXBubbleChart1 = "[";
        this.gbcRangeRefYBubbleChart1 = "[";
        this.gbcRangeRefZBubbleChart1 = "[";
        this.gbcRangeRefXBubbleChart2 = "[";
        this.gbcRangeRefYBubbleChart2 = "[";
        this.gbcRangeRefZBubbleChart2 = "[";
        this.gbcRangeRefXBubbleChart3 = "[";
        this.gbcRangeRefYBubbleChart3 = "[";
        this.gbcRangeRefZBubbleChart3 = "[";
        this.stackedcolumnCategoryLabels = "";
        this.stackedcolumnRangeRef = "";
        this.gbcLabelChart1 = "";
        this.gbcLabelChart2 = "";
        this.gbcLabelChart3 = "";
        // let k = 0;
        // this.basiclineCategoryLabels = "";
        for(let i=0;i<4;i++){
            let b;
            if(i == 0){
                b = 1;
            }else if( i == 1){
                b = 2;
            }
            else if( i == 2){
                b = 0;
            }else if( i == 3){
                b = 3;
            }
            for(let j=0;j<3;j++){
                let number = this.calcService.getValue('tlInputCh'+this.ChannelNo+'Prod'+(b+1)+'Slot'+(j+1)+'Active');
                if(number == "1"){
                    // this.basicLineRangeRef += "tlOutputCh"+this.ChannelNo+"Analytic2Chart1Serie1Point1,";
                    // k++;
                    // this.basiclineCategoryLabels += "tlOutputCh"+this.ChannelNo+"Analytic2Chart1Serie"+((i*3)+(j+1))+"Label1,";
                    // this.basiclineSeriesLabel += "tlOutputCh"+this.ChannelNo+"Analytic2Chart1Serie"+((i*3)+(j+1))+"Label1,";
                    if(this.ChannelNo != 1){
                        this.gbcRangeRefXBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3XValue"+((i*3)+(j+1))+",";
                        this.gbcRangeRefYBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3YValue"+((i*3)+(j+1))+",";
                        this.gbcRangeRefZBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3BubbleSize"+((i*3)+(j+1))+",";
                        this.gbcLabelChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3Label"+((i*3)+(j+1))+",";
                        this.gbcRangeRefXBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4XValue"+((i*3)+(j+1))+",";
                        this.gbcRangeRefYBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4YValue"+((i*3)+(j+1))+",";
                        this.gbcRangeRefZBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4BubbleSize"+((i*3)+(j+1))+",";
                        this.gbcLabelChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4Label"+((i*3)+(j+1))+",";
                        this.gbcRangeRefXBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5XValue"+((i*3)+(j+1))+",";
                        this.gbcRangeRefYBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5YValue"+((i*3)+(j+1))+",";
                        this.gbcRangeRefZBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5BubbleSize"+((i*3)+(j+1))+",";
                        this.gbcLabelChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5Label"+((i*3)+(j+1))+",";
                    }else{
                        this.gbcRangeRefXBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3XValue"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefXBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3XValue"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefYBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3YValue"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefYBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3YValue"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefZBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3BubbleSize"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefZBubbleChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3BubbleSize"+((i*6)+((j*2)+2))+",";
                        this.gbcLabelChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3Label"+((i*6)+((j*2)+1))+","; 
                        this.gbcLabelChart1 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart3Label"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefXBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4XValue"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefXBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4XValue"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefYBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4YValue"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefYBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4YValue"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefZBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4BubbleSize"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefZBubbleChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4BubbleSize"+((i*6)+((j*2)+2))+",";
                        this.gbcLabelChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4Label"+((i*6)+((j*2)+1))+",";
                        this.gbcLabelChart2 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart4Label"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefXBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5XValue"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefXBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5XValue"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefYBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5YValue"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefYBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5YValue"+((i*6)+((j*2)+2))+",";
                        this.gbcRangeRefZBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5BubbleSize"+((i*6)+((j*2)+1))+",";
                        this.gbcRangeRefZBubbleChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5BubbleSize"+((i*6)+((j*2)+2))+",";
                        this.gbcLabelChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5Label"+((i*6)+((j*2)+1))+",";
                        this.gbcLabelChart3 += "tlOutputCh"+this.ChannelNo+"Analytic2Chart5Label"+((i*6)+((j*2)+2))+",";
                    }
                        this.stackedcolumnCategoryLabels += "tlOutputCh"+this.ChannelNo+"Analytic2Chart2Label"+((i*3)+(j+1))+",";
                        this.stackedcolumnRangeRef += "tlOutputCh"+this.ChannelNo+"Analytic2Chart2Serie2Item"+((i*3)+(j+1))+",";
                    
                }
            }
        }
        // this.basiclineDataPerSeries = k;
        // let lastComme = this.basicLineRangeRef.lastIndexOf(",");
        // this.basicLineRangeRef = this.basicLineRangeRef.slice(0,lastComme);
        // let basciLineRange = this.basicLineRangeRef.split(",");
        // this.basicLineRangeRef += ",";
        // for(let i=0;i<basciLineRange.length;i++){
        //     let temp = basciLineRange[i];
        //     temp = temp.replace("Point1","Point2");
        //     this.basicLineRangeRef += temp+",";
        // }
        // // this.basicLineRangeRef += ",";
        // for(let i=0;i<basciLineRange.length;i++){
        //     let temp = basciLineRange[i];
        //     temp = temp.replace("Point1","Point3");
        //     this.basicLineRangeRef += temp+",";
        // }

        // // this.basicLineRangeRef +="";
        // lastComme = this.basicLineRangeRef.lastIndexOf(",");
        // this.basicLineRangeRef = this.basicLineRangeRef.slice(0,lastComme);
        // lastComme = this.basiclineSeriesLabel.lastIndexOf(",");
        // this.basiclineSeriesLabel = this.basiclineSeriesLabel.slice(0,lastComme);
        // lastComme = this.basiclineCategoryLabels.lastIndexOf(",");
        // this.basiclineCategoryLabels = this.basiclineCategoryLabels.slice(0,lastComme);

        let lastComme = this.gbcRangeRefXBubbleChart1.lastIndexOf(",");
        this.gbcRangeRefXBubbleChart1 = this.gbcRangeRefXBubbleChart1.slice(0,lastComme);
        this.gbcRangeRefXBubbleChart1 +="]";
        lastComme = this.gbcRangeRefYBubbleChart1.lastIndexOf(",");
        this.gbcRangeRefYBubbleChart1 = this.gbcRangeRefYBubbleChart1.slice(0,lastComme);
        this.gbcRangeRefYBubbleChart1 +="]";
        lastComme = this.gbcRangeRefZBubbleChart1.lastIndexOf(",");
        this.gbcRangeRefZBubbleChart1 = this.gbcRangeRefZBubbleChart1.slice(0,lastComme);
        this.gbcRangeRefZBubbleChart1 +="]";
        lastComme = this.gbcLabelChart1.lastIndexOf(",");
        this.gbcLabelChart1 = this.gbcLabelChart1.slice(0,lastComme);


        lastComme = this.gbcRangeRefXBubbleChart2.lastIndexOf(",");
        this.gbcRangeRefXBubbleChart2 = this.gbcRangeRefXBubbleChart2.slice(0,lastComme);
        this.gbcRangeRefXBubbleChart2 +="]";
        lastComme = this.gbcRangeRefYBubbleChart2.lastIndexOf(",");
        this.gbcRangeRefYBubbleChart2 = this.gbcRangeRefYBubbleChart2.slice(0,lastComme);
        this.gbcRangeRefYBubbleChart2 +="]";
        lastComme = this.gbcRangeRefZBubbleChart2.lastIndexOf(",");
        this.gbcRangeRefZBubbleChart2 = this.gbcRangeRefZBubbleChart2.slice(0,lastComme);
        this.gbcRangeRefZBubbleChart2 +="]";
        lastComme = this.gbcLabelChart2.lastIndexOf(",");
        this.gbcLabelChart2 = this.gbcLabelChart2.slice(0,lastComme);

        lastComme = this.gbcRangeRefXBubbleChart3.lastIndexOf(",");
        this.gbcRangeRefXBubbleChart3 = this.gbcRangeRefXBubbleChart3.slice(0,lastComme);
        this.gbcRangeRefXBubbleChart3 +="]";
        lastComme = this.gbcRangeRefYBubbleChart3.lastIndexOf(",");
        this.gbcRangeRefYBubbleChart3 = this.gbcRangeRefYBubbleChart3.slice(0,lastComme);
        this.gbcRangeRefYBubbleChart3 +="]";
        lastComme = this.gbcRangeRefZBubbleChart3.lastIndexOf(",");
        this.gbcRangeRefZBubbleChart3 = this.gbcRangeRefZBubbleChart3.slice(0,lastComme);
        this.gbcRangeRefZBubbleChart3 +="]";
        lastComme = this.gbcLabelChart3.lastIndexOf(",");
        this.gbcLabelChart3 = this.gbcLabelChart3.slice(0,lastComme);

        lastComme = this.stackedcolumnCategoryLabels.lastIndexOf(",");
        this.stackedcolumnCategoryLabels = this.stackedcolumnCategoryLabels.slice(0,lastComme);


        lastComme = this.stackedcolumnRangeRef.lastIndexOf(",");
        this.stackedcolumnRangeRef = this.stackedcolumnRangeRef.slice(0,lastComme);

        let stackedRange = this.stackedcolumnRangeRef.split(",");
        this.stackedcolumnRangeRef+=",";
        for(let i=0;i<stackedRange.length;i++){
            let temp = stackedRange[i];
            temp = temp.replace("Serie2","Serie1");
            this.stackedcolumnRangeRef += temp+",";
        }

        lastComme = this.stackedcolumnRangeRef.lastIndexOf(",");
        this.stackedcolumnRangeRef = this.stackedcolumnRangeRef.slice(0,lastComme);
        this.stackedcolumnSeriesLabel = "tlOutputCh"+this.ChannelNo+"Analytic2Chart2Serie2Title, tlOutputCh"+this.ChannelNo+"Analytic2Chart2Serie1Title"
    }

    ngOnChanges(){
        this.updateRangeref();
    }

    initializeBPSArray(){
        let index_1 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod2SlotTotActive");
        let index_2 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod3SlotTotActive");
        let index_3 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod1SlotTotActive");
        let index_4 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod4SlotTotActive");
        if(this.ChannelNo ==1){
            index_1 *=2;
            index_2 *=2;
            index_3 *=2;
            index_4 *=2;
        }
        this.bubblePerSeriesArray.push(index_1);
        this.bubblePerSeriesArray.push(index_2);
        this.bubblePerSeriesArray.push(index_3);
        this.bubblePerSeriesArray.push(index_4);
    }
}
