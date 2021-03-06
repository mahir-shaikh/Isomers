import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'piechart',
    template: '<div class="gauge-container piechart"></div>'
})

export class PieChartComponent implements OnDestroy, OnInit {
    @Input() rangeRef:string = "";
    @Input() categoryLabels:string = "";
    @Input() seriesLabels:string = "";
    @Input() year:string = "";
    @Input() chartOptions:any = "";
    @Input() min:number;
    @Input() max:number;
    @Input() numberFormat:string = "";
    @Input() chartTitle:string = "";
    @Input() width:number;
    @Input() height:number;
    @Input() chartTitleOffsetY:number = -35;
    @Input() chartMarginTop:number = 0;

    private chart:any = null;
    private observer: EventEmitter<any>;
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
        // let chartDefaults: ChartDefaults = new ChartDefaults();

        this.chartData = this.chartDefaults.getPieChartDefaults();
        this.processChartInputs();
        self.calcService.getApi().then((api) => {
            self.chartData.chart.width = self.width;
            self.chartData.chart.height = self.height;
            self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];

            self.chartData.series[0].name = this.textengineService.getText(this.chartTitle);
            self.chartData.series[0].data = [];

            for (let i=0; i<this.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                // localSeriesName = this.textengineService.getText(this.localSeriesLabelsArray[i]);

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
                
                self.chartData.series[0].data.push ({
                    name: localSeriesName,
                    y: localData,
                    borderWidth: 0
                })
            }

            if (self.chartOptions !== "")
                self.chartOptions = JSON.parse(self.chartOptions);

            _.merge(opt, self.chartData, self.chartOptions);

            self.chart = new Highcharts.Chart(opt);
            self.observer = api.getObservable().subscribe(() => {
                for (let i=0; i<this.localSeriesLabelsArray.length; i++) {
                    let localData = this.calcService.getValueForYear(this.localRangeRefArray[i], this.year);
                    let series = self.chart.series[0];
                    localData = localData.replace(/,/g,'');
                    localData = localData.replace('\$','');
                    localData = localData.replace('%','');
                    localData = parseInt(localData);

                    let point = series.points[i];
                    point.update(parseInt(localData));
                }
                
            });
        });
    }

    processChartInputs() {
        let self = this;
        let localRangeRef = self.rangeRef;
        let localCategoryLabels = self.categoryLabels;
        let localSeriesLabels = self.seriesLabels;

        localRangeRef = localRangeRef.replace(/\[|\]/g, '');
        localRangeRef = localRangeRef.replace(/ /g, '');
        this.localRangeRefArray = localRangeRef.split(",");

        localCategoryLabels = localCategoryLabels.replace(/\[|\]/g, '');
        localCategoryLabels = localCategoryLabels.replace(/ /g, '');
        this.localCategoryLabelsArray = localCategoryLabels.split(",");

        localSeriesLabels = localSeriesLabels.replace(/\[|\]/g, '');
        localSeriesLabels = localSeriesLabels.replace(/ /g, '');
        this.localSeriesLabelsArray = localSeriesLabels.split(",");

    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}