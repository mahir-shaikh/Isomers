import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'donut',
    template: '<div class="gauge-container donut"></div>'
})

export class DonutComponent implements OnDestroy, OnInit {
    @Input() rangeRef: string = "";
    @Input() seriesLabels: string = "";
    @Input() year: string = "";
    @Input() chartOptions: any = "";
    @Input() min: number;
    @Input() max: number;
    @Input() numberFormat: string = "";
    @Input() chartTitle: string = "";
    @Input() width: number;
    @Input() height: number;
    @Input() chartTitleOffsetY: number = -35;
    @Input() chartMarginTop: number = 0;

    private chart: any = null;
    private observer: EventEmitter < any > ;
    private gaugeVal: number = 0;
    private $elementRef: any = ElementRef;
    private el: ElementRef = null;
    private localRangeRefArray = [];
    private localSeriesLabelsArray = [];

    private chartData: any;
    public chartNotRender: any;


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
        if (this.observer) {
            this.observer.unsubscribe();
        }
    }

    ngOnInit() {
        var opt = {},
            self = this;
        // let chartDefaults: ChartDefaults = new ChartDefaults();

        this.chartData = this.chartDefaults.getDonutDefaults(this.numberFormat);
        this.processChartInputs();

        this.initializeModel();
        self.observer = self.calcService.getObservable().subscribe(() => {
            this.updateChartData();

        });

    }

    ngOnChanges(){
        if(this.chart){
            this.processChartInputs();
            this.updateChartData();
        }
    }

    initializeModel() {
        var opt = {},
            self = this;
        this.chartData = this.chartDefaults.getDonutDefaults(this.numberFormat);
        this.processChartInputs();
        self.chartData.chart.width = self.width;
        self.chartData.chart.height = self.height;
        self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];

        self.chartData.series[0].name = this.textengineService.getText(this.chartTitle);
        self.chartData.series[0].data = [];
        try {
            for (let i = 0; i < this.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                // localSeriesName = this.textengineService.getText(this.localSeriesLabelsArray[i]);

                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                    localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
                } else {
                    localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]);
                }

                let localData = this.calcService.getValueForYear(self.localRangeRefArray[i], self.year);
                localData = localData.toString();
                localData = localData.replace(/,/g, '');
                localData = localData.replace('\$', '');
                localData = localData.replace('%', '');
                localData = parseInt(localData);

                self.chartData.series[0].data.push(
                    [localSeriesName, localData]
                )
            }

            if (self.chartOptions !== "") {
                //self.chartOptions = JSON.parse(self.chartOptions);
            }

            _.merge(opt, self.chartData, self.chartOptions);
 if(self.chart==null){
                self.chart = new Highcharts.Chart(opt);
            }else{
                self.chart.update(opt);
            }
            this.chartNotRender = "";
        } catch (e) {
            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }
    }

    updateChartData(){
        let self = this;
        // self.chartData.series[0].data = [];
        for (let i = 0; i < this.localSeriesLabelsArray.length; i++) {
            let localSeriesName = "";
            // localSeriesName = this.textengineService.getText(this.localSeriesLabelsArray[i]);

            if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i]);
            } else {
                localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]);
            }

            let localData = this.calcService.getValueForYear(self.localRangeRefArray[i], self.year);
            localData = localData.toString();
            localData = localData.replace(/,/g, '');
            localData = localData.replace('\$', '');
            localData = localData.replace('%', '');
            localData = parseInt(localData);

            // self.chartData.series[0].data.push(
            //     [localSeriesName, localData]
            // )
            let point = self.chart.series[0].points[i];
                    point.update(parseInt(localData));
        }
        // this.chart.update({"series" : [{
        //         name: '',
        //         colorByPoint: true,
        //         data: self.chartData.series[0].data
        //     }]});
    }

    processChartInputs() {
        let self = this;
        let localRangeRef = self.rangeRef.toString();
        let localSeriesLabels = self.seriesLabels.toString();

        localRangeRef = localRangeRef.replace(/\[|\]/g, '');
        localRangeRef = localRangeRef.replace(/ /g, '');
        this.localRangeRefArray = localRangeRef.split(",");

        localSeriesLabels = localSeriesLabels.replace(/\[|\]/g, '');
        localSeriesLabels = localSeriesLabels.replace(/ /g, '');
        this.localSeriesLabelsArray = localSeriesLabels.split(",");

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
    getLocalSeriesLabels() {
        return this.localSeriesLabelsArray;
    }
}
