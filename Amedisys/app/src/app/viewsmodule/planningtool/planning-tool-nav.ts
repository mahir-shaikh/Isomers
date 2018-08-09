import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, UrlTree } from '@angular/router';
import { DASHBOARD_PATH, PLANNING_OUTLET, DataStore, DISABLE_DASH } from '../../utils/utils';

@Component({
    selector: 'planning-tool-nav',
    templateUrl: './planning-tool-nav.html',
    styleUrls: ['./planning-tool-nav.css'],
    providers: []
})

export class PlanningToolNav implements OnInit, OnDestroy {
    @Input() childRoute;
    @Input() textKey;
    @Input() metrics:any = {};
    @Input() tabId:number;
    @Input() disableConditionRef: string; 
    @Input() disableConditionValue: string;
    private link: string;
    private myInterval:number = 0;
    private noWrapSlides:boolean = true;
    private noTransition:boolean = false;
    private metricsArr = [];
    private dashDisabledObserver:any;
    private disabled: boolean = false;
    private calcObserver;
    private disableDashValue = false;

    constructor(private router: Router, private dataStore: DataStore, private calcService: CalcService) { };

    ngOnInit() {
        

        // this.disabled = !((enabled === false) ? enabled : (this.dataStore.getData(DISABLE_DASH) === null) ? enabled : this.dataStore.getData(DISABLE_DASH));

        this.dashDisabledObserver = this.dataStore.getObservableFor(DISABLE_DASH).subscribe(isDisabled => {
            this.disableDashValue = isDisabled;
            this.enableDisableDashItems();
        });

        this.calcObserver = this.calcService.getObservable().subscribe(() => {
            this.enableDisableDashItems();
        });

        this.enableDisableDashItems();
    }

    private enableDisableDashItems() {
        let enabled = true, conditionValue = "1"; // comparing against current year - we want to disable some links only for the first year
        if (this.disableConditionRef) {
            if (this.disableConditionValue) {
                // check for multiple condition values
                let localConditionValue = this.disableConditionValue; 
                let commaLoc = localConditionValue.indexOf(",");
                if (commaLoc != -1) {
                    let index = 0;
                    while ((commaLoc != -1) && (index < 10)) {
                        index++;
                        let localCond = localConditionValue.slice(0, commaLoc);
                        enabled = enabled && (this.calcService.getValue(this.disableConditionRef) === localCond) ? false : true;                        
                        localConditionValue = localConditionValue.slice(commaLoc+1);
                        commaLoc = localConditionValue.indexOf(",");
                        console.log ("planningConditional1: " + localConditionValue + " - " + commaLoc + " - " + enabled);
                    }
                    enabled = enabled && (this.calcService.getValue(this.disableConditionRef) === localConditionValue) ? false : true;                        
                    console.log ("planningConditional2: " + localConditionValue + " - " + commaLoc + " - " + enabled);
                } else {
                    conditionValue = this.disableConditionValue;
                    enabled = (this.calcService.getValue(this.disableConditionRef) === conditionValue) ? false : true;
                }
            } else {
                enabled = (this.calcService.getValue(this.disableConditionRef) === conditionValue) ? false : true;
            }
        }

        if (this.disableDashValue) { // if disableDash is set to true so force disable the dashboard
            this.disabled = true; 
        }
        else { // set whether nav-item is enabled/disabled conditionally
            this.disabled = !enabled; 
        }
    }

    ngOnDestroy() {
        this.dashDisabledObserver.unsubscribe();
        this.calcObserver.unsubscribe();
    }

    onClick() {
        // if dash is disabled do nothing so return
        if (this.disabled) return;

        let dashboardPath = DASHBOARD_PATH;
        let options = {
            outlets: { }
        };

        options.outlets[PLANNING_OUTLET] = "planning/" + this.childRoute;
        if (this.tabId) {
            options.outlets[PLANNING_OUTLET] += "/" + this.tabId;
        }
        let navParam = [dashboardPath, options];
        console.log ("navigating: " + options.outlets[PLANNING_OUTLET]);
        this.router.navigate(navParam);
    }
}
