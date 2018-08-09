import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'heatmap',
    template: '<div class="gauge-container heatmap"></div>'
})

export class HeatMapComponent implements OnDestroy, OnInit {
    @Input() rangeref:string = "";
    @Input() categorylabels:string = "";
    @Input() serieslabels:string = "";
    @Input() seriescolors:string = "";
    @Input() year:string = "";
    @Input() chartoptions:any = "";
    @Input() min:number;
    @Input() max:number;
    @Input() numberformat:string = "'0.0a'";
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

    constructor(private textengineService: TextEngineService, private calcService: CalcService, el: ElementRef, private chartDefaults: ChartDefaults) {
        let self = this;
        self.el = el;
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.observer.unsubscribe();
    }

    ngOnInit() {
        var opt = {}, self = this;

        this.chartData = this.chartDefaults.getHeatMapChartDefaults(this.numberformat);

        this.processComponentInputs();

        self.calcService.getApi().then((api) => {
            self.chartData.chart.width = self.width;
            self.chartData.chart.height = self.height;
            self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];

            for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                    self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
                } else {
                    self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]);
                }
                if (self.chartData.xAxis.categories[i] == undefined) {
                    self.chartData.xAxis.categories[i] = self.localCategoryLabelsArray[i];
                }
            }

            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                    self.chartData.yAxis.categories[i] = self.calcService.getValue(self.localSeriesLabelsArray[i]);
                } else {
                    self.chartData.yAxis.categories[i] = self.textengineService.getText(self.localSeriesLabelsArray[i]);
                }
                if (self.chartData.yAxis.categories[i] == undefined) {
                    self.chartData.yAxis.categories[i] = self.localSeriesLabelsArray[i];
                }
            }

            let x:number = 0;
            let y:number = 0;
            let localSeriesData = [];
            let localColor = ["#B0CDEA", "#D9E7F5", "#B0CDEA", "#D9E7F5"];
            self.chartData.series = [];
            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                    localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
                } else {
                    localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]);
                }
                let localDataArray = [];
                y = 0;
                for (let j=0; j<self.localCategoryLabelsArray.length; j++) {
                    let localRange = self.localRangeRefArray[(i*self.localCategoryLabelsArray.length)+j];
                    let localData = self.calcService.getValueForYear(localRange, self.year);

                    if (localData != undefined) {
                        localData = localData.replace(/,/g,'');
                        localData = localData.replace('\$','');
                    }

                    // let ldata = [y, x, localData];
                    let ldata = {
                        x: y,
                        y: x,
                        value: localData,
                        color: localColor[y]
                    }
                    localSeriesData.push(ldata);
                    // localDataArray.push(parseFloat(localData));
                    y++;
                }
                x++;
            }

            self.chartData.series.push ({
                name: 'localSeriesName',
                data: localSeriesData
                // data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]]
                // data: [[0, 0, 1], [0, 1, 2], [0, 2, 3], [0, 3, 4], [1, 0, 5], [1, 1, 6], [1, 2, 7], [1, 3, 8], [2, 0, 9], [2, 1, 10], [2, 2, 11], [2, 3, 12], [3, 0, 13], [3, 1, 14], [3, 2, 15], [3, 3, 16]]
            })

            if (self.chartoptions !== "") {
                self.chartoptions = JSON.parse(self.chartoptions);
            }

            _.merge(opt, self.chartData, self.chartoptions);

            // self.chart = new Highcharts.Chart(self.chartData);
            self.chart = new Highcharts.Chart(opt);

            self.observer = api.getObservable().subscribe(() => {
                for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                    let localDataArray = [];
                    let series = self.chart.series[i];
                    for (let j=0; j<self.localCategoryLabelsArray.length; j++) {
                        let localRange = self.localRangeRefArray[(i*self.localCategoryLabelsArray.length)+j];
                        let localData = api.getValueForYear(localRange, self.year);
                        if (localData != undefined) {
                            localData = localData.replace(/,/g,'');
                            localData = localData.replace('\$','');
                        }
                        let point = series.points[j];
                        point.update(parseFloat(localData));
                    }
                }
            });
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

        self.chartData.legend.align = this.legendalign;
        self.chartData.legend.verticalAlign = this.legendverticalalign;
        self.chartData.legend.layout = this.legendlayout;
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}