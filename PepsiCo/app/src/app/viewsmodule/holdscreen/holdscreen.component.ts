import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
// import { CalcService } from '../../shared/external-module';
// import { TextEngineService } from '../../textengine/textengine.service';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';
import { Router } from '@angular/router';
import { DataStore, EVENTS, Utils, FileSaver } from '../../utils';


@Component({
    selector: 'isma-holdscreen',
    templateUrl: './holdscreen.component.html',
    styleUrls: ['./holdscreen.component.styl'],
})

export class HoldScreenComponent implements OnInit, OnDestroy {
    mode: number = 0;
    showLoader: boolean = false;
    private showPasswordErrorMessage: boolean = false;
    private actualPassword: string = '';
    private password: string = '';
    private exportRangeNames: Array<string> = [
        "tlInputTeamNumber", "tlInputTeamName", "tlInputTeamYear",
        "tlInputSWOTs1", "tlInputSWOTs2", "tlInputSWOTs3", "tlInputSWOTs4", "tlInputSWOTs5", 
        "tlInputSWOTw1", "tlInputSWOTw2", "tlInputSWOTw3", "tlInputSWOTw4", "tlInputSWOTw5", 
        "tlInputSWOTo1", "tlInputSWOTo2", "tlInputSWOTo3", "tlInputSWOTo4", "tlInputSWOTo5", 
        "tlInputSWOTt1", "tlInputSWOTt2", "tlInputSWOTt3", "tlInputSWOTt4", "tlInputSWOTt5", 
        "tlInputVision", "tlInputStratName", 
        "tlInputCEO", "tlInputGoals1", "tlInputGoals3", "tlInputGMvet", "tlInputGoals4", "tlInputGoals5", 
        "tlInputGMesc", "tlInputGoals6", "tlInputGoals7", "tlInputSVPops", "tlInputGoals8", "tlInputGoals9", 
        "tlInputSVPrnd", "tlInputGoals10", "tlInputGoals11", "tlInputSVPshared", "tlInputGoals12", "tlInputGoals11", "tlInputStratVetCSD", 
        "tlInputStratVetNCB", "tlInputStratVetFnS", "tlInputStratEdaCSD", "tlInputStratEdaNCB", "tlInputStratEdaFnS", "tlInputStratVetCons", 
        "tlInputStratEdaCons", "tlInputStratVetInnov", "tlInputStratEdaInnov", "tlInputStratVetCust", "tlInputStratEdaCust", 
        "tlInputStratVetComp", "tlInputStratEdaComp", "tlInputVetDiffr1", "tlInputVetDiffr2", "tlInputVetDiffr3", "tlInputEdaDiffr1", 
        "tlInputEdaDiffr2", "tlInputEdaDiffr3", "tlInputCorpDiffr1", "tlInputCorpDiffr2", "tlInputCorpDiffr3", "tlInputProd1Reg1Grth", 
        "tlInputProd3Reg1Grth", "tlInputProd4Reg1Grth", "tlInputProd1Reg1Price", "tlInputProd3Reg1Price", "tlInputProd4Reg1Price", 
        "tlInputProd1Adv", "tlInputProd3Adv", "tlInputProd4Adv", "tlInputProd1Promo", "tlInputProd3Promo", "tlInputProd4Promo", 
        "tlInputEmp1Change", "tlInputReg1ChanLevel", "tlInputProd1Reg2Grth", "tlInputProd3Reg2Grth", "tlInputProd4Reg2Grth", 
        "tlInputProd1Reg2Price", "tlInputProd3Reg2Price", "tlInputProd4Reg2Price", "tlInputProd1AdvR2", "tlInputProd3AdvR2", 
        "tlInputProd4AdvR2", "tlInputProd1PromoR2", "tlInputProd3PromoR2", "tlInputProd4PromoR2", "tlInputEmp2Change", "tlInputReg2ChanLevel", 
        "tlInputInnov1", "tlInputInnov2", "tlInputInnov3", "tlInputInnov4", "tlInputInnov4", "tlInputDisrupt1", "tlInputProd21Ftr4LevelDec", 
        "tlInputProd2Reg1Price", "tlInputProd2Adv", "tlInputProd2Promo1", "tlInputProd2Reg1Units", "tlInputDisrupt2", "tlInputProd22Ftr4LevelDec", 
        "tlInputProd2Reg2Price", "tlInputProd2Adv2", "tlInputProd2Promo2", "tlInputProd2Reg2Units", "tlInputPlant1UnitsChange", "tlInputEmp3Change", 
        "tlInputPlant1Flex", "tlInputProd1Ftr4LevelDec", "tlInputProd3Ftr4LevelDec", "tlInputProd4Ftr4LevelDec", "tlInputRecruitLevel", 
        "tlInputEmpDevLevel", "tlInputITcapAdd", "tlInputLTDebtChange", "tlInputProd1WhatIfUnits", "tlInputProd3WhatIfUnits", 
        "tlInputProd4WhatIfUnits", "tlInputSpecProg1", "tlInputSpecProg2", "tlInputSpecProg3", "tlInputSpecProg4", "tlInputSpecProg5",
        'tlInputWobbler1', 'tlInputWobbler2', 'tlInputWobbler3', 'tlInputWobbler4'];
    private importRangeNames: Array<string> = ['tlInputSpecProg1','tlInputSpecProg2','tlInputSpecProg3','tlInputSpecProg4','tlInputSpecProg5','tlInputInnov1','tlInputInnov2','tlInputInnov3','tlInputInnov4','tlInputWobbler1','tlInputWhatIfActivate','tlInputLTDebtChange','tlInputProd1WhatIfUnits','tlInputProd3WhatIfUnits','tlInputProd4WhatIfUnits'];
    @ViewChild('importbalances') importBalancesEl;
    @ViewChild('importsuccess') importsuccessModalRef;

    constructor(
        private calcService: CalcService,
        private textEngineService: TextService,
        private router: Router,
        private dataStore: DataStore,
        private utils: Utils,
        private fileSaver: FileSaver
        // private ismCalcService: IsomerCalcService
    ) { }

    ngOnInit() {
        this.actualPassword = this.textEngineService.getText('Round2Password');

        // Temporary
        this.mode = 0;
        // this.calcService.exportData(true, this.exportRangeNames);
        this.mode = 1;

    }


    ngOnDestroy() {

    }

    onPasswordSubmit() {
        if (this.password === this.actualPassword) {
            // this.nextRound();
            this.importBalances();
        } else {
            this.showPasswordErrorMessage = true;
        }
    }

    nextRound() {
        this.showLoader = true;
        let year = parseInt(this.calcService.getValue('tlInputTeamYear'));
        this.calcService.setValue('tlInputTeamYear',year+1).then(() => {
            this.dataStore.setData(EVENTS.INTRO_COMPLETE, false, true);
            // this.dataStore.setData(EVENTS.ROUND_ONE_COMPLETE, true, true);
            // this.dataStore.setData(EVENTS.REINITIALIZE_WOBBLERS,true,true);
            this.showLoader = false;
            this.router.navigate(['/intro']);
        });
    }

    importBalances() {
        this.importBalancesEl.showFileChooser();
    }

    onFileLoaded(jsonOb) {
        const self = this;
        console.log('Loaded file', jsonOb);
        this.showLoader = true;
        return new Promise((resolve, reject) => {
            try {
                this.calcService.appendDataToModel(jsonOb).then(() => {
                    // this.updateImportRangeNames();
                    this.utils.resetInputs(this.importRangeNames, this.calcService,false).then(() => {
                        self.showLoader = false;
                        self.showSuccessAlert();
                    });
                    resolve();
                }, reject);
            } catch (err) {
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

    // local export data method to work with ism-calc-service
    exportData() {
        // this.calcService.exportData(true, this.exportRangeNames);
        const modelState = this.getValuesForNamedRages(this.exportRangeNames);
        const teamNo = this.calcService.getValue('tlInputTeamNumber');
        const teamYear = this.calcService.getValue('xxYear');
        this.exportDecisionsOfISM(modelState, teamNo, teamYear);
    }
    // For values from ISM
    exportDecisionsOfISM(modelState, teamNo, teamYear) {
        const self = this;
        const fileNamePrefix = 'PepsiCo_';
        const fileName = fileNamePrefix + 'T' + teamNo + 'Y' + teamYear + '.csv';
        const delim = ',';
        self.fileSaver.fileSaveAs(fileName, modelState, delim);
    }

    // get values of named ranges from ism-calc-service
    getValuesForNamedRages(rangeNames: string[]) {
        const out = {};
        rangeNames.forEach(name => {
            try {
                const val = this.calcService.getValue(name, true);
                out[name] = val;
            } catch (e) {
                // console.log('Cannot get value for : ' + name);
                // cannot get value for cell - so process next cell
            }
        });
        return out;
    }

    updateImportRangeNames(){
        let year = parseInt(this.calcService.getValue('tlInputTeamYear'));
        this.importRangeNames = ['tlInputSpecProg1','tlInputSpecProg2','tlInputSpecProg3','tlInputSpecProg4','tlInputSpecProg5','tlInputInnov1','tlInputInnov2','tlInputInnov3','tlInputInnov4','tlInputWobbler1','tlInputWhatIfActivate','tlInputLTDebtChange','tlInputProd1WhatIfUnits','tlInputProd3WhatIfUnits','tlInputProd4WhatIfUnits'];
        //year 2 gets incremented to 3 after this step. Hence Compare it with 2
        if(year == 2){
            this.importRangeNames = ['tlInputSpecProg1','tlInputSpecProg2','tlInputSpecProg3','tlInputSpecProg4','tlInputSpecProg5','tlInputWobbler1','tlInputWhatIfActivate','tlInputLTDebtChange','tlInputProd1WhatIfUnits','tlInputProd3WhatIfUnits','tlInputProd4WhatIfUnits'];
            let checkRangeNames = ['tlInputInnov1','tlInputInnov2','tlInputInnov3','tlInputInnov4'];
            // let checkRangeNames = ["tlOutputInnov1Reset", "tlOutputInnov2Reset", "tlOutputInnov3Reset", "tlOutputInnov4Reset"];
            for(let i=0; i< checkRangeNames.length; i++){
                let status = this.calcService.getValue(checkRangeNames[i]);
                if(status.indexOf("*") == -1){
                    this.importRangeNames.push(checkRangeNames[i]);
                    // this.importRangeNames.push("tlInputInnov"+(i+1));
                }
            }
        }
    }
}