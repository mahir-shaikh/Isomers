import { Component, OnInit, Input, HostListener, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Utils, DataStore } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule/calc.service';
import { TooltipDirective } from 'ng2-bootstrap';

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
    @Input() useAsInnerHtml:boolean = false;
    @ViewChild('tt') tooltipRef : TooltipDirective;

    constructor(private textEngineService: TextEngineService, private utils: Utils, private calcService: CalcService, private _elementRef : ElementRef) { }
    
    ngOnInit() {
        if (this.key) {
            let tooltipText;// = this.textEngineService.getText(this.key) || this.key;

            if ((this.key.indexOf("tlInput") != -1) || (this.key.indexOf("tlOutput") != -1) || (this.key.indexOf("InfoButton") != -1)) {
                tooltipText = this.calcService.getValue(this.key);
            } else {
                tooltipText = this.textEngineService.getText(this.key) || this.key;
            }

            if (tooltipText) {
                this.tooltipText = tooltipText;
            }
        }
    }

    @HostListener('document:touchend', ['$event.target'])
    public onClick(targetElement) {
        if(!this.tooltipRef.isOpen){
            return;
        }
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside && this.tooltipRef.isOpen) {
            this.tooltipRef.hide();
        }
    }
}
