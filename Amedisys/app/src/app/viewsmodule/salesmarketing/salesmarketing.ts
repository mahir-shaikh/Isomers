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
    selector: 'salesmarketing',
    templateUrl: './salesmarketing.html',
    styleUrls: ['./salesmarketing.css'],
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

export class SalesMarketing implements OnInit, OnDestroy, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    
    @Input() animState:states;

    private el: HTMLElement;
    private observer:any = null;
    private values = '';
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    private activeIndex: number;
    private tlInputGlobalExpansionDropValue:string = "";
    private tlInputSFCoverageDropValue:string = "";
    private tlInputProd5Ftr1DropValue:string = "";
    private tlInputProd4PriceDropValue:string = "";
    private tlInputProd3ChannelIncentDropValue:string = "";

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

    onDrop($event) {
        this.calcService.setValue("tlInputGlobalExpansion", this.tlInputGlobalExpansionDropValue);
        this.calcService.setValue("tlInputSFCoverage", this.tlInputSFCoverageDropValue);
        this.calcService.setValue("tlInputProd5Ftr1", this.tlInputProd5Ftr1DropValue);
        this.calcService.setValue("tlInputProd4Price", this.tlInputProd4PriceDropValue);
        this.calcService.setValue("tlInputProd3ChannelIncent", this.tlInputProd3ChannelIncentDropValue);
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

        this.activeIndex = this.dataStore.getData(PLANNING_TOOL_TABS.SALESANDMARKETING);
        if (this.activeIndex === null) {
            this.activeIndex = 0;
        }

        this.tlInputGlobalExpansionDropValue = this.calcService.getValue("tlInputGlobalExpansion");
        this.tlInputSFCoverageDropValue = this.calcService.getValue("tlInputSFCoverage");
        this.tlInputProd5Ftr1DropValue = this.calcService.getValue("tlInputProd5Ftr1");
        this.tlInputProd4PriceDropValue = this.calcService.getValue("tlInputProd4Price");
        this.tlInputProd3ChannelIncentDropValue = this.calcService.getValue("tlInputProd3ChannelIncent");
        // this.toggleClass(true);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    setActiveIndex(index: string):any {
        if (index === null) return;
        this.activeIndex = Number(index);
        this.dataStore.setData(PLANNING_TOOL_TABS.SALESANDMARKETING, Number(index));
    }

    // onEnter($event, tlInputRange, boxValue) {
    //     $event.stopPropagation();

    //     let self:any = this;
    //     if (typeof boxValue == 'string') {
    //         boxValue = boxValue.replace(/\,/g,'');
    //     }
    //     self.calcService.setValue(tlInputRange, boxValue);
    // }

}
