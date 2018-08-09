import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES} from '../../utils';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';

@Component({
    selector: 'app-inputs',
    templateUrl: './inputs.component.html',
    styleUrls: ['./inputs.component.styl'],
})

export class InputsComponent implements OnInit, OnDestroy {
    
    constructor(private router: Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        
    }

    ngOnDestroy() {

    }
}
