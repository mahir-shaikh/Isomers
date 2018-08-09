import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Utils, DASHBOARD_PATH, DataStore, PersistTabState } from '../../utils/utils';
import { Dictionary } from '../../utils/dictionary';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { PLANNING_TOOL_TABS } from '../planningtool/planning-tool';
import { locale } from 'core-js/library/web/timers';
import { TAB_SWITCHED_EVENT } from '../planningtool/planning-tool';

export const MAXTABS = 3;

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'carecenter',
    templateUrl: './carecenter.component.html',
    styleUrls: ['./carecenter.component.css'],
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

export class CareCenterComponent implements OnInit, OnDestroy, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    @Input() scaler: number = 1;
    
    @Input() animState:states;

    private lineOfBusiness:number = 1;
    private observer:any = null;
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;

    // 'activeIndex' within the carecenter represents the tab index
    // within the indivdual tabs, 'activeIndex' repreesnts the lineOfBusiness
    private activeIndex: number;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private utils: Utils, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef, private dataStore: DataStore) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => {
                this.animState = param['state'];
                let activeIndex = (param['tabid']) ? param['tabid'] : null;
                let centerIndex = (param['centerid']) ? param['centerid'] : null;
                if (centerIndex != null) {
                    this.lineOfBusiness = centerIndex;
                }
                this.setActiveIndex(activeIndex);
            });
    }

    ngOnInit() {
        this.activeIndex = this.dataStore.getData(PLANNING_TOOL_TABS.CARECENTER);
        if (this.activeIndex === null) {
            this.activeIndex = 1;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    setActiveIndex(index: string):any {
        if (index === null) return;
        // console.log ("moving departments (tabs): " + this.activeIndex + " to " + Number(index));
        this.activeIndex = Number(index);
        this.dataStore.setData(PLANNING_TOOL_TABS.CARECENTER, Number(index));
 
        // need to multiply these two since we have 2 sets of each tab and need to differentiate
        this.utils.getObservable(TAB_SWITCHED_EVENT).emit(((this.lineOfBusiness-1) * MAXTABS) + this.activeIndex);
   }
}