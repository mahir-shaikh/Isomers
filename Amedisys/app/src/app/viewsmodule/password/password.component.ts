import { Component, Input, OnInit, AfterViewInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { DataStore, Utils, EVENTS, YEAR_OUTLET, LOCATION, SCENARIO, ROUTES, PASSWORD_VISIBLE_AFTERINTRO, PASSWORD_VISIBLE_AFTERSUBMIT_R1, PASSWORD_VISIBLE_AFTERFEEDBACK_R1, PASSWORD_VISIBLE_AFTERSUBMIT_R2, PASSWORD_VISIBLE_AFTERFEEDBACK_R2, PASSWORD_VISIBLE_AFTERSUBMIT_R3, APP_READY, INTRO_COMPLETE, EOR_FEEDBACK, END_OF_ROUND, FEEDBACK_VIEWED } from '../../utils/utils';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'im-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.css']
})

export class PasswordComponent {
    @ViewChild('passwordModal') public passwordModal: ModalDirective;

    private selfRef;
    private name = "";
    private isViewed = false;
    private currentYear = 1;
    private fbYear = 0;
    private clearToSubmit = false;
    private warningMessages = "";
    private errorMessages = "";

    private teamNumber = 0;
    private passwordForRound = this.textengineservice.getText("PasswordToMoveToRound") || "temp";
    private submitPassword = "";
    private passwordVisible = 0;
    private showPasswordError = false;
    private activeReportRoute: boolean = false;
    private endSessionVisible = false;
    private subscription: Subscription;
    private calcServiceSubscription: Subscription;
    private showLoader:boolean = false;

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private textengineservice:TextEngineService, private calcService: CalcService) { };


    ngOnInit() {
        let self = this;
    
        this.selfRef = self;

        this.currentYear = parseInt(this.calcService.getValue("xxRound"));
        // this.subscription = this.dataStore.getObservableFor(SCENARIO).subscribe((val) => {
            
        // });

        // this.passwordVisible = this.calcService.getValue(PASSWORD_VISIBLE);
        this.passwordVisible = 1;
        
        // this.showSubmit();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }

    showSubmit() {
        
        // console.log ("init check: " + totalChecked + " / " + maxChecked + " = " + warnInitiatives);

        let errorInitiatives = false;
        let initNum = 1;
        this.warningMessages = "";
        this.errorMessages = "";

        this.submitPassword = "";
        console.log(this.dataStore.getData(LOCATION));
        this.dataStore.setData(APP_READY, false);
                    // mark introviewed - and persist
        this.dataStore.setData(INTRO_COMPLETE, true, true);
        // this.passwordModal.show();
    }

    hideSubmit(confirmed:boolean = false) {
        let closeSubmit = true,
        self = this;
        // console.log ("password: " + this.submitPassword + ", " + (this.submitPassword == this.passwordToSubmit));
        if (confirmed) {
            if(this.passwordForRound == this.submitPassword){
                this.currentYear++;
                this.dataStore.setData(END_OF_ROUND, false, true);
                this.dataStore.setData(FEEDBACK_VIEWED, false, true);
                this.calcService.setValue("xxRound", this.currentYear);
                this.showLoader = true;
                setTimeout(() => {
                    // this.router.navigateByUrl('/dashboard');
                    window.location.href = window.location.href.replace("/password", "/dashboard");
                    this.showLoader = false;
                    // window.location.reload();
                }, 6000);
            }else{
                this.showPasswordError = true;
            }
        }
    }
}
