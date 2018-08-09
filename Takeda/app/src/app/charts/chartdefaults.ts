import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import * as numberFormatting from '../../libs/jsCalc/numberFormatting';
import { CHART_TYPE } from '../charts';

@Injectable()
export class ChartDefaults {

    getDefaults():any {
        Highcharts.setOptions({
            lang: {
                thousandsSep: ","
            }
        });

        let defaults = {
            chart: {
                style: '{"fontFamily":"\"Open Sans\", sans-serif","fontSize":"12px"}',
                backgroundColor: '#F7F7F7'
            },
            exporting:{
                enabled:false
            },
            colors: ['#47A4AD', '#E5433C', '#595959', '#BFBFBF', '#96A145', '#000000', '#928ef1', '#bcf08d', '#a65c34', '#ff4261', '#45dbcb', '#69261b', '#ff5050'],
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    style: { color: '#000' }
                },
                tickPosition: 'inside',
                gridLineColor: 'transparent',
                tickWidth: 1,
                lineWidth: 1
            },
            yAxis: {
                labels: {
                    style: { color: '#000' }
                },
                tickPosition: 'inside',
                gridLineColor: 'transparent',
                tickWidth: 1,
                lineWidth: 1
            }
        }
        return defaults;
    }

    getDataLabelDefaultStyle(): any {
        return {
            style: '{"color": "contrast", "fontSize": "10px", "fontWeight": "bold", "textShadow": "none" }'
        };
    }


    getSolidGaugeDefaults() {
        let chartData = {
            chart: {
                type: 'solidgauge'
            },
            title: null,
            pane: {
                center: ['50%', '85%'],
                // size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            // the value axis
            yAxis: {
                // stops: [
                //     [0.1, '#55BF3B'], // green
                //     [0.5, '#DDDF0D'], // yellow
                //     [0.9, '#DF5353'] // red
                // ],
                lineWidth: 0,
                minorTickInterval: null,
                tickPixelInterval: 400,
                tickWidth: 0,
                labels: {
                    enabled: false
                }
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true,
                        style: this.getDataLabelDefaultStyle()
                    }
                }
            }
        };

        return _.merge({}, this.getDefaults(), chartData);
    }

    getBasicBarChartDefaults(numberFormat?:string) {
        let chartData = {
            chart: {
                type: 'bar'
            },
            title: null,
            xAxis: {
                categories: [],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify',
                    formatter: function(){
                        if (numberFormat) {
                            return numberFormatting.format(this.value, numberFormat);
                        }
                        else {
                            return this.value;
                        }
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 0,
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5,
                itemStyle: {
                    color: '#fff',
                    fontWeight: 'normal'
                },
                itemHoverStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormatter: function() {
                    if (numberFormat) {
                        return numberFormatting.format(this.y, numberFormat);
                    }
                    else {
                        return this.y;
                    }
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        style: this.getDataLabelDefaultStyle(),
                        formatter: function() {
                            if (numberFormat) {
                                return numberFormatting.format(this.y, numberFormat);
                            }
                            else {
                                return this.y;
                            }
                        }
                    }
                }
            },
            series: []
        };


        return _.merge({}, this.getDefaults(), chartData);
    }

    getStackedColumnChartDefaults(numberFormat?:string) {
        let chartData = {
            chart: {
                type: 'column'
            },
            title: null,
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    style: { color: '#666' },
                    formatter: function() {
                        if (numberFormat) {
                            return numberFormatting.format(this.value, numberFormat);
                        }
                        else {
                            return this.value;
                        }
                    }
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: 'gray'
                    }
                },
                plotLines: [{
                    color: '#666666',
                    width: 2,
                    value: 0
                }]
            },
            legend: {
                layout: '',
                align: '',
                verticalAlign: '',
                x: -10,
                y: 0,
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5,
                symbolHeight: 15,
                itemMarginTop: 10,
                itemStyle: {
                    color: '#666',
                    fontWeight: 'normal'
                },
                itemHoverStyle: {
                    color: '#666'
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                pointFormatter: function() {
                    if (numberFormat) {
                        return this.series.name + ": " + numberFormatting.format(this.y, numberFormat) + "<br />" + "Total: " + numberFormatting.format(this.total, numberFormat);
                    }
                    else {
                        return this.series.name+ ": " + this.y + "<br/>Total: " + this.stackTotal;
                    }
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        // format: '{y:0.1f}',
                        formatter: function() {
                            if (numberFormat) {
                                return numberFormatting.format(this.y, numberFormat);
                            }
                            else {
                                return this.y;
                            }
                        },
                        color: 'black',
                        style: this.getDataLabelDefaultStyle()
                    }
                }
            },
            series: []
        };
        return _.merge({}, this.getDefaults(), chartData);
    }

    getBasicColumnChartDefaults(numberFormat?:string,categoryFormat?:string) {
        let chartData = {
            chart: {
                type: 'column'
            },
            title: null,
            xAxis: {
                categories: [],
                labels : {
                    formatter : function(){
                        if (categoryFormat) {
                            return numberFormatting.format(this.value, categoryFormat);
                        }
                        else {
                            return this.value;
                        }
                    }
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    style: { color: '#666' },
                    formatter: function() {
                        if (numberFormat) {
                            return numberFormatting.format(this.value, numberFormat);
                        }
                        else {
                            return this.value;
                        }
                    }
                },
                plotLines: [{
                    color: '#666',
                    width: 2,
                    value: 0
                }]
            },
            legend: {
                layout: '',
                align: '',
                verticalAlign: '',
                x: 0,
                y: 0,
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5,
                symbolHeight: 15,
                itemMarginTop: 10,
                itemStyle: {
                    color: '#666',
                    fontWeight: 'normal'
                },
                itemHoverStyle: {
                    color: '#666'
                }
            },
            tooltip: {
                useHTML : true,
                headerFormat: '<div><b>{point.x}</b></div>',
                // pointFormat: '{series.name}: {point.y:,.0f}',
                pointFormatter: function() {
                    if (numberFormat) {
                        return "<div>" + this.series.name + ": " + numberFormatting.format(this.y, numberFormat) + "</div>";
                    }
                    else {
                        return this.y;
                    }
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    style: this.getDataLabelDefaultStyle(),
                    formatter: function() {
                        if (numberFormat) {
                            return numberFormatting.format(this.y, numberFormat);
                        }
                        else {
                            return this.y;
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            if (numberFormat) {
                                return numberFormatting.format(this.y, numberFormat);
                            }
                            else {
                                return this.y;
                            }
                        }
                    }
                }
            },
            series: []
        };
        return _.merge({}, this.getDefaults(), chartData);
    }

    getPieChartDefaults() {
        let chartData: any = {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: null,
            tooltip: {
                headerFormat: '<b>{series.name}</b><br/>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    style: this.getDataLabelDefaultStyle()
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5,
                itemMarginTop: 10,
                itemStyle: {
                    color: '#fff',
                    fontWeight: 'normal'
                },
                itemHoverStyle: {
                    color: '#fff'
                }
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: []
            }]
        };
        return _.merge({}, this.getDefaults(), chartData);
    }

    getDonutDefaults(numberFormat?:string) {
        let chartData: any = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 0
                }
            },
            title: null,
            plotOptions: {
                pie: {
                    innerSize: 50,
                    depth :0,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            if (numberFormat) {
                                return numberFormatting.format(this.y, numberFormat);
                            }
                            else {
                                return this.y;
                            }
                        }
                    },
                    showInLegend: true,
                    style: this.getDataLabelDefaultStyle()
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5,
                itemMarginTop: 10,
                itemStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fill:'#000'
                },
                itemHoverStyle: {
                    color: '#000'
                }
            },
            tooltip: {
                pointFormatter: function() {
                    if (numberFormat) {
                        return numberFormatting.format(this.y, numberFormat);
                    }
                    else {
                        return this.y;
                    }
                }
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: []
            }]
        };
        return _.merge({}, this.getDefaults(), chartData);
    }

    getBasicLineChartDefaults(numberFormat?:string) {
        let chartData: any = {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: [],
                labels: {
                    style: this.getDataLabelDefaultStyle()
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
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
            legend: {
                layout: '',
                align: '',
                verticalAlign: '',
                x: 0,
                y: 0,
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5,
                symbolHeight: 15,
                itemMarginTop: 10,
                itemStyle: {
                    color: '#fff',
                    fontWeight: 'normal'
                },
                itemHoverStyle: {
                    color: '#fff'
                }
            },
            plotOptions: {
                line: {
                    style: this.getDataLabelDefaultStyle(),
                    formatter: function() {
                        if (numberFormat) {
                            return numberFormatting.format(this.y, numberFormat);
                        }
                        else {
                            return this.y;
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        formatter: function() {
                            if (numberFormat) {
                                return numberFormatting.format(this.y, numberFormat);
                            }
                            else {
                                return this.y;
                            }
                        }
                    }
                },
                series: {
                    marker: {
                        radius: 8
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormatter: function() {
                    if (numberFormat) {
                        return numberFormatting.format(this.y, numberFormat);
                    }
                    else {
                        return this.y;
                    }
                }
            },
            series: []
        };
        return _.merge({}, this.getDefaults(), chartData);
    }

    getHeatMapChartDefaults(numberFormat?:string) {
        let chartData:any = {

            chart: {
                type: 'heatmap',
                marginTop: 60,
                marginBottom: 20,
                plotBorderWidth: 1
            },
            title: {
                text: ''
            },

            xAxis: {
                categories: [],
                opposite: true,
                labels: {
                    style: {
                        fontSize: "16px"
                    }
                }
            },
            yAxis: {
                categories: [],
                title: null,
                labels: {
                    style: {
                        fontSize: "16px"
                    }
                }
            },

            plotOptions: {
                series: {
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    dataLabels: {
                        style: {
                            fontSize: "24px",
                            fontFamily: "OpenSans",
                            fontWeight: "500"
                        },
                        formatter:function() {
                            // if (this.y == 4) {
                            //     return this.point.value + " %";
                            // } else {
                            //     return this.point.value + " mm";
                            // }
                            return this.point.value;
                        },
                        enabled: true
                    }
                }
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: '#FFFFFF'
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b><br><b>' +
                        this.point.value + '</b><br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                }
            },

            series: [{
                name: '',
                borderWidth: 1,
                data: [],
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF'
                }
            }]
            
        };
        return _.merge({}, this.getDefaults(), chartData);
    }

    getWaterfallDefaults(numberFormat?:string){
        let chartData = {
                chart: {
                    type: 'waterfall'
                },

                xAxis: {
                    type: null
                },

                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function() {
                            let value = this.value || this.y;
                            if (numberFormat) {
                                return numberFormatting.format(value, numberFormat);
                            }
                            else {
                                return value;
                            }
                        }
                    }
                },

                series: [{
                    data:[],
                    dataLabels: {
                        enabled: true,
                        formatter: function(){
                            if (numberFormat) {
                                return numberFormatting.format(this.y, numberFormat);
                            }
                            else {
                                return this.y;
                            }
                        },
                        style: {
                            fontWeight: 'bold'
                        }
                    },
                    pointPadding: 0
                }]
            }
        return _.merge({}, this.getDefaults(), chartData);
    }

    getDefaultsFor(chartType: string, numberFormat?: string): any {
        switch (chartType) {
            case CHART_TYPE.BASIC_BAR:
                return this.getBasicBarChartDefaults(numberFormat);
            case CHART_TYPE.BASIC_COLUMN:
                return this.getBasicColumnChartDefaults(numberFormat);
            case CHART_TYPE.BASIC_LINE:
                return this.getBasicLineChartDefaults(numberFormat);
            case CHART_TYPE.SOLID_GAUGE:
                return this.getSolidGaugeDefaults();
            case CHART_TYPE.PIE:
                return this.getPieChartDefaults();
            case CHART_TYPE.DONUT:
                return this.getDonutDefaults();
            case CHART_TYPE.STACKED_COLUMN:
                return this.getStackedColumnChartDefaults(numberFormat);
            case CHART_TYPE.HEAT_MAP:
                return this.getHeatMapChartDefaults(numberFormat);
            case CHART_TYPE.WATERFALL:
                return this.getWaterfallDefaults(numberFormat);
            case CHART_TYPE.COMBINATION:
            // chart type is combination - so no chart type is added but we will be looking at the series for chart types
            default:
                return this.getDefaults();
        }
    }

    getPlotOptions(chartType: string, numberFormat?: string): any {
        switch (chartType) {
            case CHART_TYPE.STACKED_COLUMN:
                return {
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: false,
                                // format: '{y:0.1f}',
                                formatter: function() {
                                    if (numberFormat) {
                                        return numberFormatting.format(this.y, numberFormat);
                                    }
                                    else {
                                        return this.y;
                                    }
                                },
                                color: 'black',
                                style: this.getDataLabelDefaultStyle()
                            }
                        }
                    }
                };
            default:
        }
    }

    getChartAsImageURI(chart: any){
        var chartSvg = chart.getSVG();
        chartSvg = "data:image/svg+xml,"+chartSvg;
        return chartSvg;
    }
}