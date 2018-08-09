import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';

@Component({
    selector: 'end-screen',
    templateUrl: './endscreen.component.html',
    styleUrls: ['./endscreen.component.styl'],
})

export class EndScreenComponent implements OnInit, OnDestroy {

    constructor(private calcService: CalcService, private textEngineService: TextEngineService) { };

    ngOnInit() {
    }


    ngOnDestroy() {

    }

}
