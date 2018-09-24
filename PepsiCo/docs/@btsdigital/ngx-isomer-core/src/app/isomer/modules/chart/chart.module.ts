import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { HighchartsStatic } from './highchartsstatic';
import { CalcModule } from '../calc/calc.module';
import { TextEngineModule } from '../text-engine/text-engine.module';
import { ServicesModule } from '../services/services.module';
import { ChartUtilsService } from './chart-utils.service';

/**
 * Chart module for generating charts using Highcharts library
 *
 */
@NgModule({
  imports: [
    CommonModule,
    CalcModule,
    TextEngineModule,
    ServicesModule
  ],
  declarations: [ChartComponent],
  exports: [ChartComponent],
  providers: [HighchartsStatic, ChartUtilsService]
})
export class ChartModule { }
