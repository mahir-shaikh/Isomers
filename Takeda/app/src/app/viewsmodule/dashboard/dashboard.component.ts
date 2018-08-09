import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { UiSwitchModule } from 'angular2-ui-switch';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';


@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent {
    @ViewChild('performanceModal') public performanceModalRef: ModalDirective;
    @ViewChild('changeArea') public changeAreaRef: ModalDirective;
    @ViewChild('scoreModal') public scoreModalRef: ModalDirective;
    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    @ViewChild('errModal') public errModalRef: ModalDirective;
    private area: string = "Prod";
    private areaSubsciption : Subscription;
    private routeObserver: any;
    private activeReportRoute: boolean = false;
    private subscription: Subscription;
    private calcServiceSubscription: Subscription;
    private key_one: number = 49;
    private key_two: number = 50;
    private changeAreaMode:boolean = false;
    private scoreInput:boolean = false;
    private showErrorMessage: boolean = false;
    private showPasswordErrorMessage: boolean = false;
    private showLoader: boolean = false;
    private storedPassword: string;
    private password: string = "";
    @HostListener('document:keyup', ['$event'])
    onKeyUp(ev:KeyboardEvent) {
        if(ev.keyCode === this.key_one && ev.ctrlKey && ev.shiftKey){
            this.showChangeArea();
        }else if(ev.keyCode === this.key_two && ev.ctrlKey && ev.shiftKey){
            this.showScoreModalRef();
        }
    }

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };


    ngOnInit() {
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            this.changeAreaMode = true;
            this.area = "Reg";
        }

        this.areaSubsciption = this.calcService.getObservable().subscribe(() => {
            this.updateArea();
        });
        this.storedPassword = this.textEngineService.getText("Password");
    }

    updateArea(){
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            this.area = "Reg";
        }else{
            this.area = "Prod";
        }

    }

    ngOnDestroy() {
        this.areaSubsciption.unsubscribe();
    }

    showPerformanceDashboard(){
        this.performanceModalRef.show();
    }

    hidePerformanceDashboard(){
        this.performanceModalRef.hide();
    }

    showChangeArea(){
        this.changeAreaRef.show();
    }

    hideChangeArea(){
        this.changeAreaRef.hide();
    }

    onAreaChangeSubmit(event){
        if(this.changeAreaMode){
            this.calcService.setValue("xxRDB1DBM2", "2");
        }else{
            this.calcService.setValue("xxRDB1DBM2", "1");            
        }
        this.hideChangeArea();
    }

    showScoreModalRef(){
        if (this.canSubmitScore()) {
            let round = this.calcService.getValue("tlTeamRound");
            if(round == "2"){
                this.scoreInput = true;
            }
            this.scoreModalRef.show();
        }
    }

    canSubmitScore() {
        let samplesThresholdFailed = this.calcService.getValueForYear('xxSamplesThreshold','tlTeamRound'),
            promotionThresholdFailed = this.calcService.getValueForYear('xxPromotionThreshold','tlTeamRound');

        if (samplesThresholdFailed || promotionThresholdFailed) {
            this.errModalRef.show();
            return false;
        }
        return true;
    }

    hideScoreModalRef(){
        this.scoreModalRef.hide();
        this.showErrorMessage = false;
        this.password = "";
    }

    onScoreSubmit(event){
        let round = Number(this.calcService.getValue("tlTeamRound"));
       
        if(this.password == this.storedPassword){
            this.showPasswordErrorMessage = false;
            round++;
            this.scoreModalRef.hide();
            // show loader icon
            this.showLoader = true;
            this.calcService.setValue("xxRound", round).then(() => {
                // hide loader icon
                this.showLoader = false;
                this.router.navigateByUrl(ROUTES.INTRO);
            });
        }else{
            this.showPasswordErrorMessage = true;
        }
        
    }

    gotoHome(){        
        this.router.navigateByUrl(ROUTES.INTRO);
    }

    showLogoutAlert(){
        this.logoutModalRef.show();
    }

    hideLogoutAlert(confirmed:boolean = false) {
        this.logoutModalRef.hide();  
    }
}
