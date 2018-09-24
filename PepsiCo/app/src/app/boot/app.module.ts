import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TextEngineModule, ConnectModule, ManifestService } from '@btsdigital/ngx-isomer-core';
import { ViewsModule } from '../viewsmodule/views.module';

import { AppComponent } from './app.component';
import { Utils, CsvFileReaderService } from '../utils';

import { routing } from './app.routing';
import { AppConfig } from './app.config';

// import { CalcModule } from '../calcmodule/calc.module';

// import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';

// import { TextEngineModule } from '../textengine/text.module';
// import { ChartsModule } from '../charts/charts.module';

// import { ConnectModule } from '../connect/connect.module';
// import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';
// import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        // CalcModule,
        // DataAdaptorModule,
        routing,
        ViewsModule,
        TextEngineModule,
        ConnectModule,
        /*ChartsModule.forRoot(
            require('highcharts'), 
            require('highcharts/highcharts-more'), 
            require('highcharts/modules/solid-gauge'), 
            require('highcharts/modules/heatmap'), 
            require('highcharts/modules/exporting'),
            require('highcharts/modules/offline-exporting')
        ),
        TabsModule.forRoot(),  
        ButtonsModule.forRoot(), 
        DropdownModule.forRoot(), 
        ModalModule.forRoot(), 
        CarouselModule.forRoot(), 
        TooltipModule.forRoot(), 
        AccordionModule.forRoot()*/
    ],
    declarations: [
        AppComponent
    ],
    providers: [Utils, CsvFileReaderService, AppConfig,
        { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfig, ManifestService], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfig(appConfig: AppConfig, manifestService: ManifestService) {
    return () => {
        const promise = appConfig.load().toPromise();
        promise.then(res => {
            manifestService.setConfig({ config: res.json() });
        });

        return promise;
    };
}
