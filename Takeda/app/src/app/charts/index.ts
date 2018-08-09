export const CHART_TYPE = {
    BASIC_LINE: 'basicline',
    BASIC_BAR: 'basicbar',
    BASIC_COLUMN: 'basiccolumn',
    SOLID_GAUGE: 'solidgauge',
    PIE: 'pie',
    STACKED_COLUMN: 'stackedcolumn',
    WATERFALL: 'waterfall',
    HEAT_MAP: 'heatmap',
    DONUT : 'donut',
    COMBINATION: 'combination'
}

export { ChartDefaults } from './chartdefaults';


export { GaugeComponent } from './solidgauge/gauges';
export { BasicBarComponent } from './basicbar/basicbar';
export { StackedColumnComponent } from './stackedcolumn/stackedcolumn';
export { BasicColumnComponent } from './basiccolumn/basiccolumn';
export { PieChartComponent } from './pie/piechart';
export { BasicLineComponent } from './basicline/basicline';
export { HeatMapComponent } from './heatmap/heatmap';
export { DonutComponent } from './donut/donut';
export { WaterfallColumnComponent } from './waterfall/waterfall';
export { HighchartsStatic } from './highchartsstatic';
export { GenericChartComponent } from './genericchart/genericchart.component';