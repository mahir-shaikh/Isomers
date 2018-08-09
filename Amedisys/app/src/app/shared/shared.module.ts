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
import { LogoutComponent } from './logout/logout.component';
import { SwotComponent } from './swot/swot.component';
import { SwotInput } from './swot/swot-input';

@NgModule({
    imports: [CommonModule, CalcModule, FormsModule, RouterModule, ConnectModule, TooltipModule, ModalModule, TextEngineModule],
    declarations: [SplashComponent, LogoutComponent, SwotComponent, SwotInput],
    exports: [SplashComponent, LogoutComponent, SwotComponent, SwotInput],
    providers: [ComponentLoaderFactory]
})

export class SharedModule { }


export { SplashComponent } from './splash/splash.component';
export { LogoutComponent } from './logout/logout.component';
export { SwotComponent } from './swot/swot.component';
export { SwotInput } from './swot/swot-input';


