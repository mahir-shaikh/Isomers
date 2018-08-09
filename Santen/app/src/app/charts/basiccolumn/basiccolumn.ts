import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'basiccolumn',
    template: '<div class="gauge-container basiccolumn"></div>'
})

export class BasicColumnComponent implements OnDestroy, OnInit, OnChanges {
    @Input() rangeRef:string = "";
    @Input() categoryLabels:string = "";
    @Input() seriesLabels:string = "";
    @Input() year:string = "";
    @Input() chartOptions:any = "";
    @Input() min:number;
    @Input() max:number;
    @Input() numberFormat:string = "";
    @Input() chartTitle:string = "";
    @Input() numberformat:string = "";
    @Input() width:number;
    @Input() height:number;
    @Input() chartTitleOffsetY:number = -35;
    @Input() chartMarginTop:number = 0;
    @Input() legendAlign = "right";
    @Input() legendVerticalAlign = "middle";
    @Input() legendLayout = "vertical";
    @Input() hideSeries: Array<Number> = [];
    @Input() categoryFormat: string= "";

    private chart:any = null;
    private observer:EventEmitter<any>;
    private gaugeVal:number = 0;
    private $elementRef:any = ElementRef;
    private el:ElementRef = null;
    private localRangeRefArray = [];
    private localCategoryLabelsArray = [];
    private localSeriesLabelsArray = [];
    private chartData:any;


    constructor(private textengineService: TextEngineService, private calcService: CalcService, el: ElementRef, private chartDefaults: ChartDefaults) {
        let self = this;
        self.el = el;
    }

    updateChart(value) {
        let self = this;
        let series = self.chart.series[0];
        let point = series.points[0];
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.observer.unsubscribe();
    }

    ngOnInit() {
        var opt = {}, self = this;

        this.chartData = this.chartDefaults.getBasicColumnChartDefaults(this.numberFormat, this.categoryFormat);

        this.processChartInputs();

        self.calcService.getApi().then((api) => {
            self.chartData.chart.width = self.width;
            self.chartData.chart.height = self.height;
            self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];

            for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                    self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
                } else {
                    self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                }
            }

            self.chartData.series = [];
            for (let i=0; i<this.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                    localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
                } else {
                    localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]) || self.localSeriesLabelsArray[i];
                }
                let localDataArray = [];
                for (let j=0; j<this.localCategoryLabelsArray.length; j++) {
                    let localData = null;
                    let localRange = this.localRangeRefArray[(i*this.localCategoryLabelsArray.length)+j];
                    localData = this.calcService.getValueForYear(localRange, this.year, true);
                    try {
                        localData = numberFormatting.unformat(localData);
                        localDataArray.push(localData);
                    }
                    catch (e) {
                        if (localData != undefined) {
                            localData = localData.toString();
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
                    data: localDataArray
                })
            }

            if (self.chartOptions !== "")
                self.chartOptions = JSON.parse(self.chartOptions);

            _.merge(opt, self.chartData, self.chartOptions);

            self.chart = new Highcharts.Chart(opt);
            self.observer = api.getObservable().subscribe(() => {
                for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                    self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
                } else {
                    self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                }
            }
            _.merge(opt, self.chartData, self.chartOptions);

                for (let i=0; i<this.localSeriesLabelsArray.length; i++) {
                    let localDataArray = [];
                    let series = self.chart.series[i];
                    for (let j=0; j<this.localCategoryLabelsArray.length; j++) {
                        let localData = null;
                        let localRange = this.localRangeRefArray[(i*this.localCategoryLabelsArray.length)+j];
                        localData = this.calcService.getValueForYear(localRange, this.year, true) || localRange;

                        try {
                            localData = numberFormatting.unformat(localData);
                        }
                        catch (e) {
                            if (localData != undefined) {
                                localData = localData.toString();
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

                
            });
        });
    }

    processChartInputs() {
        let self = this;
        let localRangeRef = self.rangeRef.toString();
        let localCategoryLabels = self.categoryLabels.toString();
        let localSeriesLabels = self.seriesLabels.toString();

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

        if (this.min != undefined) {
            self.chartData.yAxis.min = this.min;
        }
        if (this.max != undefined) {
            self.chartData.yAxis.max = this.max;
        }

        self.chartData.legend.align = this.legendAlign;
        self.chartData.legend.verticalAlign = this.legendVerticalAlign;
        self.chartData.legend.layout = this.legendLayout;

    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['hideSeries'] && !changes['hideSeries'].isFirstChange() && changes['hideSeries'].currentValue) {
            let hiddenSeries: Array<number> = changes['hideSeries'].currentValue;
            // hiddenSeries.forEach((seriesIndex) => {
            //     if (this.chartData.series[seriesIndex]) {
            //         this.chartData.series[seriesIndex].hide();
            //     }
            // })
            this.chart.series.forEach((series, seriesIndex) => {
                if (hiddenSeries.indexOf(seriesIndex) !== -1) {
                    series.hide();
                }
                else {
                    series.show();
                }
            })
        }
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}