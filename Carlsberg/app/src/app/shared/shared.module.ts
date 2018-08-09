import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConnectModule } from '../connect/connect.module'
import { CalcModule } from '../calcmodule/calc.module'
import { TextEngineModule } from '../textengine/text.module';
import { TooltipModule, ModalModule } from 'ng2-bootstrap';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';

// import shared components 
import { SplashComponent } from './splash/splash.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { LogoutComponent } from './logout/logout.component';
import { ProjectChooserComponent } from './projectchooser/projectchooser.component';
import { ProjectComponent } from './projectchooser/project/project.component';
import { ImportFileComponent } from './importfile/importfile.component';

@NgModule({
    imports: [CommonModule, CalcModule, FormsModule, RouterModule, ConnectModule, TextEngineModule, TooltipModule, ModalModule],
    declarations: [SplashComponent, TooltipComponent, LogoutComponent, ProjectChooserComponent, ProjectComponent, ImportFileComponent],
    exports: [SplashComponent, TooltipComponent, LogoutComponent, ProjectChooserComponent, ProjectComponent, ImportFileComponent],
    providers: [ComponentLoaderFactory]
})

export class SharedModule { }


export { SplashComponent } from './splash/splash.component';
export { TooltipComponent } from './tooltip/tooltip.component';
export { LogoutComponent } from './logout/logout.component';
export { ProjectChooserComponent } from './projectchooser/projectchooser.component';
export { ImportFileComponent } from './importfile/importfile.component';