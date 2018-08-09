import { Component, OnInit, ViewChild } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';
import { ModalDirective } from 'ng2-bootstrap';


@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.styl']
})
export class ScenarioComponent implements OnInit {

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }
}