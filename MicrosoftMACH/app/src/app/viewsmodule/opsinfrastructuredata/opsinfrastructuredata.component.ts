import { Component, Input, OnInit, AfterViewInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ops-infrastructure-data',
    templateUrl: './opsinfrastructuredata.component.html',
    styleUrls: ['./opsinfrastructuredata.component.styl']
})

export class OpsInfrastructureData implements OnInit{

	constructor(private calcService: CalcService, private textEngineService : TextEngineService) {
    }

	ngOnInit() {
	}

	ngOnDestroy() {
    }

}