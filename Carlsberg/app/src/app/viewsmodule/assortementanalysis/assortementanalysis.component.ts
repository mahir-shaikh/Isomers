import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, OnChanges } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router,RouterModule, ActivatedRoute, Data, Params } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';     
import {BubbleChartComponent} from '../../charts';

     


@Component({
    selector: 'assortement-analysis',
    templateUrl: './assortementanalysis.component.html',
    styleUrls: ['./assortementanalysis.component.styl']
})

export class AssortementAnalysisComponent {
    @ViewChild('chart1')  chart1:BubbleChartComponent   ;
    @Input() ChannelNo : number;
    private observer: any;
    private gbcRangeRefX:string;
    private gbcRangeRefY:string;
    private gbcRangeRefZ:string;
    private pvRangeRefX:string;
    private pvRangeRefY:string;
    private pvRangeRefZ:string;
    private gbcLabelChart1: string;
    private pvLabelChart1: string;
    private gcbChartOptions = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "yAxis": { "title": { "text": "GPaL ROS" } }, "xAxis": { "title": { "text": "Weighted Distribution" } } }';
    // private gcbChartOptions = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "verticalAlign": "bottom", "format": "{point.name}"} } },"tooltip": { "useHTML": "true", "pointFormat": "Weighted Distribution : {point.x} </br> GPaL ROS : {point.y} </br> Volume : {point.z} ",  "followPointer": "true" }, "yAxis": { "title": { "text": "GPaL ROS ($M)" } }, "xAxis": { "title": { "text": "Weighted Distribution" } } }';
    private pvChartOptions = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "format": "{point.name}"} } }, "yAxis": { "title": { "text": "Market Average Price" } }, "xAxis": { "title": { "text": "Volume (M)" } }}';
    // private pvChartOptions = '{ "plotOptions": { "series": { "dataLabels": { "enabled": true, "verticalAlign": "bottom", "format": "{point.name}"} } },"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y}",  "followPointer": "true" }, "yAxis": { "title": { "text": "Market Average Price" }, "plotLines": [{ "color": "black", "width": "2", "value": "100" }] }, "xAxis": { "title": { "text": "Volume (M)" } }}';
    private bubblePerSeriesArray = [];
    private basicLineRangeRef: string;
    private basiclineSeriesLabel : string;
    private basiclineCategoryLabels:string;
    private basiclineDataPerSeries: number;
    private PplChartOptions = '{  "yAxis": { "title": { "text": "Price Per Litre" } } }';

    constructor( private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        let self = this;
        this.initializeBPSArray();
        this.updateRangeref();
        this.observer = this.calcService.getObservable().subscribe(() => {
            self.updateRangeref();
        })
    }

    ngOnDestroy() {
        this.observer.unsubscribe();
    }
    onShowCalled(){
      this.chart1.chart.reflow();
    }

    updateRangeref(){
        let k = 0;
        this.basicLineRangeRef="";
        this.basiclineSeriesLabel = "";
        this.basiclineCategoryLabels = "";

        this.gbcRangeRefX = "[";
        this.gbcRangeRefY = "[";
        this.gbcRangeRefZ = "[";
        this.gbcLabelChart1 = "";

        this.pvRangeRefX = "[";
        this.pvRangeRefY = "[";
        this.pvRangeRefZ = "[";
        this.pvLabelChart1 = "";
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
                    this.basicLineRangeRef += "tlOutputCh"+this.ChannelNo+"Analytic2Chart1Serie"+((i*3)+(j+1))+"Point1,";
                    k++;
                    this.basiclineCategoryLabels += "tlOutputCh"+this.ChannelNo+"Analytic2Chart1Serie"+((i*3)+(j+1))+"Label1,";
                    this.basiclineSeriesLabel += "tlOutputCh"+this.ChannelNo+"Analytic2Chart1Serie"+((i*3)+(j+1))+"Label1,";

                    this.gbcRangeRefX += "tlOutputCh"+this.ChannelNo+"Analytic1Chart1XValue"+((i*3)+(j+1))+",";
                    this.gbcRangeRefY += "tlOutputCh"+this.ChannelNo+"Analytic1Chart1YValue"+((i*3)+(j+1))+",";
                    this.gbcRangeRefZ += "tlOutputCh"+this.ChannelNo+"Analytic1Chart1BubbleSize"+((i*3)+(j+1))+",";
                    this.gbcLabelChart1 += "tlOutputCh"+this.ChannelNo+"Analytic1Chart1Label"+((i*3)+(j+1))+",";
                    this.pvRangeRefX += "tlOutputCh"+this.ChannelNo+"Analytic1Chart2XValue"+((i*3)+(j+1))+",";
                    this.pvRangeRefY += "tlOutputCh"+this.ChannelNo+"Analytic1Chart2YValue"+((i*3)+(j+1))+",";
                    this.pvRangeRefZ += "tlOutputCh"+this.ChannelNo+"Analytic1Chart2BubbleSize"+((i*3)+(j+1))+",";
                    this.pvLabelChart1 += "tlOutputCh"+this.ChannelNo+"Analytic1Chart2Label"+((i*3)+(j+1))+",";
                }
            }
        }
        this.basiclineDataPerSeries = k;
        let lastComme = this.basicLineRangeRef.lastIndexOf(",");
        this.basicLineRangeRef = this.basicLineRangeRef.slice(0,lastComme);
        let basciLineRange = this.basicLineRangeRef.split(",");
        this.basicLineRangeRef += ",";
        for(let i=0;i<basciLineRange.length;i++){
            let temp = basciLineRange[i];
            temp = temp.replace("Point1","Point2");
            this.basicLineRangeRef += temp+",";
        }
        // this.basicLineRangeRef += ",";
        for(let i=0;i<basciLineRange.length;i++){
            let temp = basciLineRange[i];
            temp = temp.replace("Point1","Point3");
            this.basicLineRangeRef += temp+",";
        }
        // this.basicLineRangeRef +="";
        lastComme = this.basicLineRangeRef.lastIndexOf(",");
        this.basicLineRangeRef = this.basicLineRangeRef.slice(0,lastComme);
        lastComme = this.basiclineSeriesLabel.lastIndexOf(",");
        this.basiclineSeriesLabel = this.basiclineSeriesLabel.slice(0,lastComme);
        lastComme = this.basiclineCategoryLabels.lastIndexOf(",");
        this.basiclineCategoryLabels = this.basiclineCategoryLabels.slice(0,lastComme);

        if(this.ChannelNo == 2){
            this.basicLineRangeRef = this.basicLineRangeRef.replace(/Chart1/g,"Chart3");
            this.basiclineSeriesLabel = this.basiclineSeriesLabel.replace(/Chart1/g,"Chart3");
            this.basiclineCategoryLabels = this.basiclineCategoryLabels.replace(/Chart1/g,"Chart3");
        }

        lastComme = this.gbcRangeRefX.lastIndexOf(",");
        this.gbcRangeRefX = this.gbcRangeRefX.slice(0,lastComme);
        this.gbcRangeRefX +="]";
        lastComme = this.gbcRangeRefY.lastIndexOf(",");
        this.gbcRangeRefY = this.gbcRangeRefY.slice(0,lastComme);
        this.gbcRangeRefY +="]";
        lastComme = this.gbcRangeRefZ.lastIndexOf(",");
        this.gbcRangeRefZ = this.gbcRangeRefZ.slice(0,lastComme);
        this.gbcRangeRefZ +="]";
        lastComme = this.gbcLabelChart1.lastIndexOf(",");
        this.gbcLabelChart1 = this.gbcLabelChart1.slice(0,lastComme);

        lastComme = this.pvRangeRefX.lastIndexOf(",");
        this.pvRangeRefX = this.pvRangeRefX.slice(0,lastComme);
        this.pvRangeRefX +="]";
        lastComme = this.pvRangeRefY.lastIndexOf(",");
        this.pvRangeRefY = this.pvRangeRefY.slice(0,lastComme);
        this.pvRangeRefY +="]";
        lastComme = this.pvRangeRefZ.lastIndexOf(",");
        this.pvRangeRefZ = this.pvRangeRefZ.slice(0,lastComme);
        this.pvRangeRefZ +="]";
        lastComme = this.pvLabelChart1.lastIndexOf(",");
        this.pvLabelChart1 = this.pvLabelChart1.slice(0,lastComme);
    }

    ngOnChanges(){
        this.updateRangeref();
    }

    initializeBPSArray(){
        let index_1 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod2SlotTotActive");
        let index_2 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod3SlotTotActive");
        let index_3 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod1SlotTotActive");
        let index_4 = this.calcService.getValue("calcCh"+this.ChannelNo+"Prod4SlotTotActive");
        this.bubblePerSeriesArray.push(index_1);
        this.bubblePerSeriesArray.push(index_2);
        this.bubblePerSeriesArray.push(index_3);
        this.bubblePerSeriesArray.push(index_4);
    }
}
