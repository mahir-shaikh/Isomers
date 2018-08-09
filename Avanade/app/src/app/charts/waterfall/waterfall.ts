import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter} from '@angular/core';
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

        this.chartData = this.chartDefaults.getWaterfallDefaults(this.numberformat);

        this.processComponentInputs();

        self.calcService.getApi().then((api) => {
            self.chartData.chart.width = self.width;
            self.chartData.chart.height = self.height;
            self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];
            try {
                for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                    if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                        console.log ("stackedcolumn: " + self.localCategoryLabelsArray[i] + ", " + this.calcService.getValue(self.localCategoryLabelsArray[i], true));
                        self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
                    } else {
                        self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]);
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
                    localData = localData.replace(/,/g,'');
                    localData = localData.replace('\$','');
                    localData = localData.replace('%','');
                    localData = parseInt(localData);
                    let data;
                    if(self.localSeriesLabelsArray[i] == self.sum){
                        data = {
                            name: localSeriesName,
                            isSum: true
                        }
                    }else if(self.localSeriesLabelsArray[i] == self.intermediateSum){
                        data = {
                            name: localSeriesName,
                            isIntermediateSum: true
                        }                        
                    }else{
                        data = {
                            name: localSeriesName,
                            y: localData
                        }                       
                    }
                    self.chartData.series[0].data.push(data);
                }

                if (self.chartoptions !== "") {
                    self.chartoptions = JSON.parse(self.chartoptions);
                }

                _.merge(opt, self.chartData, self.chartoptions);
                // console.log (self.chartData);

                self.chart = new Highcharts.Chart(opt);

                self.observer = api.getObservable().subscribe(() => {
                    for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                        let localData = self.calcService.getValueForYear(self.localRangeRefArray[i], self.year);
                        let series = self.chart.series[0];
                        localData = localData.replace(/,/g,'');
                        localData = localData.replace('\$','');
                        localData = localData.replace('%','');
                        localData = parseInt(localData);

                        let point = series.points[i];
                        point.update(parseInt(localData));
                    }

                });
            }
            catch(e) {
                // do nothing
                console.log("Could not render chart due to data issues")
            }
        });
    }

    processComponentInputs() {
        let self = this,
            localRangeRef = self.rangeref,
            localCategoryLabels = self.categorylabels,
            localSeriesLabels = self.serieslabels,
            localSeriesColors = self.seriescolors;

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
}