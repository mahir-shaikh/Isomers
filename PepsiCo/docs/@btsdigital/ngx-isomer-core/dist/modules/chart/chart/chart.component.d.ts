import { OnInit, OnDestroy, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CalcService } from '../../calc/calc.service';
import { TextService } from '../../text-engine/text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ChartUtilsService } from '../chart-utils.service';
import { HighchartsStatic } from '../highchartsstatic';
import * as Highcharts from 'highcharts';
/**
 * Chartcomponent for rendering charts using highcharts library
 *
 */
export declare class ChartComponent implements OnInit, OnDestroy, OnChanges {
    private calcService;
    private textService;
    private communicatorService;
    private chartUtils;
    private logger;
    private cdRef;
    private highCharts;
    /**
     * Array of named ranges. This could be a multi-dimensional array of range refs depending on the series and chart type
     */
    rangeRef: Array<any>;
    /**
     * This is the named range for current year/round, if it needs to be appended to the named ranges in range ref array
     */
    yearRef: string;
    /**
     * Highcharts xAxis Options for current chart
     */
    xAxis: Highcharts.AxisOptions | Array<Highcharts.AxisOptions>;
    /**
     * Highcharts yAxis Options for current chart
     */
    yAxis: Highcharts.AxisOptions | Array<Highcharts.AxisOptions>;
    /**
     * Highcharts series options for current chart
     */
    seriesOptions: Array<Highcharts.SeriesOptions>;
    /**
     * Miscellaneous Highcharts options for current chart
     */
    chartOptions: Highcharts.Options;
    /**
     * Element reference to the element in which the chart needs to be rendered
     */
    chartElem: ElementRef;
    /**
     * Chart config variable
     */
    private chartConfig;
    /**
     * Array of default options that need to be appended to chartConfig before rendering
     */
    defaultOptions: Array<string>;
    /**
     * Highcharts chart object
     */
    chart: Highcharts.ChartObject;
    /**
     * Subscription for the Calc model update event.
     */
    private modelChangeSub;
    /**
     * Constructor for chart component
     *
     * @param {CalcService} calcService CalcService Instance
     *
     * @param {TextService} textService TextService Instance
     *
     * @param {CommunicatorService} communicatorService CommunicatorService instance
     *
     * @param {ChartUtilsService} chartUtils ChartUtilsService instance
     *
     * @param {LoggerService} logger LoggerService instance
     *
     * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
     *
     * @param {HighchartsStatic} highCharts Highcharts api reference
     *
     */
    constructor(calcService: CalcService, textService: TextService, communicatorService: CommunicatorService, chartUtils: ChartUtilsService, logger: LoggerService, cdRef: ChangeDetectorRef, highCharts: HighchartsStatic);
    /**
     * OnInit function for component
     *
     * We initialize and render the component in this function
     */
    ngOnInit(): void;
    /**
     * Create default starting configuration for the chart to be rendered
     *
     */
    private setChartDefault();
    /**
     * This function triggers the configuration for different chart options
     *
     */
    private initConfig();
    /**
     * This function renders the highcharts using the chartOptions member.
     *
     */
    private renderChart();
    /**
     * This function is triggered when calc model is updated. The chart data is updated using this function
     *
     */
    update(): void;
    /**
     * OnDestroy function for component. We clear any events / subscribers in this function
     *
     */
    ngOnDestroy(): void;
    /**
     * OnChanges function for component. This function is triggered when any __Input__ property of component is updated
     *
     */
    ngOnChanges(): void;
    /**
     * This function processes the xAxis options and sets them to chartOptions.
     *
     */
    private processXAxisOptions();
    /**
     * This function processes the yAxis options and sets them to chartOptions.
     *
     */
    private processYAxisOptions();
    /**
     * This function processes the Axis Labels and sets them to axisOptions.
     *
     */
    private processAxisLabels(axisOptions);
    /**
     * This function processes the series options and sets them to chartOptions.
     *
     */
    private processSeriesOptions();
    /**
     * This function fetches the data for the series and sets it to chartOptions.series object
     *
     */
    private fetchSeries(series, dataRef);
}
