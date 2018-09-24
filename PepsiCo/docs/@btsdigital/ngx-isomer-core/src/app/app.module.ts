import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { IsomerCoreModule } from './isomer';
import { AppRoutingModule } from './app.routing';
import { ModelLoaderService } from './model/model-loader.service';
import { ViewsModule } from './views/views.module';
// import { SignalRModule, SignalRService, SignalRServiceConfig } from '@btsdigital/pulsesignalr';
// import { ViewsRoutingModule } from './views/views-routing.module';
import { ManifestService } from './isomer/modules/services/manifest/manifest.service';
import { JsCalcConnectorService } from './isomer/modules/connect/lib/jscalc-connector.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IsomerCoreModule,
    ViewsModule
    // ,
    // SignalRModule
  ],
  providers: [ModelLoaderService,
    // SignalRService,
    JsCalcConnectorService,
    // { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [ManifestService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// export function loadConfig(manifest: ManifestService) {
//   return () => {
//     const promise = manifest.setConfig({
//       config: {
//         hostName: 'http://localhost',
//         eventTitle: 'ComponentLibrary',
//         questionsToSend: [{ 'questionName': 'ANSWER_1_A', 'rangeName': 'ANSWER_1_A' }],
//         questionsToReceive: [
//           { 'questionName': 'ANSWER_1_A', 'rangeName': 'ANSWER_1_A' },
//           { 'questionName': 'ANSWER_1_C', 'rangeName': 'ANSWER_1_C' }
//         ],
//         foremanquestionsToRecieve: [{ 'questionName': 'BUSINESS_UNIT', 'rangeName': 'BUSINESS_UNIT' },
//         { 'questionName': 'REDGREEN_RESULT_1', 'rangeName': 'REDGREEN_RESULT_1' }],
//         trackQuestion: { 'questionName': 'CHALLENGE_TRACK', 'rangeName': 'CHALLENGE_TRACK' }
//       }
//     });
//     return promise;
//   };
// }

