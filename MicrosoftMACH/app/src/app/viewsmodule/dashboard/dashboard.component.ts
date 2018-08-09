import { Component, Input, OnInit, AfterViewInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service';


@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent {
    private isERActive : boolean = false;
    private routeObserver: any;
    private isOperationMenuOpen: boolean = false;
    private isConsumerMenuOpen: boolean = false;
    private isCommercialMenuOpen: boolean = false;
    private isHamburgerMenuOpen: boolean = false;
    private isEngineeringMenuOpen: boolean = false;
    private isSomeMenuOpen: boolean = false;

    private exportRangeNames: Array<string> = ["tlInputTeamName","tlInputTeamNumber","xxRound","tlInputOpsTotalMarketingBudget","tlInputOpsCommercialMarketingBudget","tlInputOpsConsumerMarketingBudget","tlInputOpsITFTEs","tlInputOpsSupplyChainFTEs","tlInputOpsCollabFTEs","tlInputOpsDataCenter","tlInputOpsSkill1","tlInputOpsSkill2","tlInputOpsSkill3","tlInputEGSecurity","tlInputEGScalability","tlInputEGInteroperability","tlInputCommercialProd1Price","tlInputCommercialProd2Price","tlInputCommercialProd3Price","tlInputCommercialATUFTEs","tlInputCommercialSTUFTEs","tlInputCommercialCSUFTEs","tlInputCommercialServicesFTEs","tlInputCommercialGlobalDemandCenterFTEs","tlInputCommercialInsideSalesFTEs","tlInputCommercialFieldSalesFTEs","tlInputCommercialPartnerDevelopment","tlInputCommercialPartnerIncentives","tlInputCommercialPartnerEducation","tlInputCommercialPartner1Pct","tlInputCommercialPartner2Pct","tlInputCommercialPartner3Pct","tlInputCommercialPartner4Pct","tlInputConsumerProd1Price","tlInputConsumerProd3Price","tlInputConsumerDirectSalesFTEs","tlInputConsumerInsideSalesFTEs","tlInputConsumerServicesFTEs","tlInputConsumerPartnerDevelopment","tlInputConsumerPartnerIncentives","tlInputConsumerPartnerEducation","tlInputConsumerPartner4Pct","tlInputConsumerPartner5Pct","tlInputConsumerPartner6Pct","tlInputWobbler1","tlInputWobbler2","tlInputWobbler3","tlInputWobbler4","tlInputWobbler5","tlInputWobbler6","tlInputWobbler7","tlInputWobbler8"];
    private importRangeNames: Array<string> = ["tlInputCommercialPartnerDevelopment","tlInputCommercialPartnerIncentives","tlInputCommercialPartnerEducation","tlInputEGSecurity","tlInputEGScalability","tlInputEGInteroperability","tlInputEGDesign","tlInputEGProd1Offering1","tlInputEGProd1Offering2","tlInputEGProd2Offering1","tlInputEGProd2Offering2","tlInputEGProd2Offering3","tlInputEGProd3Offering1","tlInputEGProd3Offering2","tlInputEGProd3Offering3","tlInputOpsSkill1","tlInputOpsSkill2","tlInputOpsSkill3","tlInputCommercialProd1Price","tlInputCommercialProd2Price","tlInputCommercialProd3Price","tlInputConsumerProd1Price","tlInputConsumerProd3Price","tlInputConsumerPartnerDevelopment","tlInputConsumerPartnerIncentives","tlInputConsumerPartnerEducation","tlInputOpsDataCenter"];
    @ViewChild('importbalances') importBalancesEl;
    @ViewChild('importsuccess') importsuccessModalRef;
    @ViewChild('wobbler') wobblerRef;
    private erCommitEventListener: EventEmitter<any>;

    private showPasswordErrorMessage: boolean = false;
    private storedPassword: string;
    private password: string = "";
    private passwordModalNumber: number = 1;//1 = Export; 2 = Import; 3=Reset
    private callOnce:boolean = false;
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    @ViewChild('exportModal') public exportModalRef: ModalDirective;
    @ViewChild('passwordModal') public passwordModalRef: ModalDirective;
    
    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };
    
	ngOnInit() {
        let self = this;

        self.onRouteChange();
        this.routeObserver = this.router.events.subscribe((events) => {
            if(events instanceof NavigationEnd){
                self.onRouteChange();
            }
        });
        let erData = self.dataStore.getData(EVENTS['ER_COMPLETE'], true);
            if (erData !== null){
                erData.then((ready) => {
                    if(ready == "true"){
                        self.wobblerRef.initializeWobblers();
                        //self.callOnce = true;
                    }
                });
                // self.wobblerRef.initializeWobblers();
            }

        this.erCommitEventListener = this.dataStore.getObservableFor(EVENTS.ER_COMPLETE).subscribe(() => {
            let erData = self.dataStore.getData(EVENTS['ER_COMPLETE'], true);
            if (erData !== null){
                erData.then((ready) => {
                    if(ready == "true"){
                        self.wobblerRef.initializeWobblers();
                        self.callOnce = true;
                    }
                });
                // self.wobblerRef.initializeWobblers();
            }
        });

        this.storedPassword = this.textEngineService.getText("Password");
    }


    ngOnDestroy(){
        this.routeObserver.unsubscribe();
    } 

    onRouteChange(){
        this.isERActive =  this.router.url.indexOf("erPlatform") > 0 || this.router.url.indexOf("erProduct") > 0 ? true : false;
        this.closeAllMenu();
        setTimeout(()=>{
            this.closeAllMenu();
        }, 250)
    }

    closeAllMenu(){
        this.isOperationMenuOpen = false;
        this.isCommercialMenuOpen = false;
        this.isConsumerMenuOpen = false;
        this.isHamburgerMenuOpen = false;
        this.isSomeMenuOpen = false;
        this.isEngineeringMenuOpen = false;
    }

    exportDecisions(){
        //Since all 3 have same value and different range name any one is fine.
        let fteRemaining = this.calcService.getValue("tlOutputOpsDashboardFTEs");

        if(fteRemaining>=0){
            // this.calcService.exportData(true, this.exportRangeNames);
            this.showPasswordModalRef(1);
        }else{
            this.showExportAlert();
        }
    }

    importBalances(){
        this.importBalancesEl.showFileChooser();
    }

    onFileLoaded(jsonOb) {
        let self = this;
      console.log("Loaded file", jsonOb);
      return new Promise((resolve, reject) => {
      try {
          this.calcService.appendDataToModel(jsonOb).then(() => {
            this.utils.resetInputs(this.importRangeNames, this.calcService).then(()=>{
                self.closeAllMenu();
                self.showSuccessAlert();
            })
            // this.showSuccessAlert();
            resolve();
          }, reject);
      }
      catch(err) {
          reject(err);
        }
      });
    }

    showSuccessAlert() {
        this.importsuccessModalRef.show();
    }

    hideSuccessAlert() {
        this.importsuccessModalRef.hide();
        this.initializeRoundTwo();
    }

    initializeRoundTwo(){
        this.dataStore.setData(EVENTS.INTRO_COMPLETE,false,true);
        this.dataStore.setData(EVENTS.ER_COMPLETE,false,true);
        this.router.navigate(["/intro"]);
    }

    openMenu(menuNumber, $event : MouseEvent){
        // if($event.currentTarget == $event.target)
        {
            this.isSomeMenuOpen = true;

            this.isOperationMenuOpen = false;
            this.isCommercialMenuOpen = false;
            this.isConsumerMenuOpen = false;
            this.isHamburgerMenuOpen = false;
            this.isEngineeringMenuOpen = false;
            switch (menuNumber) {
                case 0:
                    this.isOperationMenuOpen = true;
                    break;
                case 1:
                    this.isCommercialMenuOpen = true;
                    break;
                case 2:
                    this.isConsumerMenuOpen = true;
                    break;
                case 3:
                    this.isHamburgerMenuOpen = true;
                    break;
                case 4:
                    this.isEngineeringMenuOpen = true;
                    break;
            }
        }
        $event.preventDefault();
        $event.stopPropagation();
    }
    
    closeMenu(menuNumber){
        if (this.isSomeMenuOpen) {
            switch (menuNumber) {
                case 0:
                    this.isOperationMenuOpen = false;
                    break;
                case 1:
                    this.isCommercialMenuOpen = false;
                    break;
                case 2:
                    this.isConsumerMenuOpen = false;
                    break;
                case 3:
                    this.isHamburgerMenuOpen = false;
                    break;
                case 4:
                    this.isEngineeringMenuOpen = false;
                    break;
            }
        }
    }

    resetData() {
        this.dataAdaptor.clear(null, true);
        window.location.reload();
    }

    showExportAlert(){
        this.closeAllMenu();
        this.exportModalRef.show();
    }
    hideExportAlert() {
        this.exportModalRef.hide();  
    }

    ngAfterViewInit() {
        // this.wobblerRef.initializeWobblers();
    }

    showPasswordModalRef(value){
        this.closeAllMenu();
        this.updatePassModalNumber(value);
        this.passwordModalRef.show();
    }

    hidePasswordModalRef(){
        this.passwordModalRef.hide();
        this.showPasswordErrorMessage = false;
        this.password = "";
    }

    onPasswordSubmit(){       
        if(this.password == this.storedPassword){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            if(this.passwordModalNumber == 1){
                //Export
                // this.exportDecisions();
                this.calcService.exportData(true, this.exportRangeNames);
            }else if(this.passwordModalNumber == 2){
                //Import
                this.importBalances();
            }else if(this.passwordModalNumber == 3){
                //Reset
                this.resetData();
            }            
        }else{
            this.showPasswordErrorMessage = true;
        }

        this.password = "";        
    }

    updatePassModalNumber(value){
        this.passwordModalNumber = value;
    }
}
