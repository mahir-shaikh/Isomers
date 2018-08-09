import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES, LANGUAGES} from '../../utils';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Title } from '@angular/platform-browser';
import * as SyncLoop from 'sync-loop';

@Component({
    selector: 'intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent implements OnInit, OnDestroy {
    private currentYear: number;
    private showPasswordErrorMessage: boolean = false;
    private roundTwoStartPassword: string;
    private roundThreeStartPassword: string;
    private password: string = "";
    private passwordModalNumber: number = 1;//1 = Round 2 Start Password;2 = Round 3 Start Password
    @ViewChild('passwordModal') public passwordModalRef: ModalDirective;

    constructor(private router: Router, private calcService: CalcService, private title: Title, private dataStore: DataStore, private textEngineService : TextEngineService) { };

    ngOnInit() {
        this.currentYear = this.calcService.getValue("tlInputRound");
        this.roundTwoStartPassword = this.textEngineService.getText("RoundTwoStartPassword");
        this.roundThreeStartPassword = this.textEngineService.getText("RoundThreeStartPassword");
    }


    ngOnDestroy() {

    }

    navigateToNextPage(){
        this.dataStore.setData(EVENTS.INTRO_COMPLETE,true,true);
        if(this.currentYear == 1){
            this.router.navigate(["/intPlanStratergy"]);
        }else if(this.currentYear == 2){
            this.router.navigate(["/intPlan"]);
        }else if(this.currentYear == 3){
            this.router.navigate(["/execution"]);
        }else if(this.currentYear == 4){
            this.router.navigate(['/endScreen'])
        }
    }

    showPasswordModalRef(){
        this.updatePassModalNumber(this.currentYear - 1);
        this.passwordModalRef.show();
    }

    hidePasswordModalRef(){
        this.passwordModalRef.hide();
        this.showPasswordErrorMessage = false;
        this.password = "";
    }

    onPasswordSubmit(){       
        if(this.password == this.roundTwoStartPassword && this.passwordModalNumber == 1){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            this.navigateToNextPage();
        }else if(this.password == this.roundThreeStartPassword && this.passwordModalNumber == 2){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            this.navigateToNextPage();
        }else{
            this.showPasswordErrorMessage = true;
        }

        this.password = "";
    }

    updatePassModalNumber(value){
        this.passwordModalNumber = value;
    }

    beginRoundCLicked(){
        if(this.currentYear == 1){
            this.navigateToNextPage();
            return;
        }

        let introData = this.dataStore.getData(EVENTS['INTRO_COMPLETE'], true);
        if (introData !== null){
            introData.then((ready) => {
                if(ready == "true"){
                    this.navigateToNextPage();
                }else{
                    this.showPasswordModalRef();
                }
            });
        }
    }

}
