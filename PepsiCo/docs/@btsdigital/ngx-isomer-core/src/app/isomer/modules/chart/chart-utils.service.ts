import { Injectable } from '@angular/core';
import { CalcService } from '../calc/calc.service';
import { TextService } from '../text-engine/text.service';
import { Defaults } from './defaults';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';

/**
 * ChartUtils service provides utility functions for generating charts using {@link ChartComponent}
 *
 */
@Injectable()
export class ChartUtilsService {

  /**
   * Constructor function for instantiating the service
   *
   * @param {CalcService} calcService Instance of CalcService to fetch data from model
   *
   * @param {TextService} textService Instance of TextService to fetch text from content json
   */
  constructor(private calcService: CalcService, private textService: TextService) { }

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
  getDataForPieChart(refArr: Array<string>, dataPoints?: any, yearRef?: string): Array<any> {
    const out = [];
    if (typeof refArr === 'object' && refArr instanceof Array) {
      refArr.forEach((rangeRef, refIndex) => {
        const val = this.calcService.getValueForYear(rangeRef, yearRef, true),
          // const val = Math.random() * 10000000,
          dataPoint = (dataPoints) ? dataPoints[refIndex] : null,
          key = (dataPoint) ? dataPoint.name : null;
        let lbl: string;
        if (key) {
          lbl = (this.textService.getTextForYear(key, yearRef)) ? this.textService.getTextForYear(key, yearRef) :
            (this.textService.getText(key)) ? this.textService.getText(key) : key;
          if (lbl === key) {
            lbl = (this.calcService.getValue(key)) ? this.calcService.getValue(key) : key;
          }
        }
        if (dataPoints) {
          out.push({
            name: lbl,
            y: val
          });
        } else {
          out.push(val);
        }
      });
    }
    return out;
  }

  /**
   * Fetch data for all charts but pie chart.
   *
   * @param {Array<string>} refArr Array of named ranges for which values need to be fetched from the calc model
   *
   * @param {string} [yearRef] Named range ref for Current year in the model that needs to be appended to the refs in refArray
   *
   */
  getDataForChart(refArr: Array<string> | string, yearRef?: string): any {
    const data = [];
    if (typeof refArr === 'string') {
      // return Math.random() * 10000000;
      return this.calcService.getValueForYear(refArr, yearRef, true);
    }

    refArr.forEach((ref) => {
      data.push(this.getDataForChart(ref));
    });
    return data;
  }

  /**
   * Get defaults for different chart types and options
   *
   * @param {Array<string>} types Array containing Chart types and options keys for which defaults need to be returned
   *
   * @returns {Highcharts.Options}
   */
  getDefaultsFor(types: Array<string>): Highcharts.Options {
    const opt = {};

    if (types && types.length) {
      types.forEach((type) => {
        _.merge(opt, this.getDefaultsOptionsForChart(type));
      });
    }
    return opt;
  }

  /**
   * Get defaults for a chart type or option
   *
   * @param {string} chartType Chart types or option key for which default needs to be returned
   *
   * @returns {Highcharts.Options}
   */
  getDefaultsOptionsForChart(chartType: string): Highcharts.Options {
    switch (chartType) {
      case Defaults.Bar:
        return this.getBarChartPlotOptions();
      case Defaults.Column:
        return this.getColumnChartPlotOptions();
      case Defaults.Pie:
      case Defaults.Donut:
        return this.getPieChartPlotOptions();
      case Defaults.Heatmap:
        return this.getHeatmapChartPlotOptions();
      case Defaults.Line:
        return this.getLineChartPlotOptions();
      case Defaults.Scatter:
        return this.getScatterChartPlotOptions();
      case Defaults.SolidGauge:
        return this.getSolidGaugeChartPlotOptions();
      case Defaults.StackedBar:
        return this.getStackedBarChartPlotOptions();
      case Defaults.StackedColumn:
        return this.getStackedColumnChartPlotOptions();
      case Defaults.Legend:
        return this.getDefaultLegendOptions();
      default:
        return {
          chart: {
            backgroundColor: '#FFFFFF'
          },
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          exporting: {
            enabled: false
          },
          credits: {
            enabled: false
          }
        };
    }
  }

  /**
   * Get svg for chart object
   *
   * @returns {string}
   */
  getChartAsImageURI(chart: Highcharts.ChartObject): string {
    const svg = chart.getSVG();
    return 'data:image/svg+xml' + svg;
  }

  /**
   * Get default options for chart legend
   *
   * @returns {Highcharts.Options}
   */
  private getDefaultLegendOptions(): Highcharts.Options {
    return {
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
        floating: false,
        borderWidth: 0,
        shadow: false,
        symbolRadius: 5
      }
    };
  }

  /**
   * Get default options for bar chart
   *
   * @returns {Highcharts.Options}
   */
  private getBarChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      }
    };
  }

  /**
   * Get default options for stacked column chart
   *
   * @returns {Highcharts.Options}
   */
  private getStackedColumnChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          }
        }
      },
      yAxis: [{
        stackLabels: {
          enabled: true,
        }
      }]
    };
  }

  /**
   * Get default options for column chart
   *
   * @returns {Highcharts.Options}
   */
  private getColumnChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        }
      }
    };
  }

  /**
   * Get default options for pie chart
   *
   * @returns {Highcharts.Options}
   */
  private getPieChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true
          },
          showInLegend: true
        }
      }
    };
  }

  /**
   * Get default options for line chart
   *
   * @returns {Highcharts.Options}
   */
  private getLineChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          }
        },
        series: {
          marker: {
            radius: 8
          }
        }
      }
    };
  }

  /**
   * Get default options for heatmap chart
   *
   * @returns {Highcharts.Options}
   */
  private getHeatmapChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true
          }
        }
      }
    };
  }

  /**
   * Get default options for stacked bar chart
   *
   * @returns {Highcharts.Options}
   */
  private getStackedBarChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      }
    };
  }

  /**
   * Get default options for scatter chart
   *
   * @returns {Highcharts.Options}
   */
  private getScatterChartPlotOptions(): Highcharts.Options {
    return {
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          }
        }
      }
    };
  }

  /**
   * Get default options for solid gauge chart
   *
   * @returns {Highcharts.Options}
   */
  private getSolidGaugeChartPlotOptions(): any {
    return {
      'pane': {
        'center': ['50%', '70%'],
        'startAngle': -125,
        'endAngle': 125,
        'size': '90%',
        'background': [{
          'shape': 'arc',
          'innerRadius': '90%',
          'outerRadius': '100%'
        }]
      },
      'plotOptions': {
        'solidgauge': {
          'rounded': true,
          'dataLabels': {
            y: 40,
            borderWidth: 0
          },
          'innerRadius': '90%',
          'outerRadius': '100%'
        }
      },
      yAxis: [{
        tickPosition: 'inside',
        tickWidth: 1,
        lineWidth: 1
      }],
      xAxis: {
        tickPosition: 'inside',
        tickWidth: 1,
        lineWidth: 1
      }
    };
  }
}
