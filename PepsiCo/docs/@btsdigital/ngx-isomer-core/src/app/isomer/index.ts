import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ServicesModule } from './modules/services/services.module';
import { CalcModule } from './modules/calc/calc.module';
import { ChartModule } from './modules/chart/chart.module';
import { ConnectModule } from './modules/connect/connect.module';
import { TextEngineModule } from './modules/text-engine/text-engine.module';
import { SignalRModule } from '@btsdigital/pulsesignalr';

export * from './modules/calc/index';
export * from './modules/chart/index';
export * from './modules/services/index';
export * from './config/constants';
export * from './modules/connect/index';
export * from './modules/text-engine/index';


/**
 * The module that includes all the IsomerModules like {@link CalcModule}, {@link ChartModule}, ...
 *
 */
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ServicesModule,
    ConnectModule,
    ChartModule,
    CalcModule,
    TextEngineModule,
    SignalRModule
  ],
  declarations: [],
  exports: [CalcModule, ChartModule, ServicesModule, ConnectModule, TextEngineModule, SignalRModule],
  providers: []
})
export class IsomerCoreModule { }
