import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'erplatform-data',
    templateUrl: './erplatformdata.component.html',
    styleUrls: ['./erplatformdata.component.styl']
})

export class ERPlatformDataComponent {
    private itemsArray = ["0","1","2","3","4","5"];
    private customChartOption = '';

    constructor( private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
