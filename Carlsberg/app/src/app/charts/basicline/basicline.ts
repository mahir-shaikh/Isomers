import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'basicline',
    template: '<div class="gauge-container basicline"></div>'
})

export class BasicLineComponent implements OnDestroy, OnInit, OnChanges {
    @Input() rangeref: string = "";
    @Input() categorylabels: string = "";
    @Input() serieslabels: string = "";
    @Input() year: string = "";
    @Input() chartoptions: any;
    @Input() min: number;
    @Input() max: number;
    @Input() numberformat: string = "";
    @Input() charttitle: string = "";
    @Input() width: number;
    @Input() height: number;
    @Input() linewidth = "";
    @Input() charttitleoffsety: number = -35;
    @Input() chartmargintop: number = 0;
    @Input() legendalign = "right";
    @Input() legendverticalalign = "middle";
    @Input() legendlayout = "vertical";
    @Input() hideSeries: Array < Number > = [];

    private chart: any = null;
    private observer: any;
    private gaugeVal: number = 0;
    private $elementRef: any = ElementRef;
    private el: ElementRef = null;
    private localRangeRefArray = [];
    private localCategoryLabelsArray = [];
    private localSeriesLabelsArray = [];

    private chartData: any;
    public chartNotRender: any;


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
        var opt = {},
            self = this;

        this.chartData = this.chartDefaults.getBasicLineChartDefaults(this.numberformat);
        this.processChartInputs();


        self.chartData.chart.width = self.width;
        self.chartData.chart.height = self.height;
        self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];

        try {
        for (let i = 0; i < self.localCategoryLabelsArray.length; i++) {
            if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i]);
            } else {
                self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
            }
        }

        self.chartData.series = [];
        for (let i = 0; i < this.localSeriesLabelsArray.length; i++) {
            let localSeriesName = "";
            if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
            } else {
                localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]);
            }
            let localDataArray = [];
            for (let j = 0; j < this.localCategoryLabelsArray.length; j++) {
                let localData = null;
                let localRange = this.localRangeRefArray[(i * this.localCategoryLabelsArray.length) + j];
                localData = this.calcService.getValueForYear(localRange, this.year, true);
                try {
                    localData = numberFormatting.unformat(localData);
                    localDataArray.push(localData);
                } catch (e) {
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

            let localLineWidth: Number = 1;
            if ((this.linewidth != null) && (this.linewidth != undefined) && (this.linewidth != "")) {
                localLineWidth = Number(this.linewidth);
            }

            self.chartData.series.push({
                name: localSeriesName,
                data: localDataArray,
                lineWidth: localLineWidth
            })
        }

        if (self.chartoptions !== "" && self.chartoptions != undefined && typeof(self.chartoptions) != "object")
            self.chartoptions = JSON.parse(self.chartoptions);

        _.merge(opt, self.chartData, self.chartoptions);
            self.chart = new Highcharts.Chart(opt);
            this.chartNotRender = "";
        } catch (e) {
            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }
        self.observer = self.calcService.getObservable().subscribe(() => {
            self.onModelChange();
        });

    }
    onModelChange(){
        let self= this;
        try{
            for (let i = 0; i < this.localSeriesLabelsArray.length; i++) {
                let localDataArray = [];
                let series = self.chart.series[i];
                for (let j = 0; j < this.localCategoryLabelsArray.length; j++) {

                    let localData = null;
                    let localRange = this.localRangeRefArray[(i * this.localCategoryLabelsArray.length) + j];
                    localData = this.calcService.getValueForYear(localRange, this.year, true);

                    try {
                        localData = numberFormatting.unformat(localData);
                    } catch (e) {
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
        } catch (e) {
            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }


    }

    processChartInputs() {
        let self = this;
        let localRangeRef = self.rangeref;
        let localCategoryLabels = self.categorylabels;
        let localSeriesLabels = self.serieslabels;

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
        if (self.chartData) {
            self.chartData.legend.align = this.legendalign;
            self.chartData.legend.verticalAlign = this.legendverticalalign;
            self.chartData.legend.layout = this.legendlayout;
        }
        if (this.charttitle != "") {
            self.chartData.title.text = this.textengineService.getText(this.charttitle);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['hideSeries'] && !changes['hideSeries'].isFirstChange() && changes['hideSeries'].currentValue) {
            let hiddenSeries: Array < number > = changes['hideSeries'].currentValue;
            // hiddenSeries.forEach((seriesIndex) => {
            //     if (this.chartData.series[seriesIndex]) {
            //         this.chartData.series[seriesIndex].hide();
            //     }
            // })
            this.chart.series.forEach((series, seriesIndex) => {
                if (hiddenSeries.indexOf(seriesIndex) !== -1) {
                    series.hide();
                } else {
                    series.show();
                }
            })
        }
        this.processChartInputs();
        this.onModelChange();
    }

    getChartAsImageURI() {
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
    getChart() {
        return this.chart;
    }
    getObserver() {
        return this.observer;
    }
    getLocalCategoryLabels() {
        return this.localCategoryLabelsArray;
    }

}
