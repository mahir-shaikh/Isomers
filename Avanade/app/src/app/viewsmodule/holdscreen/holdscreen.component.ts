import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { DataStore, EVENTS, Utils} from '../../utils';

@Component({
    selector: 'holdscreen',
    templateUrl: './holdscreen.component.html',
    styleUrls: ['./holdscreen.component.styl'],
})

export class HoldScreenComponent implements OnInit, OnDestroy {
    private mode:number = 0;
    private showLoader:boolean = false;
    private showPasswordErrorMessage: boolean = false;
    private actualPassword: string = "";
    private cancelPassword: string = "cancel";
    private password: string = "";
    private exportRangeNames: Array<string> = ["tlInputTeamNumber", "tlInputTeamName", "tlInputTeamRound", "tlInputProd1Price", "tlInputProd1V2Price", "tlInputProd1V3Price", "tlInputProd1Growth", "tlInputProd1V2Growth", "tlInputProd1V3Growth", "tlInputBusAEmp4HrsCurrProj", "tlInputBusAEmp4HrsCurrProjV2", "tlInputBusAEmp4HrsCurrProjV3", "tlInputBusAEmp3HrsCurrProj", "tlInputBusAEmp3HrsCurrProjV2", "tlInputBusAEmp3HrsCurrProjV3", "tlInputBusAEmp2HrsCurrProj", "tlInputBusAEmp2HrsCurrProjV2", "tlInputBusAEmp2HrsCurrProjV3", "tlInputBusAEmp1HrsCurrProj", "tlInputBusAEmp1HrsCurrProjV2", "tlInputBusAEmp1HrsCurrProjV3", "tlInputBusAEmp9HrsCurrProj", "tlInputBusAEmp9HrsCurrProjV2", "tlInputBusAEmp9HrsCurrProjV3", "tlInputCompDevBusAV1", "tlInputCompDevBusAV2", "tlInputCompDevBusAV3", "tlInputEmp4BusAHire", "tlInputEmp3BusAHire", "tlInputEmp2BusAHire", "tlInputEmp9BusAHire", "tlInputEmp4BusADismiss", "tlInputEmp3BusADismiss", "tlInputEmp2BusADismiss", "tlInputEmp9BusADismiss", "tlInputEntWFHire", "tlInputEntWFDismiss", "tlInputEmp4Training", "tlInputEmp3Training", "tlInputEmp2Training", "tlInputEntWFTraining", "tlInputEmp4TrainingBudget", "tlInputEmp3TrainingBudget", "tlInputEmp2TrainingBudget", "tlInputEntWFTrainingBudget", "tlInputEmp4SalaryLvl", "tlInputEmp3SalaryLvl", "tlInputEmp2SalaryLvl", "tlInputProd1Adv", "tlInputEntSvcsSalesSupportLevelPrac1", "tlInputEntSvcsSalesSupportLevelPrac2", "tlInputEntSvcsSalesSupportLevelPrac3", "tlInputIndustryEminence", "tlInputInternalassets", "tlInputSpecProg1", "tlInputSpecProg2", "tlInputSpecProg3", "tlInputSpecProg4", "tlInputSpecProg5", "tlInputSpecProg6", "tlInputSpecProg7", "tlInputWobbler1", "tlInputWobbler2", "tlInputWobbler3", "tlInputWobbler4"];
    private importRangeNames: Array<string> = ["tlInputWobbler1", "tlInputWobbler2", "tlInputWobbler3", "tlInputWobbler4"];    
    @ViewChild('importbalances') importBalancesEl;
    @ViewChild('importsuccess') importsuccessModalRef;

    constructor(private calcService: CalcService, private textEngineService : TextEngineService, private router: Router, private dataStore: DataStore, private utils: Utils) { };

    ngOnInit() {
        this.actualPassword = this.textEngineService.getText("Round2Password");
        

        // Temporary
        this.mode = 0;
        // this.calcService.exportData(true, this.exportRangeNames);
        this.mode = 1

    }


    ngOnDestroy() {

    }

    onPasswordSubmit(){
        if (this.password == this.actualPassword) {
            // this.nextRound();
            this.importBalances();
        } else if(this.password == this.cancelPassword) {
            // route back to planner
            this.router.navigate(["/overview"]);
        } else {
            this.showPasswordErrorMessage = true;
        }
    }

    nextRound(){
        this.showLoader = true;
        let year = this.calcService.getValue("tlInputTeamYear");
        if(year == 2){
        // this.calcService.setValue("tlInputTeamYear",2).then(() => {
            this.dataStore.setData(EVENTS.INTRO_COMPLETE,false,true);
            this.dataStore.setData(EVENTS.ROUND_ONE_COMPLETE,true,true);
            // this.dataStore.setData(EVENTS.REINITIALIZE_WOBBLERS,true,true);
            this.showLoader = false;
            this.router.navigate(["/intro"]);
        // });            
        }

        if(year == 3){
        // this.calcService.setValue("tlInputTeamYear",2).then(() => {
            this.dataStore.setData(EVENTS.INTRO_COMPLETE,false,true);
            this.dataStore.setData(EVENTS.ROUND_TWO_COMPLETE,true,true);
            this.dataStore.setData(EVENTS.REINITIALIZE_WOBBLERS,true,true);
            this.showLoader = false;
            this.router.navigate(["/intro"]);
        // });        
        }
    }

    importBalances(){
        this.importBalancesEl.showFileChooser();
    }

    onFileLoaded(jsonOb) {
        let self = this;
        console.log("Loaded file", jsonOb);
        this.showLoader = true;
        return new Promise((resolve, reject) => {
            try {
                this.calcService.appendDataToModel(jsonOb).then(() => {
                    this.utils.resetInputs(this.importRangeNames, this.calcService).then(()=>{
                    self.showLoader = false;
                    self.showSuccessAlert();
                })
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
        this.nextRound();
    }

    exportData(){
        this.calcService.exportData(true, this.exportRangeNames);
    }
}
