import { Component, ElementRef, Input, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Utils, DASHBOARD_PATH, DataStore, PersistTabState } from '../../utils/utils';
import { Dictionary } from '../../utils/dictionary';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { TAB_SWITCHED_EVENT, PLANNING_TOOL_TABS } from '../planningtool/planning-tool';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'staffing',
    templateUrl: './staffing.component.html',
    styleUrls: ['./staffing.component.css'],
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

export class StaffingComponent implements OnInit, OnDestroy, PersistTabState {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    
    @Input() animState:states;
    @Input() activeIndex:number;
    private staffingRows:Array<Number> = [1,2,3,4,5,6,7,8,9,10];
    private localScene:any;

    private el: HTMLElement;
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    private modelSubscription: Subscription;
    private tabSubscription: EventEmitter<any>;
    // private activeIndex: number;
    private showIcon1:boolean = true;
    private showIcon2:boolean = true;
    private showIcon:Array<boolean> = [true, true];
    // private decisionValue:number; 
    // private disabled:boolean = false;
    private disableDropdown:Array<boolean> = [false, false];
    private newEmpDropDown = [['OPEN','RN', 'LPN', 'PT', 'PTA', 'OT', 'OTA'], ['OPEN','RN', 'LPN', 'PT', 'PTA', 'OT', 'OTA']];
    private sampleDropdown = ['OPEN','RN', 'LPN', 'PT', 'PTA', 'OT', 'OTA'];
    private currentYear:number;
    private meetingAttended: Array<boolean> = [];
    private allMeetingsAttended: boolean = false;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private utils: Utils, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef, private dataStore: DataStore) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";
        this.localScene = this.textengineService.getSpecificTabScenes("STAFF");
        this.subscription = activatedRoute.params.subscribe(
            (param: any) => {
                this.animState = param['state'];
                let activeIndex = (param['centerid']) ? param['centerid'] : null;
                this.setActiveIndex(activeIndex);
            });
    }

    ngOnInit() {
        let self = this;
        self.currentYear = Number(self.calcService.getValue("xxRound"));
        // self.activeIndex = self.dataStore.getData(PLANNING_TOOL_TABS.STAFFING);
        // if (self.activeIndex === null) {
            // self.activeIndex = 1;
        // }
        for(let i=10; i<(10+self.currentYear); i++){
            self.staffingRows[i] = i+1;
        }

        for(let i = 10; i< (this.staffingRows.length -1); i++){
            let lastYear = Number(this.currentYear) - 1;
            if(lastYear >= 1){
                let emp = this.calcService.getValue('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Dis_R'+lastYear);
                if(emp != "Open"){
                    this.calcService.setValueForYear('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Dis',emp,"xxRound");
                    this.calcService.setValueForYear('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Status',this.calcService.getValue('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Status_R'+lastYear),"xxRound");
                }
            }
                
        }
        // self.calcService.setValueForYear('tlInputLOB'+self.activeIndex+'Cln'+(currentRow)+'Dis',oldEmp,"xxRound");
        // self.calcService.setValueForYear('tlInputLOB'+self.activeIndex+'Cln'+(currentRow)+'Dis',this.calcService.getValue('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Status_r'+lastYear),"xxRound");
        self.onModelChange();
        self.modelSubscription = self.calcService.getObservable().subscribe(() => {
            self.onModelChange();
        });

        this.tabSubscription = this.utils.getObservable(TAB_SWITCHED_EVENT).subscribe((index) => {
            self.onModelChange();
        });

    }

    onModelChange(){
        // this.disabled = this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"StaffDecisionMade","xxRound") != 1 ? false: true;
        let self = this;
        this.newEmpDropDown = [['OPEN','RN', 'LPN', 'PT', 'PTA', 'OT', 'OTA'], ['OPEN','RN', 'LPN', 'PT', 'PTA', 'OT', 'OTA']];
        let useUpdatedEmpDropDown: boolean = false;
        for(let i = 0; i< this.staffingRows.length; i++){
            let lastYear = Number(this.currentYear) - 1,
                previouslyAttended = false,
                currentlyAttended = false;

            for(let j = 1; j<=lastYear;j++){
                previouslyAttended = (this.calcService.getValue("tlInputLOB"+this.activeIndex+"Cln"+(i+1)+"Mtng_R"+j) != 0);
            }
            currentlyAttended = (this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"Cln"+(i+1)+"Mtng", "xxRound") != 0);
            this.meetingAttended[i] = previouslyAttended || currentlyAttended;
            if(i >= 10){
                let discipline = this.calcService.getValueForYear('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Dis', "xxRound"),
                    empStatus = this.calcService.getValueForYear('tlInputLOB'+this.activeIndex+'Cln'+this.staffingRows[i]+'Status', "xxRound");

                // enable staffmeeting icon
                if(discipline != "Open" && empStatus !="Open"){
                    this.showIcon[i - 10] = false;
                    // this.changeDetectorRef.detectChanges();
                }else{
                    this.showIcon[i - 10] = true;
                }

                // remove previously selected candidate
                if(self.currentYear > 1){
                    let currentRow = (i + 1);
                    this.newEmpDropDown[i-10] = useUpdatedEmpDropDown ? this.newEmpDropDown[i-10] : this.sampleDropdown;
                    while(currentRow >= 11){
                        let oldEmp = self.calcService.getValue('tlInputLOB'+self.activeIndex+'Cln'+(currentRow)+'Dis_R' + lastYear);
                        if(oldEmp != "Open"){
                            self.newEmpDropDown[i-10] = self.newEmpDropDown[i-10].filter((emp, index) => {
                                return emp != oldEmp;
                            });
                            this.disableDropdown[currentRow - 11] = true;
                        }

                        let newEmp = self.calcService.getValue('tlInputLOB'+self.activeIndex+'Cln'+(currentRow)+'Dis_R' + this.currentYear);
                        if(newEmp != "Open" && self.meetingAttended[i]){
                            for(let index in self.newEmpDropDown){
                                useUpdatedEmpDropDown = true;
                                self.newEmpDropDown[index] = self.newEmpDropDown[index].filter((emp, index) => {
                                    return emp != newEmp;
                                });                                
                            }
                            this.disableDropdown[currentRow - 11] = true;
                        }

                        currentRow--;
                    }
                }

                // disable dropdowns
                this.disableDropdown[i - 10] = (this.calcService.getValueForYear("tlInputLOB"+this.activeIndex+"Cln"+this.staffingRows[i]+"Mtng", "xxRound") != 0);
            }
        }

        this.allMeetingsAttended = (this.calcService.getValueForYear('tlOutputLOB'+this.activeIndex+'MeetingCountRemaining', "xxRound") == 0)
    }

    // onSubmit(){
    //     this.calcService.setValueForYear(("tlInputLOB"+this.activeIndex+"StaffDecisionMade"),1,"xxRound");
    // }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.modelSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
    }


    setActiveIndex(index: string):any {
        if (index === null) return;
        this.activeIndex = Number(index);
        this.dataStore.setData(PLANNING_TOOL_TABS.STAFFING, Number(index));

        this.onModelChange();
    }

}
