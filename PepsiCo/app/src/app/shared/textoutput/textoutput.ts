import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
// import { CalcService } from '../calc.service';
// import { NumberFormattingPipe } from '../number-formatting.pipe';
import { TextOutputComponent as IsomerTextOutputComponent } from '@btsdigital/ngx-isomer-core';

@Component({
    selector: 'isma-text-output',
    templateUrl: './textoutput.html',
    styleUrls: ['./textoutput.styl']
})

export class TextOutputComponent extends IsomerTextOutputComponent implements OnInit, OnChanges, OnDestroy {

    updateText() {
        super.updateText();
        if(!this.value){
            this.value = this.key;
        }
    }

}
