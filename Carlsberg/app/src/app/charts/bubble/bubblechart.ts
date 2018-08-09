import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';


@Component({
    selector: 'bubble',
    template: '<div class="gauge-container bubble"></div>'
})

export class BubbleChartComponent implements OnDestroy, OnInit {
    @Input() rangeRefX: string = "";
    @Input() rangeRefY: string = "";
    @Input() rangeRefZ: string = "";
    @Input() bubblesLabels: string = "";
    @Input() bubblesPerSeries: string = "";
    @Input() seriesLabels: string = "";
    @Input() year: string = "";
    @Input() chartOptions: any = "";
    @Input() min: number;
    @Input() max: number;
    @Input() numberFormatX: string = "";
    @Input() numberFormatY: string = "";
    @Input() numberFormatZ: string = "";
    @Input() xLabel: string = "";
    @Input() yLabel: string = "";
    @Input() zLabel: string = "";

    @Input() chartTitle: string = "";
    @Input() width: number;
    @Input() height: number;
    @Input() chartTitleOffsetY: number = -35;
    @Input() chartMarginTop: number = 0;

    public chart: any = null;
    private observer: EventEmitter < any > ;
    private gaugeVal: number = 0;
    private $elementRef: any = ElementRef;
    private el: ElementRef = null;
    private localRangeRefXArray = [];
    private localRangeRefYArray = [];
    private localRangeRefZArray = [];
    private localBubblesLabelsArray = [];
    private localBubblesPerSeriesArray = [];
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
        let self = this;
        // let chartDefaults: ChartDefaults = new ChartDefaults();

        this.chartData = this.chartDefaults.getBubbleChartDefaults(this.numberFormatX, this.numberFormatY, this.numberFormatZ, this.xLabel, this.yLabel, this.zLabel);
        self.chartData.chart.width = self.width;
        self.chartData.chart.height = self.height;
        self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];

        self.initializeChart();
        self.observer = self.calcService.getObservable().subscribe(() => {
            self.onModelChange();
        });

    }

    initializeChart() {
        let self = this,
            opt = {};

        this.processChartInputs();
        if (self.chartData) {
            self.chartData.series[0].name = this.textengineService.getText(this.chartTitle);
            self.chartData.series[0].data = [];
        }
        let k = 0;
        try {
            for (let j = 0; j < self.localSeriesLabelsArray.length; j++) {

                for (let i = 0; i < self.localBubblesPerSeriesArray[j] && k < self.localBubblesLabelsArray.length; i++) {

                    let localSeriesName = "";

                    if ((self.localSeriesLabelsArray[j].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[j].indexOf("tlOutput") != -1)) {
                        localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[j]);
                    } else {
                        localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[j]);
                    }


                    let localBubbleLabel = "";

                    if ((self.localBubblesLabelsArray[k].indexOf("tlInput") != -1) || (self.localBubblesLabelsArray[k].indexOf("tlOutput") != -1)) {
                        localBubbleLabel = self.calcService.getValue(self.localBubblesLabelsArray[k], true);
                    } else {
                        localBubbleLabel = self.textengineService.getText(self.localBubblesLabelsArray[k]);
                    }

                    let localDataX = this.calcService.getValueForYear(self.localRangeRefXArray[k], self.year);
                    localDataX = localDataX.toString();

                    let localDataY = this.calcService.getValueForYear(self.localRangeRefYArray[k], self.year);
                    localDataY = localDataY.toString();

                    let localDataZ = this.calcService.getValueForYear(self.localRangeRefZArray[k], self.year);
                    localDataZ = localDataZ.toString();


                    try {
                        localDataX = numberFormatting.unformat(localDataX);
                        localDataY = numberFormatting.unformat(localDataY);
                        localDataZ = numberFormatting.unformat(localDataZ);

                        if(localDataX === ""){
                            localDataX = 0
                        }
                        if(localDataY === ""){
                            localDataY = 0
                        }
                        if(localDataZ === ""){
                            localDataZ = 0
                        }


                    } catch (e) {
                        debugger
                        if (localDataX != undefined && localDataX != null) {

                            localDataX = localDataX.replace(/,/g, '');
                            localDataX = localDataX.replace('\$', '');
                            localDataX = parseInt(localDataX);

                            localDataY = localDataY.replace(/,/g, '');
                            localDataY = localDataY.replace('\$', '');
                            localDataY = parseInt(localDataY);

                            localDataZ = localDataZ.replace(/,/g, '');
                            localDataZ = localDataZ.replace('\$', '');
                            localDataZ = parseInt(localDataZ);



                        } else {
                            localDataX = 1;
                            localDataY = 1;
                            localDataZ = 1;
                        }

                        //localDataArray.push(parseInt(localData));
                    }



                    let localData = { x: "", y: "", z: "", name: "" };
                    localData.x = localDataX;
                    localData.y = localDataY;
                    localData.z = localDataZ;
                    localData.name = localBubbleLabel;

                    if (!self.chartData.series[j]) {
                        self.chartData.series[j] = {};
                    }

                    if (!self.chartData.series[j].data) {
                        self.chartData.series[j].data = [];
                    }

                    if (!self.chartData.series[j].name) {
                        self.chartData.series[j].name = [];
                    }

                    self.chartData.series[j].name = localSeriesName;

                    self.chartData.series[j].data.push(
                        localData
                    )

                    k++;
                }
            }

            if (self.chartOptions !== "" && typeof self.chartOptions != "object") {
                self.chartOptions = JSON.parse(self.chartOptions);
            }

            _.merge(opt, self.chartData, self.chartOptions);
            // _.merge(opt, self.chartData);

            self.chart = new Highcharts.Chart(opt);
            this.chartNotRender = "";
        } catch (e) {
            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }
    }

    onModelChange() {
        let self = this,
            k=0;
        this.processChartInputs();

        try {
            for (let j = 0; j < self.localSeriesLabelsArray.length; j++) {

                for (let i = 0; i < self.localBubblesPerSeriesArray[j] && k < self.localBubblesLabelsArray.length; i++) {

                    let localDataX = this.calcService.getValueForYear(self.localRangeRefXArray[k], self.year);
                    localDataX = localDataX.toString();

                    let localDataY = this.calcService.getValueForYear(self.localRangeRefYArray[k], self.year);
                    localDataY = localDataY.toString();

                    let localDataZ = this.calcService.getValueForYear(self.localRangeRefZArray[k], self.year);
                    localDataZ = localDataZ.toString();


                    try {
                        localDataX = numberFormatting.unformat(localDataX);
                        localDataY = numberFormatting.unformat(localDataY);
                        localDataZ = numberFormatting.unformat(localDataZ);


                    } catch (e) {
                        debugger
                        if (localDataX != undefined && localDataX != null) {

                            localDataX = localDataX.replace(/,/g, '');
                            localDataX = localDataX.replace('\$', '');
                            localDataX = parseInt(localDataX);

                            localDataY = localDataY.replace(/,/g, '');
                            localDataY = localDataY.replace('\$', '');
                            localDataY = parseInt(localDataY);

                            localDataZ = localDataZ.replace(/,/g, '');
                            localDataZ = localDataZ.replace('\$', '');
                            localDataZ = parseInt(localDataZ);



                        } else {
                            localDataX = 1;
                            localDataY = 1;
                            localDataZ = 1;
                        }

                        //localDataArray.push(parseInt(localData));
                    }



                    let localData = { x: "", y: "", z: "", name: "" };
                    localData.x = localDataX;
                    localData.y = localDataY;
                    localData.z = localDataZ;

                    self.chart.series[j].data.update(
                        localData
                    )

                    k++;
                }
            }
            this.chartNotRender = "";
        }catch(e){
            this.chartNotRender = "couldn't render chart";
            console.log("couldn't render chart");
        }
    }

    processChartInputs() {
        let self = this;
        let localRangeRefX = self.rangeRefX.toString();
        let localRangeRefY = self.rangeRefY.toString();
        let localRangeRefZ = self.rangeRefZ.toString();
        let localBubblesLabels = self.bubblesLabels.toString();
        let localBubblesPerSeries = self.bubblesPerSeries.toString();

        let localSeriesLabels = self.seriesLabels.toString();

        localRangeRefX = localRangeRefX.replace(/\[|\]/g, '');
        localRangeRefX = localRangeRefX.replace(/ /g, '');
        this.localRangeRefXArray = localRangeRefX.split(",");

        localRangeRefY = localRangeRefY.replace(/\[|\]/g, '');
        localRangeRefY = localRangeRefY.replace(/ /g, '');
        this.localRangeRefYArray = localRangeRefY.split(",");

        localRangeRefZ = localRangeRefZ.replace(/\[|\]/g, '');
        localRangeRefZ = localRangeRefZ.replace(/ /g, '');
        this.localRangeRefZArray = localRangeRefZ.split(",");

        localBubblesLabels = localBubblesLabels.replace(/\[|\]/g, '');
        localBubblesLabels = localBubblesLabels.replace(/ /g, '');
        this.localBubblesLabelsArray = localBubblesLabels.split(",");

        localBubblesPerSeries = localBubblesPerSeries.replace(/\[|\]/g, '');
        localBubblesPerSeries = localBubblesPerSeries.replace(/ /g, '');
        this.localBubblesPerSeriesArray = localBubblesPerSeries.split(",");

        localSeriesLabels = localSeriesLabels.replace(/\[|\]/g, '');
        localSeriesLabels = localSeriesLabels.replace(/ /g, '');
        this.localSeriesLabelsArray = localSeriesLabels.split(",");
    }

    getChartAsImageURI() {
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }

    ngOnChanges() {
        if (this.chartData) {
            this.onModelChange();
        }
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
