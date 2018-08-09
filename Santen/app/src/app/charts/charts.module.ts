import { NgModule, ModuleWithProviders } from '@angular/core';
import { ChartDefaults, GaugeComponent, BasicBarComponent, StackedColumnComponent, BasicColumnComponent, PieChartComponent, BasicLineComponent, HeatMapComponent, GenericChartComponent, WaterfallColumnComponent, DonutComponent } from '../charts';
import { HighchartsStatic } from './highchartsstatic';

const DIRECTIVES = [GaugeComponent, BasicBarComponent, StackedColumnComponent, BasicColumnComponent, PieChartComponent, BasicLineComponent, HeatMapComponent, GenericChartComponent, WaterfallColumnComponent, DonutComponent]

@NgModule({
    imports: [],
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES],
    providers: [ChartDefaults]
})
export class ChartsModule {
    static forRoot(highchartsStatic: HighchartsStatic, ...highchartsModules: Array<Function>): ModuleWithProviders {
        // Plug highcharts modules
        highchartsModules.forEach((module) => {
            module(highchartsStatic)
        });

        return {
            ngModule: ChartsModule,
            providers: [
                { provide: HighchartsStatic, useValue: highchartsStatic }
            ]
        }
    }
}
