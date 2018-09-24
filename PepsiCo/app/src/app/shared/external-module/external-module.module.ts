import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IsomerCoreModule, CalcService } from '@btsdigital/ngx-isomer-core';

// import { CalcService } from './calc.service';
// import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';
// import { DataAdaptorService } from '../dataadaptor/data-adaptor.service';
import { CalcModelLoadedGuard } from './calc-model-loaded-guard';
import { CalcOutletComponent } from './calcoutlet/calcoutlet';
import { CalcInputComponent } from './calcinput/calcinput';
// import { NumberFormattingPipe } from './number-formatting.pipe';
import { CalcFormatterDirective } from './calc-formatter';
import { CalcCheckboxComponent } from './calccheckbox/calccheckbox';
import { CalcDropdownComponent } from './calcdropdown/calcdropdown';
import { CalcStepperComponent } from './calcstepper/calcstepper';
// import { DropdownModule } from 'ng2-bootstrap';
import { OnlynumberDirective } from './onlynumberdirective/onlynumber.directive';
import { CalcOptionComponent } from './calcoption/calcoption';
import { CalcSliderComponent } from './calcslider/calcslider';
import { TooltipModule, BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        // DataAdaptorModule,
        FormsModule,
        CommonModule,
        IsomerCoreModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot()
    ],
    declarations: [
        CalcOutletComponent,
        // NumberFormattingPipe,
        CalcInputComponent,
        CalcCheckboxComponent,
        CalcFormatterDirective,
        CalcDropdownComponent,
        CalcStepperComponent,
        OnlynumberDirective,
        CalcOptionComponent,
        CalcSliderComponent
    ],
    exports: [
        CalcOutletComponent,
        // NumberFormattingPipe,
        CalcInputComponent,
        CalcCheckboxComponent,
        CalcFormatterDirective,
        CalcDropdownComponent,
        CalcStepperComponent,
        OnlynumberDirective,
        CalcOptionComponent,
        CalcSliderComponent
    ],
    providers: [CalcService, CalcModelLoadedGuard]
})
export class ExternalModule { }
