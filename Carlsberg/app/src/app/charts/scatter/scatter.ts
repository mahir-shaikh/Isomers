import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'scatter',
    template: '<div class="gauge-container scatter"></div>'
})

export class ScatterComponent implements OnDestroy, OnInit {
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
    @Input() dataPerSeries:number;

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

        this.chartData = this.chartDefaults.getScatterChartDefaults(this.numberformat);

        this.processComponentInputs();

        self.initializeModel();
        self.observer = self.calcService.getObservable().subscribe(() => {
            self.onModelChange();

        });
    }

    onModelChange(){
        this.updateValues();
    }

    initializeModel(){
        var opt = {}, self = this;

        this.chartData = this.chartDefaults.getScatterChartDefaults(this.numberformat);

        this.processComponentInputs();
            self.chartData.chart.width = self.width;
            self.chartData.chart.height = self.height;
            self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];
            try {

                self.chartData.series = [];
                for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                        let localCategoryName = "";
                        if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                            localCategoryName = self.calcService.getValue(self.localCategoryLabelsArray[i], true);
                        } else {
                            localCategoryName = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                        }
                        self.chartData.xAxis.categories[i] = localCategoryName;
                }
                for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                    let localSeriesName = "";
                    if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                        localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i], true);
                    } else {
                        localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]) || self.localSeriesLabelsArray[i];
                    }
                    let localDataArray = [];
                    for (let j=0; j<self.dataPerSeries; j++) {
                        let localRange = self.localRangeRefArray[(i*self.dataPerSeries)+j];
                        let localData = self.calcService.getValueForYear(localRange, self.year);
                        let localDataArrayShort = [];
                        // console.log (localRange + ": " + self.year + ", " + localData);
                        let localCategoryName = "";
                        if ((self.localCategoryLabelsArray[j].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[j].indexOf("tlOutput") != -1)) {
                            localCategoryName = self.calcService.getValue(self.localCategoryLabelsArray[j], true);
                        } else {
                            localCategoryName = self.textengineService.getText(self.localCategoryLabelsArray[j]) || self.localCategoryLabelsArray[j];
                        }
                        try {
                            localData = numberFormatting.unformat(localData);
                                localDataArrayShort.push(localCategoryName);
                            localDataArrayShort.push(localData);
                            localDataArray.push(localDataArrayShort);
                        }
                        catch (e) {
                            if (localData != undefined && localData != null) {
                                localData = localData.replace(/,/g, '');
                                localData = localData.replace('\$', '');
                                localDataArrayShort.push(localCategoryName);
                                localDataArrayShort.push(localData);
                            } else {
                                localData = 1;
                                localDataArrayShort.push(localCategoryName);
                                localDataArrayShort.push(localData);
                            }

                            localDataArray.push(localDataArrayShort);
                        }
                    }
                    self.chartData.series.push ({
                        name: localSeriesName,
                        data: localDataArray,
                        color: self.localSeriesColorsArray[i],
                        borderWidth: 0
                    })
                }

                if (self.chartoptions !== "" && typeof(self.chartoptions) != "object") {
                    self.chartoptions = JSON.parse(self.chartoptions);
                }

                _.merge(opt, self.chartData, self.chartoptions);
                // console.log (self.chartData);

                self.chart = new Highcharts.Chart(opt);
                this.chartNotRender = "";
            }catch(e) {
                // do nothing
                this.chartNotRender = "Could not render chart due to data issues";
                console.log("Could not render chart due to data issues")
            }

    }

    updateValues(){
        let self = this;
        self.chartData.series = [];
        try{
            let localCategoryName = "",
                localCategoryArray = [];
            for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                    if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1)) {
                        localCategoryName = self.calcService.getValue(self.localCategoryLabelsArray[i], true);
                    } else {
                        localCategoryName = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                    }
                    localCategoryArray.push(localCategoryName);
            }
            this.chart.xAxis[0].update(localCategoryArray);
            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1)) {
                    localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i], true);
                } else {
                    localSeriesName = self.textengineService.getText(self.localSeriesLabelsArray[i]) || self.localSeriesLabelsArray[i];
                }
                let localDataArray = [];
                for (let j=0; j<self.dataPerSeries; j++) {
                    let localRange = self.localRangeRefArray[(i*self.dataPerSeries)+j];
                    let localData = self.calcService.getValueForYear(localRange, self.year);
                    let localDataArrayShort = [];
                    // console.log (localRange + ": " + self.year + ", " + localData);
                    let localCategoryName = "";
                    if ((self.localCategoryLabelsArray[j].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[j].indexOf("tlOutput") != -1)) {
                        localCategoryName = self.calcService.getValue(self.localCategoryLabelsArray[j], true);
                    } else {
                        localCategoryName = self.textengineService.getText(self.localCategoryLabelsArray[j]) || self.localCategoryLabelsArray[j];
                    }
                    try {
                        localData = numberFormatting.unformat(localData);
                        localDataArrayShort.push(localCategoryName);
                        localDataArrayShort.push(localData);
                        localDataArray.push(localDataArrayShort);
                    }
                    catch (e) {
                        if (localData != undefined && localData != null) {
                            localData = localData.replace(/,/g, '');
                            localData = localData.replace('\$', '');
                            localDataArrayShort.push(localCategoryName);
                            localDataArrayShort.push(localData);
                        } else {
                            localData = 1;
                            localDataArrayShort.push(localCategoryName);
                            localDataArrayShort.push(localData);
                        }

                        localDataArray.push(localDataArrayShort);
                    }
                }
                self.chart.series[0].data[i].update ({
                    name: localSeriesName,
                    data: localDataArray,
                    color: self.localSeriesColorsArray[i],
                    borderWidth: 0
                })
            }
            this.chartNotRender = "";
        }catch(e) {
            // do nothing
            this.chartNotRender = "Could not render chart due to data issues";
            console.log("Could not render chart due to data issues")
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
            this.updateValues();
        }
    }
}