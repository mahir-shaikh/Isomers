import { Component, OnInit, OnDestroy, Input, ViewChild,
  ElementRef, ChangeDetectionStrategy, ChangeDetectorRef,
  OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { CalcService } from '../../calc/calc.service';
import { TextService } from '../../text-engine/text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NumberFormatting } from '../../../utils/number-formatting';
import { ChartUtilsService } from '../chart-utils.service';
import { HighchartsStatic } from '../highchartsstatic'; // get static highcharts instance from this service
import * as _ from 'lodash';
import * as Highcharts from 'highcharts'; // import for definitions to be available
import { Constants } from '../../../config/constants';
import { Subscription } from 'rxjs/Subscription';

/**
 * Chartcomponent for rendering charts using highcharts library
 *
 */
@Component({
  selector: 'ism-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.styl'],
  changeDetection: ChangeDetectionStrategy. OnPush
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Array of named ranges. This could be a multi-dimensional array of range refs depending on the series and chart type
   */
  @Input() rangeRef: Array<any>;
  /**
   * This is the named range for current year/round, if it needs to be appended to the named ranges in range ref array
   */
  @Input() yearRef: string;
  /**
   * Highcharts xAxis Options for current chart
   */
  @Input() xAxis: Highcharts.AxisOptions | Array<Highcharts.AxisOptions>;
  /**
   * Highcharts yAxis Options for current chart
   */
  @Input() yAxis: Highcharts.AxisOptions | Array<Highcharts.AxisOptions>;
  /**
   * Highcharts series options for current chart
   */
  @Input() seriesOptions: Array<Highcharts.SeriesOptions>;
  /**
   * Miscellaneous Highcharts options for current chart
   */
  @Input() chartOptions: Highcharts.Options;
  /**
   * Element reference to the element in which the chart needs to be rendered
   */
  @ViewChild('chartelem') chartElem: ElementRef;
  /**
   * Chart config variable
   */
  private chartConfig: Highcharts.Options;
  /**
   * Array of default options that need to be appended to chartConfig before rendering
   */
  public defaultOptions: Array<string> = ['default', 'legend'];
  /**
   * Highcharts chart object
   */
  chart: Highcharts.ChartObject;
  /**
   * Subscription for the Calc model update event.
   */
  private modelChangeSub: Subscription;

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
  constructor(private calcService: CalcService, private textService: TextService,
    private communicatorService: CommunicatorService, private chartUtils: ChartUtilsService,
    private logger: LoggerService, private cdRef: ChangeDetectorRef, private highCharts: HighchartsStatic) { }

  /**
   * OnInit function for component
   *
   * We initialize and render the component in this function
   */
  ngOnInit() {

    if (typeof this.rangeRef === 'undefined' || (this.rangeRef && !this.rangeRef.length)) {
      throw new Error('Rangeref not defined!');
    }

    this.initConfig();
    this.renderChart();

    this.modelChangeSub = this.communicatorService.getEmitter(Constants.MODEL_CALC_COMPLETE)
      .subscribe(() => {
        this.update();
      });

    /*setInterval(() => {
      this.communicatorService.trigger(Constants.MODEL_CALC_COMPLETE);
    }, 10000);*/
  }

  /**
   * Create default starting configuration for the chart to be rendered
   *
   */
  private setChartDefault() {
    this.chartConfig = {
      chart: {
        renderTo: this.chartElem.nativeElement,
        backgroundColor: '#FFFFFF'
      },
      lang: {
        thousandsSep: ','
      },
      credits: {
        enabled: false
      }
    };
  }

  /**
   * This function triggers the configuration for different chart options
   *
   */
  private initConfig() {
    this.setChartDefault();
    // process series
    this.processSeriesOptions();
    // process axes
    this.processXAxisOptions();
    this.processYAxisOptions();
  }

  /**
   * This function renders the highcharts using the chartOptions member.
   *
   */
  private renderChart() {
    // process additional options
    let defaults: Highcharts.Options;
    defaults = this.chartUtils.getDefaultsFor(this.defaultOptions);
    const opt = {};
    _.merge(opt, defaults, this.chartOptions, this.chartConfig);
    // console.log(this.chartConfig.get());
    this.chart = this.highCharts.getHighchartsStatic().chart(opt);
  }

  /**
   * This function is triggered when calc model is updated. The chart data is updated using this function
   *
   */
  update() {
    if (typeof this.seriesOptions === 'object' && this.seriesOptions instanceof Array) {
      this.seriesOptions.forEach((series, index) => {
        const dataRef: Array<any> = this.rangeRef[index];
        const data: Array<any> = ((this.chartOptions &&
          this.chartOptions.chart &&
          this.chartOptions.chart.type === 'pie') || series.type === 'pie') ?
          this.chartUtils.getDataForPieChart(this.rangeRef, null, this.yearRef) :
          this.chartUtils.getDataForChart(dataRef, this.yearRef);
          this.chart.series[index].setData(data, false);
      });
      this.chart.redraw();
    }
  }

  /**
   * OnDestroy function for component. We clear any events / subscribers in this function
   *
   */
  ngOnDestroy() {
    if (this.modelChangeSub) {
      this.modelChangeSub.unsubscribe();
    }
  }

  /**
   * OnChanges function for component. This function is triggered when any __Input__ property of component is updated
   *
   */
  ngOnChanges() {
    if (this.chart) {
      this.chart.destroy();
      this.initConfig();
      this.renderChart();
    }
  }

  /**
   * This function processes the xAxis options and sets them to chartOptions.
   *
   */
  private processXAxisOptions() {
    if (!this.xAxis) {
      return;
    }
    if (typeof this.xAxis === 'object' && !(this.xAxis instanceof Array)) {
      this.xAxis = [this.xAxis];
    }
    this.processAxisLabels(this.xAxis[0]); // process category labels
    this.chartConfig.xAxis = this.xAxis[0];
  }

  /**
   * This function processes the yAxis options and sets them to chartOptions.
   *
   */
  private processYAxisOptions() {
    let axis: Array<Highcharts.AxisOptions>;
    if (!this.yAxis) {
      return;
    }
    if (typeof this.yAxis === 'object' && !(this.yAxis instanceof Array)) {
      axis = this.yAxis = [this.yAxis];
    } else {
      axis = this.yAxis;
    }
    this.processAxisLabels(this.yAxis[0]); // process category labels
    this.chartConfig.yAxis = this.yAxis;
  }

  /**
   * This function processes the Axis Labels and sets them to axisOptions.
   *
   */
  private processAxisLabels(axisOptions: Highcharts.AxisOptions): Array<string> {
    if (!axisOptions.categories) {
      return; // do nothing if labels are not defined!
    }
    const labelsArr: Array<string> = [],
      labels = axisOptions.categories;

    labels.forEach((label) => {
      const lbl = (/tl(In|Out)put.+/i.test(label)) ? // check if value can be fetched from calc model
        ((this.calcService.getValueForYear(label, this.yearRef)) ?
        this.calcService.getValueForYear(label, this.yearRef) : this.calcService.getValue(label)) : // get value for year / get value
        this.textService.getTextForYear(label, this.yearRef) ?
        this.textService.getTextForYear(label, this.yearRef) : this.textService.getText(label) ? // get text for year / get text
        this.textService.getText(label) : label; // fallback to the label passed
        labelsArr.push(lbl);
    });
    axisOptions.categories = labelsArr;
  }

  /**
   * This function processes the series options and sets them to chartOptions.
   *
   */
  private processSeriesOptions() {
    if (typeof this.seriesOptions === 'object' && this.seriesOptions instanceof Array) {
      this.seriesOptions.forEach((series, index) => {
          const type = series.type,
            dataRef: Array<any> = this.rangeRef[index];
        if (this.defaultOptions.indexOf(series.type) === -1) {
          this.defaultOptions.push(series.type);
        }
        // handle stacked column / bar chart types
        if (series.type === 'stackedcolumn') {
          series.type = 'column';
        } else if (series.type === 'stackedbar') {
          series.type = 'bar';
        }
        this.fetchSeries(series, dataRef);
        this.chartConfig.series = this.seriesOptions;
      });
    } else {
      this.logger.log('Invalid series options');
    }
  }

  /**
   * This function fetches the data for the series and sets it to chartOptions.series object
   *
   */
  private fetchSeries(series: Highcharts.SeriesOptions, dataRef: Array<string>) {
    series.data = ((this.chartOptions && this.chartOptions.chart && this.chartOptions.chart.type === 'pie') || series.type === 'pie') ?
      this.chartUtils.getDataForPieChart(this.rangeRef, series.data, this.yearRef) :
      this.chartUtils.getDataForChart(dataRef, this.yearRef);

    series.name = this.textService.getTextForYear(series.name, this.yearRef) ?
        (this.textService.getTextForYear(series.name, this.yearRef) ?
        this.textService.getTextForYear(series.name, this.yearRef) :
        this.textService.getText(series.name)) :
        (this.calcService.getValue(series.name) ?
        this.calcService.getValue(series.name) : series.name);
  }
}

