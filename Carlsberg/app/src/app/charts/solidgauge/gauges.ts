import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges } from '@angular/core';
import { CalcService } from '../../calcmodule';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';

@Component({
    selector: 'solid-gauge',
    template: '<div class="gauge-container solidgauge" [class.apply-height]="applyHeight"></div>',
    styleUrls:['./gauge.styl']
})

export class GaugeComponent implements OnDestroy, OnInit, OnChanges{
    @Input() rangeRef:string = "";
    @Input() chartOptions:any = "";
    @Input() min:number;
    @Input() max:number;
    @Input() numberFormat:string = "";
    @Input() chartTitle:string = "";
    @Input() width:number;
    @Input() height:number;
    @Input() chartTitleOffsetY:number = -35;
    @Input() chartMarginTop:number = 0;
    @Input() applyHeight: boolean = false;

    private chart:any = null;
    private observer: EventEmitter<any>;
    private gaugeVal:number = 0;
    private $elementRef:any = ElementRef;
    private el:ElementRef = null;
    private chartData:any;
    private chartNotRender: string;

    constructor(private calcService: CalcService, el: ElementRef, private chartDefaults: ChartDefaults) {
        let self = this;
        self.el = el;
    }

    updateChart(value) {
        let self = this;
        let series = self.chart.series[0];
        let point = series.points[0];
        point.update(self.gaugeVal);
    }

    ngOnChanges(){
        if(this.chart){
        this.onModelChange();
       }
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
        let opt = {}, self = this;

        self.chartData = this.chartDefaults.getSolidGaugeDefaults();

        // self.calcService.getApi().then((api) => {
            // api = response[0];
            try{
                self.gaugeVal = this.calcService.getValue(self.rangeRef);
                try{
                    self.gaugeVal = numberFormatting.unformat(self.gaugeVal);
                }
                catch(e){
                    console.log("can't format");
                }            self.chartData.chart.width = self.width;
                self.chartData.chart.height = self.height;
                self.chartData.chart.renderTo = self.el.nativeElement.childNodes[0];
                // self.chartData.title = self.chartTitle || "Test";
                self.chartData.series = [{
                    name: 'Shareholder Value',
                    data: [self.gaugeVal]
                }];
                self.chartData.yAxis.min = self.min;
                self.chartData.yAxis.max = self.max;
                self.chartData.yAxis.title = {
                    text: self.chartTitle,
                    y: -40
                };
                // plot options
                self.chartData.plotOptions.solidgauge.dataLabels.formatter = function() {
                    let value =  numberFormatting.format(this.y, self.numberFormat);
                    if(this.y >= 0){
                        return "<span>"+value+"</span>";
                    }else{
                        return "<span style='color:red; background: #fff; font-size: 10px; padding: 4px; border-radius: 50%; height: 25px; width: 25px; display: block;'>"+value+"</span>";
                    }
                };
                if (self.chartOptions !== "")
                    self.chartOptions = JSON.parse(self.chartOptions);

                _.merge(opt, self.chartData, self.chartOptions);

                self.chart = new Highcharts.Chart(opt);
                this.chartNotRender = "";
            }catch(e) {
                // do nothing
                this.chartNotRender = "Could not render chart due to data issues";
                console.log("Could not render chart due to data issues")
            }
            self.observer = this.calcService.getObservable().subscribe(() => {
                self.onModelChange();
            });
        // });
    }

    onModelChange(){
        let self = this;
        self.gaugeVal = self.calcService.getValue(self.rangeRef);
        try{
            self.gaugeVal = numberFormatting.unformat(self.gaugeVal);
            self.updateChart(self.gaugeVal);
        }catch(e){
            console.log("can't format");
        }
    }

    getChartAsImageURI(){
        return this.chartDefaults.getChartAsImageURI(this.chart);
    }
}