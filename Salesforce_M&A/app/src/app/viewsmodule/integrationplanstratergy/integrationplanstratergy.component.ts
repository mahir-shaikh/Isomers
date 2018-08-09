import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES, LANGUAGES} from '../../utils';
import { Router } from '@angular/router';


@Component({
  selector: 'app-integrationplanstratergy',
  templateUrl: './integrationplanstratergy.component.html',
  styleUrls: ['./integrationplanstratergy.component.styl']
})
export class IntegrationPlanStratergyComponent implements OnInit {
    private currentRound: number;

    constructor(private router: Router,private calcService: CalcService, private textEngineService : TextEngineService, private dataStore: DataStore) { };

    ngOnInit() {
        this.currentRound = this.calcService.getValue("xxCurrentRound");
    }

}