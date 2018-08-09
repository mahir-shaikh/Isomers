import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalcService } from './calc.service';
import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';
import { DataAdaptorService } from '../dataadaptor/data-adaptor.service';
import { CalcModelLoadedGuard } from './calc-model-loaded-guard';
import { CalcOutlet } from './calcoutlet/calcoutlet';
import { CalcInput } from './calcinput/calcinput';
import { NumberFormattingPipe } from './number-formatting.pipe';
import { CalcFormatter } from './calc-formatter';
import { CalcCheckbox } from './calccheckbox/calccheckbox';
import { CalcSlider } from './calcslider/calcslider';
import { CalcDropdown } from './calcdropdown/calcdropdown';
import { CalcStepper } from './calcstepper/calcstepper';
import { DropdownModule } from 'ng2-bootstrap';
import { OnlynumberDirective } from './onlynumberdirective/onlynumber.directive';

@NgModule({
    imports: [
        DataAdaptorModule,
        FormsModule,
        CommonModule,
        DropdownModule
    ],
    declarations: [
        CalcOutlet,
        NumberFormattingPipe,
        CalcInput,
        CalcCheckbox,
        CalcFormatter,
        CalcSlider,
        CalcDropdown,
        CalcStepper,
        OnlynumberDirective
    ],
    exports: [
        CalcOutlet,
        NumberFormattingPipe,
        CalcInput,
        CalcCheckbox,
        CalcFormatter,
        CalcSlider,
        CalcDropdown,
        CalcStepper,
        OnlynumberDirective
    ],
    providers: [CalcService, CalcModelLoadedGuard]
})
export class CalcModule { }