import { CalcService } from '../calc/calc.service';
import { TextService } from '../text-engine/text.service';
import * as Highcharts from 'highcharts';
/**
 * ChartUtils service provides utility functions for generating charts using {@link ChartComponent}
 *
 */
export declare class ChartUtilsService {
    private calcService;
    private textService;
    /**
     * Constructor function for instantiating the service
     *
     * @param {CalcService} calcService Instance of CalcService to fetch data from model
     *
     * @param {TextService} textService Instance of TextService to fetch text from content json
     */
    constructor(calcService: CalcService, textService: TextService);
    /**
     * Fetch data for pie charts
     *
     * @param {Array<string>} refArr Array of named ranges for which values need to be fetched from the calc model
     *
     * @param {any} [dataPoints] Array of dataPoints which needs to be passed to the series object with the data values
     *
     * @param {string} [yearRef] Named range ref for Current year in the model that needs to be appended to the refs in refArray
     *
     */
    getDataForPieChart(refArr: Array<string>, dataPoints?: any, yearRef?: string): Array<any>;
    /**
     * Fetch data for all charts but pie chart.
     *
     * @param {Array<string>} refArr Array of named ranges for which values need to be fetched from the calc model
     *
     * @param {string} [yearRef] Named range ref for Current year in the model that needs to be appended to the refs in refArray
     *
     */
    getDataForChart(refArr: Array<string> | string, yearRef?: string): any;
    /**
     * Get defaults for different chart types and options
     *
     * @param {Array<string>} types Array containing Chart types and options keys for which defaults need to be returned
     *
     * @returns {Highcharts.Options}
     */
    getDefaultsFor(types: Array<string>): Highcharts.Options;
    /**
     * Get defaults for a chart type or option
     *
     * @param {string} chartType Chart types or option key for which default needs to be returned
     *
     * @returns {Highcharts.Options}
     */
    getDefaultsOptionsForChart(chartType: string): Highcharts.Options;
    /**
     * Get svg for chart object
     *
     * @returns {string}
     */
    getChartAsImageURI(chart: Highcharts.ChartObject): string;
    /**
     * Get default options for chart legend
     *
     * @returns {Highcharts.Options}
     */
    private getDefaultLegendOptions();
    /**
     * Get default options for bar chart
     *
     * @returns {Highcharts.Options}
     */
    private getBarChartPlotOptions();
    /**
     * Get default options for stacked column chart
     *
     * @returns {Highcharts.Options}
     */
    private getStackedColumnChartPlotOptions();
    /**
     * Get default options for column chart
     *
     * @returns {Highcharts.Options}
     */
    private getColumnChartPlotOptions();
    /**
     * Get default options for pie chart
     *
     * @returns {Highcharts.Options}
     */
    private getPieChartPlotOptions();
    /**
     * Get default options for line chart
     *
     * @returns {Highcharts.Options}
     */
    private getLineChartPlotOptions();
    /**
     * Get default options for heatmap chart
     *
     * @returns {Highcharts.Options}
     */
    private getHeatmapChartPlotOptions();
    /**
     * Get default options for stacked bar chart
     *
     * @returns {Highcharts.Options}
     */
    private getStackedBarChartPlotOptions();
    /**
     * Get default options for scatter chart
     *
     * @returns {Highcharts.Options}
     */
    private getScatterChartPlotOptions();
    /**
     * Get default options for solid gauge chart
     *
     * @returns {Highcharts.Options}
     */
    private getSolidGaugeChartPlotOptions();
}
