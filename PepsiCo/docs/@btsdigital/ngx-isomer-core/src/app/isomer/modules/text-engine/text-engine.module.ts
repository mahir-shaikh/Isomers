import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TextOutputComponent } from './text-output/text-output.component';
import { TextService } from './text.service';
import { ServicesModule } from '../services/services.module';
import { CalcModule } from '../calc/calc.module';

/**
 * Text engine module works as a content loader utility and allows switching between multiple languages
 *
 */
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    CalcModule,
    ServicesModule
  ],
  declarations: [TextOutputComponent],
  exports: [TextOutputComponent],
  providers: [TextService]
})
export class TextEngineModule { }
