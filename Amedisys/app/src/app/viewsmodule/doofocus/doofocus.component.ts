import { Component, ElementRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
// import { NumberFormattingPipe } from '../../calcmodule/number-formatting.pipe';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { DASHBOARD_PATH, DataStore, PersistTabState } from '../../utils/utils';
import { Dictionary } from '../../utils/dictionary';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { PLANNING_TOOL_TABS } from '../planningtool/planning-tool';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'doofocus',
    templateUrl: './doofocus.component.html',
    styleUrls: ['./doofocus.component.css'],
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

export class DooFocusComponent implements OnInit, OnDestroy, OnChanges, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    @Input() scaler: number = 1;

    // 'activeIndex' represents the lineOfBusiness within the individual tabs
    // within the carecenter, 'activeIndex' represents the indivdual tabs
    @Input() activeIndex: number;
    
    @Input() animState:states;

    private localScene = [];
    private el: HTMLElement;
    private observer:any = null;
    private values = ''; 
    private formattedVal:number;
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    // private activeIndex: number;
    private minArray = [];
    private initiatives = {};
    private initiativesArray = []; 
    private totalChecked:number =0;
    private maxCheck:number; 
    // private decisionValue:number; 
    private init:boolean = false;
    // private disabled:boolean = false;
    private modelSubscription:any;
    
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef, private dataStore: DataStore) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => {
                this.animState = param['state'];
                let activeIndex = (param['centerid']) ? param['centerid'] : null;
                this.setActiveIndex(activeIndex);
            });
    }

    onSelect($event, rowID) {
        // console.log ("onSelect: " + rowID + ", " + rowID.slice(-2) + ", " + this.activeIndex);
        // determine ID number
        let initNum = parseInt(rowID.slice(-2));
        let lob = this.activeIndex;
        let year = this.calcService.getValue("xxRound");
        let cleared = 0;
        // loop through SpecProg ranges
        for (let i=1; i<=4; i++) {
            let currentInit = this.calcService.getValueForYear("tlInputLOB"+lob+"SpecProg"+i, "xxRound");
            // console.log ("checking to clearing: " + ("tlInputLOB"+lob+"SpecProg"+i+"_R"+year) + ", " + currentInit)
            // check if already set
            if (currentInit == initNum) {
                console.log ("clearing: " + currentInit);
                this.calcService.setValueForYear("tlInputLOB"+lob+"SpecProg"+i, 0, "xxRound");
                cleared = 1;
            }
        }
        if (initNum > 0) {
            this.initiativesArray[initNum - 1]["isChecked"] = !cleared;
        }
        if (!cleared) {
            // determine next open spot
            for (let i=1; i<=4; i++) {
                let currentInit = this.calcService.getValueForYear("tlInputLOB"+lob+"SpecProg"+i, "xxRound");
                // console.log ("checking to setting: " + ("tlInputLOB"+lob+"SpecProg"+i) + ", " + currentInit)
                if (currentInit == 0) {
                    this.calcService.setValueForYear("tlInputLOB"+lob+"SpecProg"+i, initNum, "xxRound");
                    break;
                }
            }
        }
    }

    ngOnChanges(){}

    ngOnInit() {
        this.init = true;
        let localScene = this.textengineService.getSpecificTabScenes('DOOINIT');
        for(var key in localScene){
               this.localScene.push(localScene[key]);
            }

        this.initiatives = this.textengineService.getSpecificTabScenes('DOOINIT');
        
        this.modelSubscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });

        for (let key in this.initiatives) {
            let localScene = [];
            for (let property in this.initiatives[key]) {
                if (this.initiatives[key].hasOwnProperty(property)) {
                    localScene[property] = this.initiatives[key][property];
                }
            }
            localScene["index"] = localScene["ID"].substr(4);
            localScene["isChecked"] = 0;
            localScene["isSelected"] = 0;
            localScene["isEnabled"] = true;

            this.initiativesArray.push(localScene);
        }

        // this.activeIndex = this.dataStore.getData(PLANNING_TOOL_TABS.DOOFOCUS);
        // if (this.activeIndex === null) {
            // this.activeIndex = 1;
        // }
        this.maxCheck = this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"MaxSpecProg", "xxRound");
        this.onModelChange();
    }

    onModelChange(){
        let lob = this.activeIndex,
            disableOption,
            lastYear = Number(this.calcService.getValue("xxRound")) - 1;
        this.totalChecked = 0;
        for (let i=0; i<this.initiativesArray.length; i++) {
            this.initiativesArray[i].isChecked = 0;
            this.initiativesArray[i].isEnabled = true;
        }
        for (let i=1; i<=this.maxCheck; i++) {
            let currentInit = parseInt(this.calcService.getValueForYear("tlInputLOB"+lob+"SpecProg"+i, "xxRound"));
            // console.log ("setting: " + currentInit);
            if(lastYear > 0){                
                disableOption = Number(this.calcService.getValue("tlInputLOB"+lob+"SpecProg"+i+"_R"+lastYear));
                if (disableOption > 0) {
                    this.initiativesArray[disableOption - 1].isEnabled = false;
                    this.initiativesArray[disableOption - 1].isChecked = 1;
                }
            }
            if (currentInit > 0 && !isNaN(currentInit)) {
                this.initiativesArray[currentInit-1].isChecked = 1;
                this.totalChecked++;
            }
        }
        if(this.totalChecked == this.maxCheck){
            for (let i=0; i<this.initiativesArray.length; i++) {
                if (this.initiativesArray[i].isChecked != 1) {
                    this.initiativesArray[i].isEnabled = false;
                }
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.modelSubscription.unsubscribe();
    }


    setActiveIndex(index: string):any {
        if (index === null) return;
        // console.log ("moving care centers: " + this.activeIndex + " to " + Number(index));
        this.activeIndex = Number(index);
        this.dataStore.setData(PLANNING_TOOL_TABS.DOOFOCUS, Number(index));
        this.onModelChange();
    }
}