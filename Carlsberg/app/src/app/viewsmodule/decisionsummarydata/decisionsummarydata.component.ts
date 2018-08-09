import { Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { ROUTES } from '../../utils';
import { CalcService } from '../../calcmodule';

@Component({
    selector: 'decision-summary-data',
    templateUrl: './decisionsummarydata.component.html',
    styleUrls: ['./decisionsummarydata.component.styl'],
})

export class DecisionSummaryDataComponent {
	@Input() prodNo : number;
	@Input() doAnimation : boolean = false;
    constructor( private router: Router, private calcService: CalcService) { };

    ngOnInit() {
    }
    
    ngOnDestroy(){
    }
}

