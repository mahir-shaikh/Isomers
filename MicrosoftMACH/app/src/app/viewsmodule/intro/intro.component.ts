import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES, LANGUAGES} from '../../utils';
import { CalcService } from '../../calcmodule';
// import { TextEngineService } from '../../textengine/textengine.service';
import { Title } from '@angular/platform-browser';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'

@Component({
    selector: 'intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent implements OnInit, OnDestroy {
	private currentYear: number;
    private isFresh: boolean = true;
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    
    constructor(private router: Router, private calcService: CalcService, private title: Title, private dataStore: DataStore,private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
    	this.currentYear = this.calcService.getValue("tlInputTeamRound");

        let introData = this.dataStore.getData(EVENTS['INTRO_COMPLETE'], true);
        if (introData !== null){
            introData.then((ready) => {
                if(ready == "true"){
                    this.isFresh = false;
                }else{
                    this.isFresh = true;
                }
            });
        }
    }

    ngOnDestroy() {

    }

    navigateToNextPage(){
        this.dataStore.setData(EVENTS.INTRO_COMPLETE,true,true);
        let erData = this.dataStore.getData(EVENTS['ER_COMPLETE'], true);
        if (erData !== null){
            erData.then((ready) => {
                if(ready == "true"){
                    this.dataStore.setData(EVENTS.ER_COMPLETE,true,true);
                    this.router.navigate(["/opsOperation"]);
                }else{
                    this.router.navigate(["/erPlatform"]);
                }
            });
        }
        // this.router.navigate(["/erPlatform"]);
    }

    resetData() {
        this.dataAdaptor.clear(null, true);
        window.location.reload();
    }

    showResetAlert(){
        this.resetModalRef.show();
    }
    hideResetAlert() {
        this.resetModalRef.hide();  
    }


}
