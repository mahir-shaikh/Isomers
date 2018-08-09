import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'
import { WobblerComponent } from '../../shared/wobbler/wobbler.component';

@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent {
    private currentYear:any;
    private routeObserver: any;
    private subscriber: any;
    private showMenu:boolean = false;
    private hideDashboardData: boolean = false;
    private hideSubmitBtn: boolean = false;

    private showPasswordErrorMessage: boolean = false;
    private resetPassword: string;
    private password: string = "";
    private passwordModalNumber: number = 1;//1 = Reset;
    private errorCheck: boolean = true;
    private errorCheck1: boolean = true;
    private errorCheck2: boolean = true;
    private errorCheck3: boolean = true;
    private errorCheck4: boolean = true;
    private errorCheck5: boolean = true;
    private errorCheck6: boolean = true;

    @ViewChild('passwordModal') public passwordModalRef: ModalDirective;
    
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    private arrResetInputs: Array<string> = [];

    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    @ViewChild('submitModal') public submitModalRef: ModalDirective;
    @ViewChild('errorModal') public errorModalRef: ModalDirective;
    @ViewChild('exportModal') public exportModalRef: ModalDirective;
    @ViewChild('wobbler') wobblerRef: WobblerComponent;
    private wobblerList = [];

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.resetPassword = this.textEngineService.getText("ResetPassword");
        
        self.onRouteChange();
        this.routeObserver = this.router.events.subscribe((val) => {
            if(val instanceof NavigationEnd){
                self.onRouteChange();
            }            
        });

        
        this.subscriber = this.calcService.getObservable().subscribe(() => {
            self.updateWobblerList();
        });
    }

    updateWobblerList(){
        let list = this.wobblerRef.getWobblerList();
        if(this.wobblerList != list){
            this.wobblerList = list;
        }
    }

    onRouteChange(){
        this.currentYear = this.calcService.getValue("tlInputRound");
        this.hideDashboardData = this.router.url.indexOf("pnl") > 0 || this.router.url.indexOf("decSummary") > 0 ? true : false;
        this.hideSubmitBtn = this.router.url.indexOf("overview") > 0 ? true : false;
        this.closeMenu();
    }

    onCLickOfMenu(){
        let showMenu  = !this.showMenu;
        this.showMenu = showMenu;
    }

    closeMenu(){
        setTimeout(()=>{
            this.showMenu = false;            
        },500);
    }

    openMenu($event){
        this.showMenu = true;

        $event.preventDefault();
        $event.stopPropagation();
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
    }
    

    resetData() {
        this.dataAdaptor.clear(null, true).then(()=>{
            window.location.reload();
        });
    }

    ngAfterViewInit() {
        let self = this;
        
        let introStatus = this.dataStore.getData(EVENTS.INTRO_COMPLETE,true);
        if (introStatus !== null) {
            introStatus.then((ready) => {
                if (ready == 'true') {
                    this.wobblerRef.initializeWobblers();
                    setTimeout(()=>{
                        self.updateWobblerList();
                    },1000);
                }
            });
        }
        
        
    }

    showPasswordModalRef(value){
        this.updatePassModalNumber(value);
        this.passwordModalRef.show();
    }

    hidePasswordModalRef(){
        this.passwordModalRef.hide();
        this.showPasswordErrorMessage = false;
        this.password = "";
    }

    showLogoutAlert(){
        this.logoutModalRef.show();
    }

    hideLogoutAlert(confirmed:boolean = false) {
        this.logoutModalRef.hide();  
    }

    showSubmitModal(){
        // set errorCheck
        this.errorCheck1 = this.calcService.getValue("tlOutputErrorCheck1");
        this.errorCheck2 = this.calcService.getValue("tlOutputErrorCheck2");
        this.errorCheck3 = this.calcService.getValue("tlOutputErrorCheck3");
        this.errorCheck4 = this.calcService.getValue("tlOutputErrorCheck4");
        this.errorCheck5 = this.calcService.getValue("tlOutputErrorCheck5");
        this.errorCheck6 = this.calcService.getValue("tlOutputErrorCheck6");
        console.log ("errorCheck1: " + this.errorCheck1);
        console.log ("errorCheck2: " + this.errorCheck2);
        console.log ("errorCheck3: " + this.errorCheck3);
        console.log ("errorCheck4: " + this.errorCheck4);
        console.log ("errorCheck5: " + this.errorCheck5);
        console.log ("errorCheck6: " + this.errorCheck6);
        this.errorCheck = this.errorCheck1 && this.errorCheck2 && this.errorCheck3 && this.errorCheck4 && this.errorCheck5 && this.errorCheck6;
        this.submitModalRef.show();
    }

    hideSubmitModal() {
        this.submitModalRef.hide();  
    }

    showErrorModal(){
        this.errorModalRef.show();
    }

    hideErrorModal() {
        this.errorModalRef.hide();  
    }

    showExportModal(){
        this.exportModalRef.show();
    }

    hideExportModal() {
        this.exportModalRef.hide()
    }

    showResetModal(){
        this.resetModalRef.show();
    }

    hideResetModal() {
        this.resetModalRef.hide()
    }

    onPasswordSubmit(){       
        if(this.password == this.resetPassword && this.passwordModalNumber == 1){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            this.resetData();
        }else{
            this.showPasswordErrorMessage = true;
        }

        this.password = "";
    }

    updatePassModalNumber(value){
        this.passwordModalNumber = value;
    }

    displayWobbler(number){
        this.wobblerRef.showEvent(number);
    }

    nextRound(){
        this.hideSubmitModal();
        this.router.navigate(["/holdScreen"]);
    }
}
