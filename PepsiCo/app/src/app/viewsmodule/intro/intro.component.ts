import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataStore, EVENTS } from '../../utils';
// import { CalcService } from '../../calcmodule';
import { CalcService } from '@btsdigital/ngx-isomer-core';

const KEY_NUM_9 = 57; // used to import obals
const KEY_NUM_1 = 49; // used to navigate to holdScreen

@Component({
    selector: 'isma-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent implements OnInit {
    private currentYear: number;
    isReady: Boolean = false;
    showPlanningTool:boolean = true;
    @ViewChild('importbalances') importBalancesEl;
    @ViewChild('importsuccess') importsuccessModalRef;

    @HostListener('document:keyup', ['$event'])
    onKeypress($event) {
        // console.log("Key pressed :: " + $event.keyCode, $event.shiftKey, $event.ctrlKey);
        if ($event.keyCode === KEY_NUM_9 && $event.shiftKey && $event.ctrlKey) {
            this.importBalances();
        }
        if ($event.keyCode === KEY_NUM_1 && $event.shiftKey && $event.ctrlKey) {
            // this.navigateToHoldScreen();
        }
    }

    constructor(private router: Router, private calcService: CalcService, private dataStore: DataStore) { }

    ngOnInit() {
        this.currentYear = +this.calcService.getValue("tlInputTeamYear");
        this.isReady = this.calcService.isApiReady();
        // this.currentYear = 1;
    }

    navigateToNextPage() {
        this.dataStore.setData(EVENTS.INTRO_COMPLETE, true, true);
        this.dataStore.setData(EVENTS.REINITIALIZE_WOBBLERS,true,true);

        // const planningData = this.dataStore.getData(EVENTS['PLANNING_COMPLETE'], true);
        // if (planningData !== null && this.showPlanningTool) {
        //     planningData.then((ready) => {
        //         if (ready == 'true') {
        //             this.router.navigate(['/region','vetera']);
        //         } else {
        //             this.router.navigate(['/planningtool']);
        //         }
        //     });
        // }else{
        //     this.dataStore.setData(EVENTS.PLANNING_COMPLETE, true, true);
        //     this.router.navigate(['/region','vetera']);
        // }
        let planningData = this.calcService.getValue("tlOutputStrategyCommit") == "0" ? false : true;
        if(!this.showPlanningTool || this.currentYear != 1){
            this.calcService.setValue("tlOutputStrategyCommit","1");
            this.router.navigate(['/region','vetera']);
        }else{
            if(planningData){
                this.router.navigate(['/region','vetera']);
            }else{
                this.router.navigate(['/planningtool']);
            }
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
                this.calcService.setValue("tlOutputStrategyCommit","1");
                self.showPlanningTool = false;
                self.showSuccessAlert();
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
    }

    navigateToHoldScreen(){
        this.router.navigate(['/holdScreen']);
    }
}
