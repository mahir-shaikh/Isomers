import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, OnChanges, EventEmitter} from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'stackedbar',
    template: '<div class="gauge-container stackedbar"></div>'
})

export class StackedBarComponent implements OnDestroy, OnInit, OnChanges {
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
    @Input() legendalign = "right";
    @Input() legendverticalalign = "middle";
    @Input() legendlayout = "vertical";

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
    private chartNotRender: string;


    constructor(private textengineService: TextEngineService, private calcService: CalcService, el: ElementRef, private chartDefaults: ChartDefaults) {
        let self = this;
        self.el = el;
    }

    // updateChart(value) {
        // let self = this;
        // let series = self.chart.series[0];
        // let point = series.points[0];

        // point.update(self.gaugeVal);
    // }

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

        this.InitializeModel();
        self.observer = self.calcService.getObservable().subscribe(() => {
            this.onModelChange();

        });
    }

    ngOnChanges(){
        if(this.chartData){
            
            this.processComponentInputs();
            this.onModelChange();
        }
    }

    InitializeModel(){
        var opt = {}, self = this;

        this.chartData = this.chartDefaults.getStackedBarChartDefaults(this.numberformat);

        this.processComponentInputs();

        self.chartData.chart.width = self.width;
        self.chartData.chart.height = self.height;
        self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];
        try {
            for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                    console.log ("stackedbar: " + self.localCategoryLabelsArray[i] + ", " + this.calcService.getValue(self.localCategoryLabelsArray[i], true));
                    self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
                } else {
                    self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                }
            }

            self.chartData.series = [];
            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                    localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
                } else {
                    localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]) || self.localSeriesLabelsArray[i];
                }
                let localDataArray = [];
                for (let j=0; j<self.localCategoryLabelsArray.length; j++) {
                    let localRange = self.localRangeRefArray[(i*self.localCategoryLabelsArray.length)+j];
                    let localData = self.calcService.getValueForYear(localRange, self.year);
                    // console.log (localRange + ": " + self.year + ", " + localData);
                    try {
                        localData = numberFormatting.unformat(localData);
                        localDataArray.push(localData);
                    }
                    catch (e) {
                        if (localData != undefined && localData != null) {
                            localData = localData.replace(/,/g, '');
                            localData = localData.replace('\$', '');
                            localData = parseInt(localData);
                        } else {
                            localData = 1;
                        }

                        localDataArray.push(parseInt(localData));
                    }
                }
                self.chartData.series.push ({
                    name: localSeriesName,
                    data: localDataArray,
                    color: self.localSeriesColorsArray[i],
                    borderWidth: 0
                })
            }

            if (self.chartoptions !== "") {
                self.chartoptions = JSON.parse(self.chartoptions);
            }

            _.merge(opt, self.chartData, self.chartoptions);
            // console.log (self.chartData);

            self.chart = new Highcharts.Chart(opt);
            this.chartNotRender = "";

        }catch(e) {
            // do nothing
            console.log("Could not render chart due to data issues");
            this.chartNotRender = "Could not render chart due to data issues";
        }
    }

    onModelChange(){
        let self=this;
        try{
            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                let localDataArray = [];
                let series = self.chart.series[i];
                for (let j=0; j<self.localCategoryLabelsArray.length; j++) {
                    let localRange = self.localRangeRefArray[(i*self.localCategoryLabelsArray.length)+j];
                    let localData = this.calcService.getValueForYear(localRange, self.year);
                    try {
                        localData = numberFormatting.unformat(localData);
                    }
                    catch (e) {
                        if (localData != undefined && localData != null) {
                            localData = localData.replace(/,/g, '');
                            localData = localData.replace('\$', '');
                            localData = parseInt(localData);
                        } else {
                            localData = 1;
                        }
                    }

                    localDataArray.push(localData);
                }

                series.setData(localDataArray);
            }
                this.chartNotRender = "";

        }catch(e) {
            // do nothing
            console.log("Could not render chart due to data issues");
            this.chartNotRender = "Could not render chart due to data issues";
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

        self.chartData.legend.align = this.legendalign;
        self.chartData.legend.verticalAlign = this.legendverticalalign;
        self.chartData.legend.layout = this.legendlayout;
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}