import { Component, Input, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';
import { CHART_TYPE } from '../../charts';

@Component({
    selector: 'im-chart',
    template: '<div class="chart-container"></div>'
})

export class GenericChartComponent implements OnDestroy, OnInit {
    @Input() rangeRef: string = "";
    @Input() xAxisOptons: any;
    @Input() yAxisOptions: any;
    @Input() yAxisTitle: string = "";
    @Input() year: string = "";
    @Input() seriesOptions: Array<any>;
    @Input() categorylabels: string;
    @Input() serieslabels: string = "";
    @Input() min: number;
    @Input() max: number;
    @Input() chartTitle: string = "";
    @Input() width: number;
    @Input() height: number;
    @Input() numberFormat: string = "";
    @Input() type: string; // chart type
    @Input() chartoptions: Object;
    @Input() plotOption: string = "";
    @Input() categoryFormat:string = "";

    private chart: any;
    private observer: EventEmitter<any>;
    private chartData: any = {
        xAxis: {
            categories: []
        },
        yAxis: {},
        series: []
    };
    private localRangeRefArray = [];
    private localCategoryLabelsArray = [];
    private localSeriesLabelsArray = [];
    private localSeriesColorsArray = [];
    private series = [];

    constructor(private calcService: CalcService,private el: ElementRef, private chartDefaults: ChartDefaults, private textEngineService: TextEngineService) {
        // let this = this;
    }

    updateChart(value) {
        
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
        if (!this.type) {
            new Error("Chart type cannot be null or empty");
            return;
        }

        let chartDefaults = this.chartDefaults.getDefaultsFor(this.type, this.numberFormat),
            plotOptions = this.chartDefaults.getPlotOptions(this.plotOption, this.numberFormat),
            numberFormat = this.numberFormat,
            categoryFormat = this.categoryFormat,
            opt = {
                chart: {
                    renderTo: this.el.nativeElement.childNodes[0]
                }
            };
        _.merge(opt, plotOptions);
        opt['title'] = this.chartTitle;
        this.processComponentInputs();
        this.processCategoryLabels();
        if (this.type === CHART_TYPE.COMBINATION) {
            this.processSeriesOptions();
            _.merge(opt,{
                yAxis: {
                    title: {
                        text:this.yAxisTitle
                    },
                    labels: {
                        formatter: function() {
                            if (numberFormat) {
                                return numberFormatting.format(this.value, numberFormat);
                            }
                            else {
                                return this.value;
                            }
                        }
                    }
                },
                xAxis: {
                    labels: {
                        formatter: function() {
                            if (categoryFormat) {
                                return numberFormatting.format(this.value, categoryFormat);
                            }
                            else {
                                return this.value;
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormatter: function() {
                        if (numberFormat) {
                            return this.series.name + ": " + numberFormatting.format(this.y, numberFormat);
                        }
                        else {
                            return this.y;
                        }
                    }
                }}
            );
        }
        else {
        // process series data
            this.processSeriesLabels();
            this.processSeriesData(this.fetchDataFromModel());
        }
        _.merge(opt, chartDefaults, this.chartData, this.chartoptions);
        this.chart = Highcharts.chart(opt);

        this.observer = this.calcService.getObservable().subscribe(() => {
            let arrSeriesData = this.fetchDataFromModel();

            arrSeriesData.forEach((data, dataIndex) => {
                let series = this.chart.series[dataIndex];
                series.setData(data); // update series data
            });
        });
    }

    processComponentInputs() {
        let localRangeRef = this.rangeRef,
            localCategoryLabels = this.categorylabels,
            localSeriesLabels = this.serieslabels;

        if (localRangeRef) {
            localRangeRef = localRangeRef.replace(/\[|\]/g, '');
            localRangeRef = localRangeRef.replace(/ /g, '');
            this.localRangeRefArray = localRangeRef.split(",");
        }
        else {
            new Error("Local Rangeref cannot be empty or null");
        }

        if (localCategoryLabels && localCategoryLabels != undefined) {
            localCategoryLabels = localCategoryLabels.toString();
            localCategoryLabels = localCategoryLabels.replace(/\[|\]/g, '');
            localCategoryLabels = localCategoryLabels.replace(/ /g, '');
            this.localCategoryLabelsArray = localCategoryLabels.split(",");
        }

        if (localSeriesLabels && localSeriesLabels != undefined) {
            localSeriesLabels = localSeriesLabels.replace(/\[|\]/g, '');
            localSeriesLabels = localSeriesLabels.replace(/ /g, '');
            this.localSeriesLabelsArray = localSeriesLabels.split(",");
        }

        if (this.min != undefined) {
            this.chartData.yAxis.min = this.min;
        }
        if (this.max != undefined) {
            this.chartData.yAxis.max = this.max;
        }

        // if (this.chartoptions && this.chartoptions !== "") {
        //     this.chartoptions = JSON.parse(this.chartoptions);
        // }
    }

    processSeriesLabels() {
        for (let i = 0; i < this.localSeriesLabelsArray.length; i++) {
            let localSeriesName = "";
            if ((this.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (this.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                localSeriesName = this.calcService.getValue(this.localSeriesLabelsArray[i]);
            } else {
                localSeriesName = this.textEngineService.getText(this.localSeriesLabelsArray[i]) || this.localSeriesLabelsArray[i];
            }
            this.series.push({
                name: localSeriesName
            });
        }
    }

    processCategoryLabels() {
        for (let i = 0; i < this.localCategoryLabelsArray.length; i++) {
            if ((this.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (this.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                this.chartData.xAxis.categories[i] = this.calcService.getValue(this.localCategoryLabelsArray[i]);
            } else {
                this.chartData.xAxis.categories[i] = this.textEngineService.getText(this.localCategoryLabelsArray[i]) || this.localCategoryLabelsArray[i];
            }
        }
    }

    fetchDataFromModel(dataRefs?:Array<string>): Array<any> {
        let arrSeriesData = [];
        for (let i = 0; i < this.localSeriesLabelsArray.length; i++) {
            
            let localDataArray = [];
            for (let j = 0; j < this.localCategoryLabelsArray.length; j++) {
                let localRange = this.localRangeRefArray[(i * this.localCategoryLabelsArray.length) + j];
                let localData = this.calcService.getValueForYear(localRange, this.year, true);
                try {
                    localData = numberFormatting.unformat(localData);
                    localDataArray.push(localData);
                }
                catch (e) {
                    if (localData != undefined) {
                        localData = localData.replace(/,/g, '');
                        localData = localData.replace('\$', '');
                        localData = parseInt(localData);
                    } else {
                        localData = 1;
                    }

                    localDataArray.push(parseInt(localData));
                }
            }
            arrSeriesData.push({data: localDataArray});
        }
        return arrSeriesData;
    }

    processSeriesData(arrSeriesData) {
        this.series.forEach((series, seriesIndex, seriesArr) => {
            this.chartData.series.push({
                name: series.name,
                data: arrSeriesData[seriesIndex].data,
                borderWidth: 0
            })
        });
    }

    processSeriesOptions() {
        if (!this.seriesOptions) {
            new Error("Series options cannot be null or undefined for combination chart!");
            return;
        }
        let seriesOptions: Array<Series>;
        try {
            seriesOptions = this.seriesOptions;
        }
        catch(e) {
            new Error("Cannot convert series options to JSON "+ e);
            return;
        }

        seriesOptions.forEach((series: Series, seriesIndex) => {
            let _series = new Series();
            _series.type = series.type;
            // _series.name = 
            if ((series.name.indexOf("tlInput") != -1) || (series.name.indexOf("tlOutput") != -1)) {
                    _series.name = this.calcService.getValue(series.name);
            } else {
                _series.name = this.textEngineService.getText(series.name) || series.name;
            }
            _series.data = this.fetchSeriesData(series.data);

            this.chartData.series.push(_series);
        });
    }

    fetchSeriesData(dataRefs:Array<string>): Array<Number> {
        let data:Array<Number> = [];
        dataRefs.forEach((ref) => {
            let value = this.calcService.getValue(ref),
                unformattedVal = numberFormatting.unformat(value);

            data.push(unformattedVal);
        });

        return data;
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}

class Series {
    type: string;
    name: string;
    data: Array<any>;
}