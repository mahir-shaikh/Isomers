import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, OnChanges, EventEmitter} from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'stackedcolumn',
    template: '<div class="gauge-container stackedcolumn"></div>'
})

export class StackedColumnComponent implements OnDestroy, OnInit, OnChanges {
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
    @Input() legendalign = "center";
    @Input() legendverticalalign = "bottom";
    @Input() legendlayout = "horizontal";
    @Input() fromTitle: string;
    @Input() toTitle: string;
    @Input() totalName: string = "Total"
    @Input() totalValue: number=0;

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

        self.calcService.getApi().then((api) => {
            this.InitializeModel();
            self.observer = api.getObservable().subscribe(() => {
                this.onModelChange();
            });
            }
            
        );
    }

    ngOnChanges(){
        let self= this;
        if(this.chart){
            // this.InitializeModel();
            this.processComponentInputs();
                this.onModelChange();
        }
    }

    InitializeModel(){
        var opt = {}, self = this;
        this.totalValue = self.calcService.getValue("tlOutputGraphsLIntReadinessClosing");
        this.chartData = this.chartDefaults.getStackedColumnChartDefaults(this.numberformat,this.totalName,this.totalValue);

        this.processComponentInputs();

        self.chartData.chart.width = self.width;
        self.chartData.chart.height = self.height;
        self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];
        try {
            for (let i=0; i<self.localCategoryLabelsArray.length; i++) {
                if ((self.localCategoryLabelsArray[i].indexOf("tlInput") != -1) || (self.localCategoryLabelsArray[i].indexOf("tlOutput") != -1) ||  (self.localCategoryLabelsArray[i].indexOf("glo") != -1)) {
                    // console.log ("stackedcolumn: " + self.localCategoryLabelsArray[i] + ", " + this.calcService.getValue(self.localCategoryLabelsArray[i], true));
                    self.chartData.xAxis.categories[i] = self.calcService.getValue(self.localCategoryLabelsArray[i], true);
                } else {
                    self.chartData.xAxis.categories[i] = self.textengineService.getText(self.localCategoryLabelsArray[i]) || self.localCategoryLabelsArray[i];
                }
            }

            self.chartData.series = [];
            for (let i=0; i<self.localSeriesLabelsArray.length; i++) {
                let localSeriesName = "";
                if ((self.localSeriesLabelsArray[i].indexOf("tlInput") != -1) || (self.localSeriesLabelsArray[i].indexOf("tlOutput") != -1) || (self.localSeriesLabelsArray[i].indexOf("glo") != -1)) {
                    localSeriesName = self.calcService.getValue(self.localSeriesLabelsArray[i], true);
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
                    }
                    catch (e) {
                        try{
                            localData = localData.replace(/,/g, '');
                            localData = localData.replace('\$', '');
                            // localData = parseInt(localData);
                        }
                        catch (e) {
                            localData = 1;
                        }
                    }
                    console.log(localData);
                    localDataArray.push(localData);
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
    }catch(e) {
                // do nothing
                console.log("Could not render chart due to data issues")
            }
    }

    onModelChange(){
        let self = this;
        
       self.totalValue = self.calcService.getValue("tlOutputGraphsLIntReadinessClosing");
       console.log(self.totalValue);
       this.InitializeModel();
       //this.chartData = this.chartDefaults.getStackedColumnChartDefaults(this.numberformat,this.totalName,this.totalValue);
        for (let i=0; i<this.localSeriesLabelsArray.length; i++) {
            let localDataArray = [];
            let series = self.chart.series[i];
            for (let j=0; j<self.localCategoryLabelsArray.length; j++) {
                let localRange = self.localRangeRefArray[(i*self.localCategoryLabelsArray.length)+j];
                let localData = self.calcService.getValueForYear(localRange, self.year);
                console.log (localRange + ": " + self.year + ", " + localData);
                try {
                    localData = numberFormatting.unformat(localData);
                }
                catch (e) {
                    try{
                        localData = localData.replace(/,/g, '');
                        localData = localData.replace('\$', '');
                        // localData = parseInt(localData);
                    }
                    catch (e) {
                        localData = 1;
                    }
                }
                localDataArray.push(localData);
            }
            series.setData(localDataArray);
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

        if(this.fromTitle && this.toTitle){
            this.fromTitle = this.calcService.getValue(this.fromTitle,true);
            this.toTitle = this.calcService.getValue(this.toTitle,true);
            if(this.fromTitle && this.toTitle){
                this.chartData.title.text = this.fromTitle + " : " + this.toTitle;
            }else{
                this.chartData.title.text = null;
            }
        }else{
            this.chartData.title.text = null;
        }
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}