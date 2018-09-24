import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
// import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
// import { CalcService } from '../../shared/external-module';
import { Subscription } from 'rxjs/Subscription';
// import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'
import { WobblerComponent } from '../../shared/wobbler/wobbler.component';

import { TextService, StorageService, CalcService } from '@btsdigital/ngx-isomer-core';

declare var chrome: any;
const KEY_NUM_1 = 49; // used to navigate to holdScreen

@Component({
    selector: 'isma-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
    currentYear: any;
    private routeObserver: any;
    private subscriber: any;
    private showMenu: boolean = false;
    showLoader: boolean = false;
    showPasswordErrorMessage: boolean = false;
    private resetPassword: string;
    password: string = '';
    passwordModalNumber: number = 1; // 1 = Reset;
    errorKey: string = '';
    @ViewChild('passwordModal') public passwordModalRef: ModalDirective;

    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    private arrResetInputs: Array<string> = [];

    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    @ViewChild('submitModal') public submitModalRef: ModalDirective;
    @ViewChild('errorModal') public errorModalRef: ModalDirective;
    @ViewChild('exportModal') public exportModalRef: ModalDirective;
    @ViewChild('wobbler') wobblerRef: WobblerComponent;
    @ViewChild('instructionsModal') public instructionsPage;

    @HostListener('document:keyup', ['$event'])
    onKeypress($event) {
        if ($event.keyCode === KEY_NUM_1 && $event.shiftKey && $event.ctrlKey) {
            this.navigateToHoldScreen();
        }
    }

    constructor(
        private dataStore: DataStore,
        private utils: Utils,
        private router: Router,
        private calcService: CalcService,
        private textEngineService: TextService,
        private storageService: StorageService,
        // private ismCalcService: IsomerCalcService
        /*private dataAdaptor: DataAdaptorService*/
    ) { }

    ngOnInit() {
        const self = this;
        this.resetPassword = this.textEngineService.getText('ResetPassword');

        self.onRouteChange();
        this.routeObserver = this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                self.onRouteChange();
            }
        });
    }

    ngAfterViewInit() {
        let introStatus = this.dataStore.getData(EVENTS.INTRO_COMPLETE, true);
        if (introStatus !== null) {
            introStatus.then((ready) => {
                if (ready == 'true') {
                    this.wobblerRef.initializeWobblers();
                }
            });
        }
        // this.wobblerRef.initializeWobblers();
    }

    onRouteChange() {
        this.currentYear = this.calcService.getValue('tlInputTeamYear');
        this.closeMenu();
    }

    onCLickOfMenu() {
        const showMenu = !this.showMenu;
        this.showMenu = showMenu;
    }

    closeMenu() {
        setTimeout(() => {
            this.showMenu = false;
        }, 500);
    }

    openMenu($event) {
        this.showMenu = true;

        $event.preventDefault();
        $event.stopPropagation();
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
    }


    resetData() {
        this.storageService.clearAll().then(() => {
            if (chrome && chrome.runtime && chrome.runtime.reload) {
                chrome.runtime.reload();
            }
            else {
                window.location.reload();
            }
        });
    }

    showPasswordModalRef(value) {
        this.updatePassModalNumber(value);
        this.passwordModalRef.show();
    }

    hidePasswordModalRef() {
        this.passwordModalRef.hide();
        this.showPasswordErrorMessage = false;
        this.password = '';
    }

    showLogoutAlert() {
        this.logoutModalRef.show();
    }

    hideLogoutAlert(confirmed: boolean = false) {
        this.logoutModalRef.hide();
    }

    showSubmitModal() {
        this.submitModalRef.show();
    }

    hideSubmitModal() {
        this.submitModalRef.hide();
    }

    showErrorModal() {
        this.errorModalRef.show();
    }

    hideErrorModal() {
        this.errorModalRef.hide();
    }

    showExportModal() {
        this.exportModalRef.show();
    }

    hideExportModal() {
        this.exportModalRef.hide();
    }

    showResetModal() {
        this.resetModalRef.show();
    }

    hideResetModal() {
        this.resetModalRef.hide();
    }

    onPasswordSubmit() {
        if (this.password === this.resetPassword && this.passwordModalNumber === 1) {
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            this.resetData();
        } else {
            this.showPasswordErrorMessage = true;
        }

        this.password = '';
    }

    updatePassModalNumber(value) {
        this.passwordModalNumber = value;
    }

    onClickInstructions() {
        this.instructionsPage.showChildModal();

    }

    nextRound() {
        this.hideSubmitModal();
        this.router.navigate(['/holdScreen']);
    }

    submitDecisions() {
        let mtu = parseInt(this.calcService.getValue("tlOutput_Dashboard5"));
        let isWobblerViewed = this.wobblerRef.isWobblerViewed();
        let areBreakThroughValid = this.checkRnDbooleans();
        let arePlantAndLabourValid = this.checkPlantAndLabourBooleans();
        let areInnovationsValid = this.checkInnovationBooleans();

        if(mtu < 0) {
            this.errorKey = "ErrorMsg";
            this.showErrorModal();
        }else if(!isWobblerViewed) {
            this.errorKey = "WobblerErrorMsg";
            this.showErrorModal();
        }else if(!areBreakThroughValid){
            this.errorKey = "BreakThroughInnovationErrorMsg";
            this.showErrorModal();
        }else if(!arePlantAndLabourValid){
            this.errorKey = "PlantAndLabourErrorMsg";
            this.showErrorModal();
        }else if(!areInnovationsValid){
            this.errorKey = "InnovationErrorMsg";
            this.showErrorModal();
        }else {
            this.showSubmitModal();
        }
    }

    checkRnDbooleans(): boolean{
        let isBreakthrough1Selected = this.calcService.getValue("tlInputDisrupt1") == "0" ? false : true;
        let isBreakthrough2Selected = this.calcService.getValue("tlInputDisrupt2") == "0" ? false : true;

        if(isBreakthrough1Selected){
            let value1 = this.calcService.getValue("tlInputProd2Reg1Price");
            let value2 = this.calcService.getValue("tlInputProd2Adv");
            let value3 = this.calcService.getValue("tlInputProd2Promo1");

            if(value1 == "$1" || value2 == "$1" || value3 == "$1"){
                return false
            }
        }

        if(isBreakthrough2Selected){
            let value1 = this.calcService.getValue("tlInputProd2Reg2Price");
            let value2 = this.calcService.getValue("tlInputProd2Adv2");
            let value3 = this.calcService.getValue("tlInputProd2Promo2");

            if(value1 == "$1" || value2 == "$1" || value3 == "$1"){
                return false
            }
        }

        return true;

    }

    checkPlantAndLabourBooleans(): boolean{
        let plant = this.calcService.getValue("tlOutputPlantUtilizationError");
        let labour = this.calcService.getValue("tlOutputLaborUtilizationError");

        if(plant || labour){
            return false;
        }else{
            return true;
        }
    }

    checkInnovationBooleans(): boolean{
        let errorcheck1 = this.calcService.getValue("tlOutputInnovationSelectedError");
        let errorcheck2 = this.calcService.getValue("tlOutputDisruptionSelectedError");

        if(errorcheck1 || errorcheck2){
            return false;
        }else{
            return true;
        }
    }

    navigateToHoldScreen(){
        this.router.navigate(['/holdScreen']);
    }
}
