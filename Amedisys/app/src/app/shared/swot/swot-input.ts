import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';


@Component({
    selector: 'swot-input',
    templateUrl: './swot-input.html',
    styleUrls: ['./swot-input.css'],
    providers: []
})
export class SwotInput implements OnInit, OnDestroy {
    @Input() swottitle:string = "";
    @Input() modelRange:string;
    @Input() inputHelpText:string = "";
    private inputText:string;
    private inputRef: string;

    constructor(private calcService: CalcService, private textEngine: TextEngineService) {}

    ngOnInit() {
        this.inputText = this.calcService.getValue(this.modelRange);
        this.inputHelpText = this.textEngine.getText(this.inputHelpText);
    }

    ngOnDestroy() {

    }

    onFocus($event) {
        // this.inputText = $event;
    }

    onBlur($event) {
        // this.inputText = $event.srcElement.value;
        this.calcService.setValue(this.modelRange, this.inputText);
    }
}