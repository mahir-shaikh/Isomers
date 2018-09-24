import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts'; // import for definitions to be available
import * as _Highcharts from 'highcharts/js/highcharts'; // use highcharts styled-mode js
import { NumberFormatting } from '../../utils/number-formatting';
/**
 * HighchartsStatic library to provide highcharts instance with extra modules and plugins
 *
 */
@Injectable()
export class HighchartsStatic {
  /**
   * Highcharts instance
   *
   */
  private _highchartsStatic: Highcharts.Static;

  /**
   * HighchartsStatic service constructor
   *
   * We extend the highcharts instance with modules and plugins when we instantiate this service
   *
   */
  constructor() {
    const hc: Highcharts.Static = _Highcharts,
      hm = require('highcharts/highcharts-more'),
      sg = require('highcharts/modules/solid-gauge'),
      hmap = require('highcharts/modules/heatmap'),
      exp = require('highcharts/modules/exporting'),
      hfc = require('@btsdigital/highcharts-formatter-plugin');

    this._highchartsStatic = hc;

    hm(hc);
    sg(hc);
    hmap(hc);
    exp(hc);
    hfc(hc, NumberFormatting);
    //    this.extendHighchartsToUseCustomFormatter(hc);
  }

  /**
   * Returns a reference to _highchartsStatic member
   *
   * @return {Highcharts.Static}
   *
   */
  getHighchartsStatic(): Highcharts.Static {
    return this._highchartsStatic;
  }

  // /**
   // * Extends highcharts library and changes the formatSingle function to use numberformatting/numeraljs tokens
   // *
   // * @param {Highcharts.Static} hc Highcharts library instance
   // */
  // extendHighchartsToUseCustomFormatter(hc: Highcharts.Static) {
  //   hc.wrap(hc, 'formatSingle', function(originalFormat: Function, format: string, value: any) {
  //     let formatStr: string, scaler: number;
  //     if (format) {
  //       if (format.indexOf('date') === -1 && format.indexOf(':') !== -1) {
  //         formatStr = format.split(':')[0];
  //         scaler = Number(format.split(':')[1]) || 1;
  //       } else {
  //         formatStr = format;
  //         scaler = 1;
  //       }
  //       return NumberFormatting.format(value, formatStr, scaler);
  //     } else {
  //       return value;
  //     }
  //   });
  // }
}
