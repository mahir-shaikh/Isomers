import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { ConnectModule } from '../connect/connect.module'
import { ExternalModule } from './external-module/external-module.module';
// import { TextEngineModule } from '../textengine/text.module';
import { TextEngineService } from '../textengine/textengine.service';
import { TooltipModule, ModalModule } from 'ngx-bootstrap';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { IsomerCoreModule, JsCalcConnectorService } from '@btsdigital/ngx-isomer-core';

// import shared components 
import { SplashComponent } from './splash/splash.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { LogoutComponent } from './logout/logout.component';
// import { ProjectChooserComponent } from './projectchooser/projectchooser.component';
// import { ProjectComponent } from './projectchooser/project/project.component';
import { ImportFileComponent } from './importfile/importfile.component';
import { WobblerComponent } from './wobbler/wobbler.component';

import { BootstrapService } from './bootstrap.service';
import { EmailCaptureService } from './emailcapture.service';
import { ModelLoaderService } from '../model/model-loader.service';
import { TextOutputComponent } from './textoutput/textoutput';

@NgModule({
    imports: [CommonModule, ExternalModule, FormsModule, RouterModule, TooltipModule, ModalModule, IsomerCoreModule],
    declarations: [SplashComponent, TooltipComponent, LogoutComponent, ImportFileComponent, WobblerComponent, TextOutputComponent],
    exports: [SplashComponent, TooltipComponent, LogoutComponent, ImportFileComponent, WobblerComponent, TextOutputComponent],
    providers: [ComponentLoaderFactory, EmailCaptureService, BootstrapService, TextEngineService, ModelLoaderService, JsCalcConnectorService]
})

export class SharedModule { }


export { SplashComponent } from './splash/splash.component';
export { TooltipComponent } from './tooltip/tooltip.component';
export { LogoutComponent } from './logout/logout.component';
export { ImportFileComponent } from './importfile/importfile.component';
export { WobblerComponent } from './wobbler/wobbler.component';
