import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES, LANGUAGES} from '../../utils';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent implements OnInit, OnDestroy {
    private currentYear: number;

    constructor(private router: Router, private calcService: CalcService, private title: Title, private dataStore: DataStore, private textEngineService : TextEngineService) { };

    ngOnInit() {
        this.currentYear = this.calcService.getValue("tlInputTeamYear");
    }


    ngOnDestroy() {

    }

    navigateToNextPage(){
        this.dataStore.setData(EVENTS.INTRO_COMPLETE,true,true);
        this.dataStore.setData(EVENTS.REINITIALIZE_WOBBLERS,true,true);
        this.router.navigate(["/overview"]);
    }
}
