import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CalcModule } from '../../calcmodule/calc.module';
import { TabsModule } from 'ng2-bootstrap';
import { TextEngineModule } from '../../textengine/text.module';
import { ModalModule } from 'ng2-bootstrap';
import { PositioningService } from 'ng2-bootstrap/positioning';
import { IntroComponent, IntroText, IntroEmail, IntroOverview, GoalSettingComponent, Registration } from './intro';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TabsModule.forRoot(),
        TextEngineModule,
        CalcModule,
        ModalModule
        // messagesDashRouting
    ],
    declarations: [
        IntroComponent,
        IntroText,
        IntroEmail,
        IntroOverview,
        GoalSettingComponent,
        Registration
    ],
    exports: [
        IntroComponent,
        IntroText,
        IntroEmail,
        IntroOverview,
        GoalSettingComponent,
        Registration
    ],
    providers: [PositioningService]
})
export class IntroModule { }
