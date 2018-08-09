import { Component, ElementRef, Input, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';

@Component({
    selector: 'scenariotable',
    templateUrl: './scenariotable.component.html',
    styleUrls: ['./scenariotable.component.css'],
    providers: []
})

export class SceanrioTableComponent implements OnInit {
    @Input() scenarioId: number;

   
    constructor( private textengineService: TextEngineService, private calcService: CalcService) {
        
    }

    ngOnInit() {        
    }


}
