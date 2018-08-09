import { Component, OnInit, Input, Renderer, ElementRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';
import { Utils, DataStore } from '../../utils/utils';
import { TextEngineService } from '../../textengine/textengine.service';

@Component({
    selector: 'my-tooltip',
    templateUrl: './tooltip.html',
    styleUrls: ['./tooltip.css']
})

export class Tooltip implements OnInit {
    private tooltipClass: string = 'tooltipHide';
    @Input() tooltipPlacement: string = 'right';
    @Input() tooltipText: string = '';
    @Input() key: string = '';

    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private router: Router, private utils: Utils) { }
    
    ngOnInit() {
        if (this.key) {
            let tooltipText = this.textEngineService.getText(this.key);

            if (tooltipText) {
                this.tooltipText = tooltipText;
            }
        }
    }
}
