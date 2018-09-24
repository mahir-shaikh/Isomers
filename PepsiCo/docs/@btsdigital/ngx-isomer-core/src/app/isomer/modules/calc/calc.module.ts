import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesModule } from '../services/services.module';
import { CalcModelLoadedGuard } from './calc-model-loaded.guard';
import { CalcOutputComponent } from './calc-output/calc-output.component';
import { CalcInputComponent } from './calc-input/calc-input.component';
import { CalcFormatterDirective } from './calc-formatter.directive';
import { CalcSliderComponent } from './calc-slider/calc-slider.component';
import { CalcDropdownComponent } from './calc-dropdown/calc-dropdown.component';
import { CalcCheckboxComponent } from './calc-checkbox/calc-checkbox.component';
import { CalcOptionComponent } from './calc-option/calc-option.component';
import { CalcStepperComponent } from './calc-stepper/calc-stepper.component';
import { CalcService } from './calc.service';
import { BsDropdownModule } from 'ngx-bootstrap';

/**
 * list of declarations / exports for calc module
 *
 */
const declarations: Array<any> = [CalcInputComponent, CalcOutputComponent,
  CalcFormatterDirective, CalcSliderComponent, CalcDropdownComponent, CalcCheckboxComponent, CalcOptionComponent, CalcStepperComponent];

/**
 * Calc module is used to interface and update the calc model using jsCalc
 *
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServicesModule,
    BsDropdownModule.forRoot()
  ],
  declarations: declarations,
  exports: declarations,
  providers: [CalcService, CalcModelLoadedGuard]
})
export class CalcModule { }
