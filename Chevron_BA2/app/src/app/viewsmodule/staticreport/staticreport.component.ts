import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'static-report',
    templateUrl: './staticreport.component.html',
    styleUrls: ['./staticreport.component.styl']
})
export class StaticReportCompopnent {
    private routeObserver: any;
    @Input() type: number;

    constructor(private dataStore: DataStore, private utils: Utils, private router: Router, private calcService: CalcService, private textEngineService: TextEngineService, private dataAdaptor: DataAdaptorService) { };
    ngOnInit() {
        
    }
    
}
