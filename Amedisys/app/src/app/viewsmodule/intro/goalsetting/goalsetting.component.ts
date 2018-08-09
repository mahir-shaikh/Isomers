import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../../calcmodule/calc.service';
import { TextEngineService } from '../../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart } from '@angular/router';
import { MESSAGES_OUTLET, Utils, Dictionary, APP_READY, INTRO_COMPLETE, DataStore, LOCATION } from '../../../utils/utils';
// import { Observable } from 'rxjs';

@Component({
    selector: 'goal-setting',
    templateUrl: './goalsetting.html',
    styleUrls: ['./goalsetting.css']
})
export class GoalSettingComponent implements OnInit, OnDestroy {

    private routeAnimation: string;
    private isInput:boolean = true;
    private subscription:any;
    private tlOutputGoalComplete: number;
    private tlOutputGoalTooAmbitious: number;
    private tlOutputGoalAmbitious: number;
    private tlOutputGoalAcceptable: number;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private route: ActivatedRoute, private router: Router, private utils: Utils, private dataStore: DataStore) { };

    ngOnInit() {
        this.routeAnimation = "flipSimple";
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.validateStatus();
        });
        this.validateStatus();
    }

    onClose() {
        // this.router.navigateByUrl(DASHBOARD_PATH);
    }

    validateStatus() {
        this.tlOutputGoalComplete = this.calcService.getValue('tlOutputGoalComplete');
        this.tlOutputGoalTooAmbitious = this.calcService.getValue('tlOutputGoalTooAmbitious');
        this.tlOutputGoalAmbitious = this.calcService.getValue('tlOutputGoalAmbitious');
        this.tlOutputGoalAcceptable = this.calcService.getValue('tlOutputGoalAcceptable');
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    navigate() {
        // [routerLink] = "['/intro','email']
        // this.router.navigateByUrl(DASHBOARD_PATH);
        // let url = ['intro', 'goalsetting'];
        this.calcService.setValue('tlInputLocation',1);
        let url = ['password'];

        // if (this.currentPage === "overview") {
        // showdashboard 
        //this.dataStore.setData(APP_READY, true);
        // mark introviewed - and persist
        //this.dataStore.setData(INTRO_COMPLETE, true, true);

        // }
        this.router.navigate(url);
    }

    onSubmit() {
        this.routeAnimation = (this.routeAnimation === 'flipSimple') ? 'flipReverse' : 'flipSimple';
        this.isInput = !this.isInput;
        // if (this.routeAnimation === 'customFlipOutY') {
        //     setTimeout(() => {
        //         this.routeAnimation = '';
        //     }, 750);
        // }
    }
}
