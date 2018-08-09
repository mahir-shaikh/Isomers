import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';


@Component({
    selector: 'customerreport',
    templateUrl: './customerreport.component.html',
    styleUrls: ['./customerreport.component.styl']
})

export class CustomerReportComponent {
    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
