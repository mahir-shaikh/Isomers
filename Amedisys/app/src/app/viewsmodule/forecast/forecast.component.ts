import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { DASHBOARD_PATH, DataStore, PersistTabState } from '../../utils/utils';
import { Dictionary } from '../../utils/dictionary';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { PLANNING_TOOL_TABS } from '../planningtool/planning-tool';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.css'],
    providers: [],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({transform: 'translateX(-100%)'})),
            transition('void => in', [
                animate(500, style({transform: 'translateX(0)'}))
            ]),
            transition('in => void', [
                animate (500, style({transform: 'translateX(-100%)'}))
            ])
        ])
      ]
})

export class ForecastComponent implements OnInit, OnDestroy, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    @Input() activeIndex:number;
    
    @Input() animState:states;

    private el: HTMLElement;
    private observer:any = null;
    private values = '';
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    private decisionValue:number; 
    private disabled:boolean = false;
    private modelSubscription:any;
    // private activeIndex: number;
    // private tlInputGlobalExpansionDropValue:string = "";
    // private tlInputSFCoverageDropValue:string = "";
    // private tlInputProd5Ftr1DropValue:string = "";
    // private tlInputProd4PriceDropValue:string = "";
    // private tlInputProd3ChannelIncentDropValue:string = "";

    //MAX VALUES ARRAY FORMAT = [[Riverside_R1],[Riverside_R2]],[[Pleasantville_R1],[Pleasantville_R2]]
    private arrMaxValues = [[["160","30","90","40","10","25"],["180","35","105","50","15","35"]],[["175","10","10","55","10","10"],["200","20","20","75","20","20"]]];
    private currentRound: number;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef, private dataStore: DataStore) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => {
                this.animState = param['state'];
                let activeIndex = (param['centerid']) ? param['centerid'] : null;
                this.setActiveIndex(activeIndex);
                this.getCurrentRound();
            });
    }

    ngOnInit() {

        // this.activeIndex = this.dataStore.getData(PLANNING_TOOL_TABS.FORECAST);
        // if (this.activeIndex === null) {
            // this.activeIndex = 1;
        // }

        this.decisionValue = this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"ForecastDecisionMade","xxRound");
        if(this.decisionValue==1){
            this['disabled'] = true;
        }else{
            this['disabled'] = false;
        }

        this.modelSubscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });
        // this.toggleClass(true);
    }

    onSubmit(){
        this.calcService.setValueForYear(("tlInputLOB"+this.activeIndex+"ForecastDecisionMade"),1,"xxRound");
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.modelSubscription.unsubscribe();
    }

    onModelChange(){
        this.decisionValue = this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"ForecastDecisionMade","xxRound");
        if(this.decisionValue==1){
            this['disabled'] = true;
        }else{
            this['disabled'] = false;
        }
    }

    setActiveIndex(index: string):any {
        if (index === null) return;
        this.activeIndex = Number(index);
        this.dataStore.setData(PLANNING_TOOL_TABS.FORECAST, Number(index));
        this.decisionValue = this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"ForecastDecisionMade","xxRound");
        if(this.decisionValue==1){
            this['disabled'] = true;
        }else{
            this['disabled'] = false;
        }
    }

    getCurrentRound(){
        this.currentRound = this.calcService.getValue("xxRound");
    }
}
