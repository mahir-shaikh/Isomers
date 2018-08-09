import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'
import * as _ from 'lodash';
import { FileSaver } from '../../utils';

@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent {
    private showMetrics: boolean = false;
    private currentYear:any;
    private currentRoute:string;
    private routeObserver: any;
    private showMenu:boolean = false;
    private showLoader: boolean = false;

    private showPasswordErrorMessage: boolean = false;
    private resetPassword: string;
    private exportPassword: string;
    private roundOnePassword: string;
    private roundTwoPassword: string;
    private roundThreePassword: string;
    private password: string = "";
    private passwordModalNumber: number = 1;//1 = Reset; 2 = Export;3 = Round1Submit; 4 = Round2Submit;5 = Round3Submit;
    @ViewChild('passwordModal') public passwordModalRef: ModalDirective;
    
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    private arrResetInputs: Array<string> = ["tlInputPeopleTimeline","tlInputPeopleHarmonizationLevel","tlInputPeopleNonKeyHarmonizationLevel","tlInputITTimeline","tlInputITIntegrationLevel","tlInputSecurityTimeline","tlInputSecurityP0RiskMitigation","tlInputSecurityP1RiskMitigation","tlInputSecurityP2RiskMitigation","tlInputITOfficePlan","tlInputSecurityBuildSiteInfrastructure","tlInputSecurityProductRestrictions","tlInputGTMOrg62Timeline","tlInputGTMCSGPostSales","tlInputGTMBrandIntegration","tlInputGTMExternalSales","tlInputGTMLeadPass","tlInputProductTimeline","tlInputProductStackFocus"];

    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    @ViewChild('submitModal') public submitModalRef: ModalDirective;
    @ViewChild('errorModal') public errorModalRef: ModalDirective;
    @ViewChild('exportModal') public exportModalRef: ModalDirective;

    private arrAllInputs: Array<string> = ["tlInputRound","tlInputTeamNumber","tlInputTeamName","TlInputV2MOMVision","tlInputV2MOMValue2Rank","tlInputV2MOMValue3Rank","tlInputV2MOMValue1Rank","tlInputV2MOMValue4Rank","tlInputV2MOMValue5Rank","TLInputV2MOMValue2Desc","TLInputV2MOMValue3Desc","TLInputV2MOMValue1Desc","TLInputV2MOMValue4Desc","TLInputV2MOMValue5Desc","tlInputV2MOMRisk1","tlInputV2MOMRisk2","tlInputV2MOMRisk3","tlInputPeopleTimeline","tlInputPeopleHarmonizationLevel","tlInputPeopleNonKeyHarmonizationLevel","tlInputITTimeline","tlInputITIntegrationLevel","tlInputSecurityTimeline","tlInputSecurityP0RiskMitigation","tlInputSecurityP1RiskMitigation","tlInputSecurityP2RiskMitigation","tlInputITOfficePlan","tlInputSecurityBuildSiteInfrastructure","tlInputSecurityProductRestrictions","tlInputGTMOrg62Timeline","tlInputGTMCSGPostSales","tlInputGTMBrandIntegration","tlInputGTMExternalSales","tlInputGTMLeadPass","tlInputProductTimeline","tlInputProductStackFocus"];
    private arrRoundOneInputs: Array<string> = ["tlInputRound","tlInputTeamNumber","tlInputTeamName","TlInputV2MOMVision","tlInputV2MOMValue2Rank","tlInputV2MOMValue3Rank","tlInputV2MOMValue1Rank","tlInputV2MOMValue4Rank","tlInputV2MOMValue5Rank","TLInputV2MOMValue2Desc","TLInputV2MOMValue3Desc","TLInputV2MOMValue1Desc","TLInputV2MOMValue4Desc","TLInputV2MOMValue5Desc","tlInputV2MOMRisk1","tlInputV2MOMRisk2","tlInputV2MOMRisk3"];
    private arrRoundTwoInputs: Array<string> = ["tlInputRound","tlInputTeamNumber","tlInputTeamName","tlInputPeopleTimeline","tlInputPeopleHarmonizationLevel","tlInputPeopleNonKeyHarmonizationLevel","tlInputITTimeline","tlInputITIntegrationLevel","tlInputSecurityTimeline","tlInputSecurityP0RiskMitigation","tlInputSecurityP1RiskMitigation","tlInputSecurityP2RiskMitigation","tlInputITOfficePlan","tlInputSecurityBuildSiteInfrastructure","tlInputSecurityProductRestrictions","tlInputGTMOrg62Timeline","tlInputGTMCSGPostSales","tlInputGTMBrandIntegration","tlInputGTMExternalSales","tlInputGTMLeadPass","tlInputProductTimeline","tlInputProductStackFocus"];
    private roundOneJson: any;
    private roundTwoJson: any;
    private roundThreeJson: any;
    private showThirdErrorMsg: boolean = false;

    constructor(private fileSaver: FileSaver,private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.resetPassword = this.textEngineService.getText("Password");
        this.exportPassword = this.textEngineService.getText("ExportPassword");
        this.roundOnePassword = this.textEngineService.getText("RoundOnePassword");
        this.roundTwoPassword = this.textEngineService.getText("RoundTwoPassword");
        this.roundThreePassword = this.textEngineService.getText("RoundThreePassword");

        this.dataStore.getData("RoundOneJsonData",true).then((val)=>{
            this.roundOneJson = val;
        });
        this.dataStore.getData("RoundTwoJsonData",true).then((val)=>{
            this.roundTwoJson = val;
        });
        this.dataStore.getData("RoundThreeJsonData",true).then((val)=>{
            this.roundThreeJson = val;
        });

        self.onRouteChange();
        this.routeObserver = this.router.events.subscribe((val) => {
            if(val instanceof NavigationEnd){
                self.onRouteChange();
            }            
        });
    }

    onRouteChange(){
        this.showMetrics = this.router.url.indexOf("intPlanStratergy") > 0 || this.router.url.indexOf("endScreen") > 0 ? false : true;
        this.currentRoute = this.router.url;
        this.currentYear = this.calcService.getValue("tlInputRound");
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
        // this.wobblerRef.initializeWobblers();
    }

    showPasswordModalRef(value){
        if((value) && value.toString().indexOf('R') != -1){
            value = parseInt(this.currentYear) + 2;
            this.hideSubmitModal();
        }
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

    resetRound(){
        this.showLoader = true;
        this.utils.resetInputs(this.arrResetInputs, this.calcService).then(()=>{
            this.showLoader = false;
            this.hideResetModal();
        });
    }

    onPasswordSubmit(){       
        if(this.password == this.resetPassword && this.passwordModalNumber == 1){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            this.resetData();
        }else if(this.password == this.exportPassword && this.passwordModalNumber == 2){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            //Export
            // this.exportDecisions();
            this.showExportModal();
        }else if(this.password == this.roundOnePassword && this.passwordModalNumber == 3){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            //Export
            // this.exportDecisions();
            this.moveToNextRound();
        }else if(this.password == this.roundTwoPassword && this.passwordModalNumber == 4){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            //Export
            // this.exportDecisions();
            this.moveToNextRound();
        }else if(this.password == this.roundThreePassword && this.passwordModalNumber == 5){
            this.showPasswordErrorMessage = false;
            this.passwordModalRef.hide();
            //Export
            // this.exportDecisions();
            this.moveToNextRound();
        }else{
            this.showPasswordErrorMessage = true;
        }

        this.password = "";
    }

    updatePassModalNumber(value){
        this.passwordModalNumber = value;
    }

    startRoundTwo(){
        this.roundOneJson = JSON.stringify(this.calcService.getAllInputsState(true,this.arrAllInputs));
        this.dataStore.setData("RoundOneJsonData",this.roundOneJson,true);
        this.calcService.setValue("tlInputRound",2).then(()=>{
            localStorage.setItem("roundOneJsonData",this.roundOneJson)
            this.dataStore.setData(EVENTS.ROUND_ONE_COMPLETE,true,true);
            this.dataStore.setData(EVENTS.INTRO_COMPLETE,false,true);
            this.router.navigate(["/intro"]);
        });
    }

    startRoundThree(){
        this.roundTwoJson = JSON.stringify(this.calcService.getAllInputsState(true,this.arrAllInputs));
        this.dataStore.setData("RoundTwoJsonData",this.roundTwoJson,true);
        this.calcService.setValue("tlInputRound",3).then(()=>{
            this.dataStore.setData(EVENTS.ROUND_TWO_COMPLETE,true,true);
            this.dataStore.setData(EVENTS.INTRO_COMPLETE,false,true);
            this.router.navigate(["/intro"]);
        });
    }

    endRoundThree(){
        this.roundThreeJson = JSON.stringify(this.calcService.getAllInputsState(true,this.arrAllInputs));
        this.dataStore.setData("RoundThreeJsonData",this.roundThreeJson,true);
        this.calcService.setValue("tlInputRound",4).then(()=>{
            this.dataStore.setData(EVENTS.ROUND_THREE_COMPLETE,true,true);
            // this.exportDecisions();
            this.router.navigate(["/endScreen"]);
        });
    }

    moveToRoundTwo(){
        this.router.navigate(["/intPlan"]);
    }

    moveToNextRound(){
        this.hideSubmitModal();

        if(this.currentYear == 1){
            this.startRoundTwo();
        }else if(this.currentYear == 2){
            this.startRoundThree();
        }else if(this.currentYear == 3){
            this.endRoundThree();
        }
    }

    showSubmitOrErrorModal(){
        if(this.currentYear == 1){
            let checkValue = parseInt(this.calcService.getValue("tlInputV2MOMValue5Rank"));
            if(checkValue < 10 || checkValue > 40){
                this.showErrorModal();
            }else{
                this.showSubmitModal();
            }
        }else if(this.currentYear == 2){
            let checkValue1 = this.calcService.getValue("tlInputBudgetValidationY1");
            let checkValue2 = this.calcService.getValue("tlInputBudgetValidationY2");
            //Values Need to be FALSE
            if(checkValue1 || checkValue2){
                this.showErrorModal();
            }else{
                this.showSubmitModal();
            }
        }else if(this.currentYear == 3){
            let checkValue1 = this.calcService.getValue("tlInputBudgetValidationY1");
            let checkValue2 = this.calcService.getValue("tlInputBudgetValidationY2");
            let allScenarioCompleted:boolean = true, noOfScenarios = 7;
            let scenariosToRun = ["2","4","5","6","8"]
            for(let i = 0; i < scenariosToRun.length;i++){
                let str = "xxScenario"+scenariosToRun[i]+"Run";
                let status:boolean = (this.calcService.getValue(str)) ? this.calcService.getValue(str) : false;
                if(!status){
                    allScenarioCompleted = false;
                    this.showThirdErrorMsg = true;
                    break;
                }
            }
            if(allScenarioCompleted){
                this.showThirdErrorMsg = false;
            }
            //Values Need to be FALSE
            if(checkValue1 || checkValue2 || !allScenarioCompleted){
                this.showErrorModal();
            }else{
                this.showSubmitModal();
            }
        }else{
            this.showSubmitModal();
        }
    }

    exportDecisions(){
        var modelState ={};
        modelState = this.combineData(JSON.parse(this.roundOneJson) , JSON.parse(this.roundTwoJson) , JSON.parse(this.roundThreeJson));
        var teamNo = this.calcService.getValue("tlInputTeamNumber");
        var fileNamePrefix = "SalesforceMA_";
        // var fileName = fileNamePrefix + "T" + teamNo + "R" + teamYear + ".csv";
        var fileName = fileNamePrefix + "T" + teamNo + ".csv";
        var delim = ',';
        var seprater = "_!"
        this.fileSaver.fileSaveAs(fileName, modelState, delim,"", true, seprater);
    }

    exportRoundOneDecisions(){
        var modelState = this.roundOneJson;
        var teamNo = this.calcService.getValue("tlInputTeamNumber");
        var round = 1;
        var fileNamePrefix = "SalesforceMA_";
        // var fileName = fileNamePrefix + "T" + teamNo + "R" + teamYear + ".csv";
        var fileName = fileNamePrefix + "T" + teamNo + "_R" + round + ".csv";
        var delim = ',';
        this.fileSaver.fileSaveAs(fileName, modelState, delim);
    }
    exportRoundTwoDecisions(){
        var modelState = this.roundTwoJson;
        var teamNo = this.calcService.getValue("tlInputTeamNumber");
        var round = 2;
        var fileNamePrefix = "SalesforceMA_";
        // var fileName = fileNamePrefix + "T" + teamNo + "R" + teamYear + ".csv";
        var fileName = fileNamePrefix + "T" + teamNo + "_R" + round + ".csv";
        var delim = ',';
        this.fileSaver.fileSaveAs(fileName, modelState, delim);
    }
    exportRoundThreeDecisions(){
        var modelState = this.roundThreeJson;
        var teamNo = this.calcService.getValue("tlInputTeamNumber");
        var round = 3;
        var fileNamePrefix = "SalesforceMA_";
        // var fileName = fileNamePrefix + "T" + teamNo + "R" + teamYear + ".csv";
        var fileName = fileNamePrefix + "T" + teamNo + "_R" + round + ".csv";
        var delim = ',';
        this.fileSaver.fileSaveAs(fileName, modelState, delim);
    }

    combineData(jsonObj1,jsonObj2,jsonObj3):any{
        var output = {}
        for (var i in jsonObj1) {
            let str = jsonObj1[i] + "_!" + jsonObj2[i] + "_!" + jsonObj3[i];
            if(str){
                output[i] = str;
            }
        }
        return output;
    }
}
