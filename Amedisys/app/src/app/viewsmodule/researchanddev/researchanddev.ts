import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { DASHBOARD_PATH, Dictionary, PersistTabState, DataStore } from '../../utils/utils';
//import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { PLANNING_TOOL_TABS } from '../planningtool/planning-tool';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'researchanddev',
    templateUrl: './researchanddev.html',
    styleUrls: ['./researchanddev.css'],
    providers: [],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({transform: 'translateX(-100%)'})),
            transition('out => in', [
                animate(500, style({transform: 'translateX(0)'}))
            ]),
            transition('in => out', [
                animate (500, style({transform: 'translateX(-100%)'}))
            ])
        ])
      ]
})

export class ResearchAndDev implements OnInit, OnDestroy, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    
    @Input() animState:states;

    private el: HTMLElement;
    private observer:any = null;
    private values = '';
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    private activeIndex: number;

    // Research & Development - Enterprise
    private tlInputProd1Func=0;
    private tlInputProd1Ftr2=0;
    private tlInputProd1Ftr3=0;
    private tlInputProd2Ftr1=0;
    private tlInputProd2Ftr2=0;
    private tlInputProd2Ftr3=0;
    private tlInputProd3Ftr2=0;

    // Research & Development - Consumer
    private tlInputProd3Ftr1=0;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef, private dataStore: DataStore) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => {
                this.animState = param['state']; 
                let activeIndex = (param['tabid']) ? param['tabid'] : null;
                this.setActiveIndex(activeIndex);
            });
    }

    onClick($event){
        $event.stopPropagation();
        this.animState = "in";
        this.changeDetectorRef.detectChanges();
    }

    // onClose($event) {
    //     $event.stopPropagation();
    //     this.animState = "out";
    //     this.changeDetectorRef.detectChanges();
    //     this.router.navigate(['/dashboard']);
    // }

    ngOnInit() {
        
        this.el = this.elRef.nativeElement;

        let infoWrapper = this.el.querySelector('[data-content-wrapper]');
        if (infoWrapper) {
            let classNames = infoWrapper.className;
            classNames = classNames.replace('slideOut', 'slideIn');
            infoWrapper.className = classNames;
        }

        this.activeIndex = this.dataStore.getData(PLANNING_TOOL_TABS.RESEARCHANDDEV);
        if (this.activeIndex === null) {
            this.activeIndex = 0;
        }

        // get data from model to initialize local variables

        // Research & Development - Enterprise
        this.tlInputProd1Func = this.calcService.getValue("tlInputProd1Func");
        this.tlInputProd1Ftr2 = this.calcService.getValue("tlInputProd1Ftr2");
        this.tlInputProd1Ftr3 = this.calcService.getValue("tlInputProd1Ftr3");
        this.tlInputProd2Ftr1 = this.calcService.getValue("tlInputProd2Ftr1");
        this.tlInputProd2Ftr2 = this.calcService.getValue("tlInputProd2Ftr2");
        this.tlInputProd2Ftr3 = this.calcService.getValue("tlInputProd2Ftr3");

        // Research & Development - Consumable
        this.tlInputProd3Ftr1 = this.calcService.getValue("tlInputProd3Ftr1");
        this.tlInputProd3Ftr2 = this.calcService.getValue("tlInputProd3Ftr2");

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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
        this.dataStore.setData(PLANNING_TOOL_TABS.RESEARCHANDDEV, Number(index));
    }

}
