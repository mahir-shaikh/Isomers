import { Component, ElementRef, Input, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { DASHBOARD_PATH, Dictionary, DataStore, PersistTabState } from '../../utils/utils';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { PLANNING_TOOL_TABS } from '../planningtool/planning-tool';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'reports',
    templateUrl: './reports.html',
    styleUrls: ['./reports.css'],
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
      ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Reports implements OnInit, OnDestroy, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    
    @Input() animState:states;

    private el: HTMLElement;
    private observer:any = null;
    private values = '';
    private activeIndex: number = 0;
    private subscription: Subscription;
    private calcObserver: Subscription;
    private currentYear:number;
    private lastYear:number;

    // Reports
    // private tlInputPlant1UnitsChange=0;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, private dataStore: DataStore, private cdRef: ChangeDetectorRef) {
        var self = this;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => this.animState = param['state']
        );
    }

    onClick($event){
        $event.stopPropagation();
        this.animState = "in";
        // this.changeDetectorRef.detectChanges();
    }

    ngOnInit() {
        
        this.el = this.elRef.nativeElement;

        let infoWrapper = this.el.querySelector('[data-content-wrapper]');
        if (infoWrapper) {
            let classNames = infoWrapper.className;
            classNames = classNames.replace('slideOut', 'slideIn');
            infoWrapper.className = classNames;
        }


        this.activeIndex = this.dataStore.getData(PLANNING_TOOL_TABS.REPORTS);
        if (this.activeIndex === null) {
            this.activeIndex = 0;
        }

        this.calcObserver = this.calcService.getObservable().subscribe(() => {
            this.cdRef.markForCheck();
        });

        this.currentYear = parseInt(this.calcService.getValue("xxRound"));
        this.lastYear = this.currentYear-1;
        // get data from model to initialize local variables

        // Reports
        // this.tlInputPlant1UnitsChange = this.calcService.getValue("tlInputPlant1UnitsChange");

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.calcObserver.unsubscribe();
    }

    onEnter($event, tlInputRange, boxValue) {
        $event.stopPropagation();

        let self:any = this;
        if (typeof boxValue == 'string') {
            boxValue = boxValue.replace(/\,/g,'');
        }
        self.calcService.setValue(tlInputRange, boxValue);
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        this.dataStore.setData(PLANNING_TOOL_TABS.REPORTS, index);
    }

}
