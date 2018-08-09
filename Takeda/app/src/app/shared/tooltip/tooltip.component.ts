import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Utils, DataStore } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';

@Component({
    selector: 'my-tooltip',
    templateUrl: './tooltip.html',
    styleUrls: ['./tooltip.styl']
})

export class TooltipComponent implements OnInit {
    private tooltipClass: string = 'tooltipHide';
    @Input() tooltipPlacement: string = '';
    @Input() tooltipText: string = '';
    @Input() key: string = '';

    constructor(private textEngineService: TextEngineService, private utils: Utils) { }
    
    ngOnInit() {
        if (this.key) {
            let tooltipText = this.textEngineService.getText(this.key) || this.key;

            if (tooltipText) {
                this.tooltipText = tooltipText;
            }
        }
    }
}
