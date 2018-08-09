import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';


@Component({
    selector: 'dashboard-data',
    templateUrl: './dashboarddata.component.html',
    styleUrls: ['./dashboarddata.component.styl']
})

export class DashboardDataComponent {

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        
    }

    ngOnDestroy() {
    }
}
