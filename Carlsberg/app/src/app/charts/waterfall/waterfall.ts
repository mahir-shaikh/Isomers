import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'waterfall',
    template: '<div class="gauge-container waterfall"></div>'
})

export class WaterfallColumnComponent implements OnDestroy, OnInit {
    @Input() rangeref:string = "";
    @Input() categorylabels:string = "";
    @Input() serieslabels:string = "";
    @Input() seriescolors:string = "";
    @Input() year:string = "";
    @Input() chartoptions:any = "";
    @Input() min:number;
    @Input() max:number;
    @Input() numberformat:string;
    @Input() charttitle:string = "";
    @Input() width:number;
    @Input() height:number;
    @Input() charttitleoffsety:number = -35;
    @Input() chartmargintop:number = 0;
    @Input() sum;
    @Input() intermediateSum;

    private chart:any = null;
    private observer: EventEmitter<any>;
    private gaugeVal:number = 0;
    private $elementRef:any = ElementRef;
    private el:ElementRef = null;
    private localRangeRefArray = [];
    private localCategoryLabelsArray = [];
    private localSeriesLabelsArray = [];
    private localSeriesColorsArray = [];
    private chartData:any;
    private chartNotRender: any;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, el: ElementRef, private chartDefaults: ChartDefaults) {
        let self = this;
        self.el = el;
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
        if (this.observer) {
            this.observer.unsubscribe();
        }
    }

    ngOnInit() {
        var opt = {}, self = this;

        this.chartData = this.chartDefaults.getWaterfallDefaults(this.numberformat);

        this.processComponentInputs();

        self.initializeModel();

        self.observer = this.calcService.getObservable().subscribe(() => {
            if(self.chart){
                self.updateChartData();
            }else{
                self.initializeModel();
            }
        });
    }

    initializeModel(){
        var opt = {}, self = this;

        this.chartData = this.chartDefaults.getWaterfallDefaults(this.numberformat);

        this.processComponentInputs();

            self.chartData.chart.width = self.width;
            self.chartData.chart.height = self.height;
            self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];
            try{
                for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                    if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                        console.log ("stackedcolumn: " + self.localCategoryLabelsArray[i] + ", " + this.calcService.getValue(self.localCategoryLabelsArray[i], true));
                        self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
                    } else {
                        self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                    }
                }

                for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                    let localSeriesName = "";
                    localSeriesName = this.textengineService.getText(this.localSeriesLabelsArray[i]);

                    if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                        localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
                    } else {
                        localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]);
                    }
                    let localData = this.calcService.getValueForYear(this.localRangeRefArray[i], this.year);
                    try {
                        localData = numberFormatting.unformat(localData);
                        if(localData === ""){
                            localData = 0;
                        }
                    }
                    catch (e) {
                        if (localData != undefined && localData != null) {
                            localData = localData.replace(/,/g,'');
                            localData = localData.replace('\$','');
                            localData = localData.replace('%','');
                            localData = parseInt(localData);
                        } else {
                            localData = 0;
                        }
                    }
                        let data;
                        if(self.localSeriesLabelsArray[i] == self.sum){
                            data = {
                                // name: localSeriesName,
                                isSum: true
                            }
                        }else if(self.localSeriesLabelsArray[i] == self.intermediateSum){
                            data = {
                                // name: localSeriesName,
                                isIntermediateSum: true
                            }                        
                        }else{
                            data = {
                                // name: localSeriesName,
                                y: localData
                            }                       
                        }
                    self.chartData.series[0].data.push(data);
                }

                if (self.chartoptions !== "" && typeof(self.chartoptions) != "object") {
                    self.chartoptions = JSON.parse(self.chartoptions);
                }

                _.merge(opt, self.chartData, self.chartoptions);

                self.chart = new Highcharts.Chart(opt);
                self.chartNotRender = "";
        }catch(e){
            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }
    }

      updateChartData(){
        let self = this;
        try{
            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                let localData = this.calcService.getValueForYear(this.localRangeRefArray[i], this.year);
                try {
                    localData = numberFormatting.unformat(localData);
                    if(localData === ""){
                        localData = 0;
                    }
                }
                catch (e) {
                    if (localData != undefined && localData != null) {
                        localData = localData.replace(/,/g,'');
                        localData = localData.replace('\$','');
                        localData = localData.replace('%','');
                        localData = parseInt(localData);
                    } else {
                        localData = 0;
                    }
                }
                    let data;
                    if(self.localSeriesLabelsArray[i] == self.sum){
                        data = {
                            // name: localSeriesName,
                            isSum: true
                        }
                    }else if(self.localSeriesLabelsArray[i] == self.intermediateSum){
                        data = {
                            // name: localSeriesName,
                            isIntermediateSum: true
                        }                        
                    }else{
                        data = {
                            // name: localSeriesName,
                            y: localData
                        }                       
                    }
                let point = self.chart.series[0].data[i];
                point.update(parseInt(localData));
                this.chartNotRender = "";
            }
        }catch(e){

            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }
    }

    processComponentInputs() {
        let self = this,
            localRangeRef = self.rangeref.toString(),
            localCategoryLabels = self.categorylabels.toString(),
            localSeriesLabels = self.serieslabels.toString(),
            localSeriesColors = self.seriescolors.toString();

        if (localRangeRef != undefined) {
            localRangeRef = localRangeRef.replace(/\[|\]/g, '');
            localRangeRef = localRangeRef.replace(/ /g, '');
            this.localRangeRefArray = localRangeRef.split(",");
        }

        if (localCategoryLabels != undefined) {
            localCategoryLabels = localCategoryLabels.replace(/\[|\]/g, '');
            localCategoryLabels = localCategoryLabels.replace(/ /g, '');
            this.localCategoryLabelsArray = localCategoryLabels.split(",");
        }

        if (localSeriesLabels != undefined) {
            localSeriesLabels = localSeriesLabels.replace(/\[|\]/g, '');
            localSeriesLabels = localSeriesLabels.replace(/ /g, '');
            this.localSeriesLabelsArray = localSeriesLabels.split(",");
        }

        if (localSeriesColors != undefined) {
            localSeriesColors = localSeriesColors.replace(/\[|\]/g, '');
            localSeriesColors = localSeriesColors.replace(/ /g, '');
            this.localSeriesColorsArray = localSeriesColors.split(",");
        }

        if (this.min != undefined) {
            self.chartData.yAxis.min = this.min;
        }
        if (this.max != undefined) {
            self.chartData.yAxis.max = this.max;
        }
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }

    ngOnChanges(){
        if(this.chart){
            this.processComponentInputs();
            this.updateChartData();
        }
    }
}