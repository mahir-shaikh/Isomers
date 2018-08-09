import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES} from '../../utils';
import { CalcService } from '../../calcmodule';
// import { TextEngineService } from '../../textengine/textengine.service';
import { Title } from '@angular/platform-browser';
// import * as SyncLoop from 'sync-loop';

@Component({
    selector: 'intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent implements OnInit, OnDestroy {
    
    constructor(private router: Router, private calcService: CalcService, private title: Title, private dataStore: DataStore) { };

    ngOnInit() {
        
    }

    ngOnDestroy() {

    }
}
