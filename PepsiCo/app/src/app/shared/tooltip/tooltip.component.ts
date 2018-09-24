import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Utils, DataStore } from '../../utils';
// import { TextEngineService } from '../../textengine/textengine.service';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';
// import { CalcService } from '../../calcmodule/calc.service';

@Component({
    selector: 'isma-tooltip',
    templateUrl: './tooltip.html',
    styleUrls: ['./tooltip.styl']
})

export class TooltipComponent implements OnInit {
    private tooltipClass: string = 'tooltipHide';
    @Input() tooltipPlacement: string = '';
    @Input() tooltipText: string = '';
    @Input() key: string = '';
    @Input() useAsInnerHtml: boolean = false;

    constructor(private textEngineService: TextService, private utils: Utils, private calcService: CalcService) { }

    ngOnInit() {
        if (this.key) {
            let tooltipText;
            // = this.textEngineService.getText(this.key) || this.key;

            if ((this.key.indexOf('tlInput') !== -1) || (this.key.indexOf('tlOutput') !== -1) || (this.key.indexOf('InfoButton') !== -1)) {
                tooltipText = this.calcService.getValue(this.key);
            } else {
                tooltipText = this.textEngineService.getText(this.key) || this.key;
            }

            if (tooltipText) {
                this.tooltipText = tooltipText;
            }
        }
    }
}
