 import { Component, ElementRef, OnInit, OnDestroy, Input, OnChanges, ViewChild } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Utils, Dictionary, TUTORIALS_IMAGES, TUTORIALS_MAP } from '../../utils/utils';
// import { Chooser } from './chooser';

@Component({
    selector: 'staffmeeting',
    templateUrl: './staffmeeting.component.html',
    styleUrls: ['./staffmeeting.component.css']
})

export class Staffmeeting implements OnInit, OnDestroy {
    @Input() scene:any;
    @Input() textRef:string="";
    @Input() activeINdex:number;
    @Input() rowNo:number;
    @Input() checkForText:boolean = false;
    private showSingleSelect:boolean = true;
    private showReadUpdate:boolean = true;
    private meeting:any;
    private showModal:boolean = false;
    private dsiableTextarea:boolean = false;
    private showMeeting:boolean = false;
    @ViewChild('meetingModal') meetingModalRef;
    private modelSubscription:any;
    private isThisMeetingAttended:boolean = false;
    private previouslyAttended:boolean = false;
    private imageHeader = "";
    
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private elRef: ElementRef, private route: ActivatedRoute, private router: Router, private utils: Utils) { };

    ngOnInit() {
        let self = this;
        this.showMeeting = (this.calcService.getValueForYear("tlInputLOB"+this.activeINdex+"Cln"+this.rowNo+"Mtng", "xxRound") != 0) && (this.calcService.getValueForYear('tlOutputLOB'+this.activeINdex+'MeetingCountRemaining', "xxRound") == 0);

        this.dsiableTextarea = this.showMeeting;
        this.modelSubscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });
        this.onModelChange();
    }

    onModelChange(){
        // this.showMeeting = (this.calcService.getValueForYear("tlInputLOB"+this.activeINdex+"Cln"+this.rowNo+"Mtng", "xxRound") != 0);
        // this.dsiableTextarea = this.showMeeting;
    }

    onSelect($event) {
        let name = this.calcService.getValueForYear("tlOutputLOB"+this.activeINdex+"Cln"+this.rowNo+"Name", "xxRound"),
            z=0,
            checkOnce = false,
            allMeetingAttended = (this.calcService.getValueForYear('tlOutputLOB'+this.activeINdex+'MeetingCountRemaining', "xxRound") == 0),
            lastYear = Number(this.calcService.getValue("xxRound")) - 1
        if(lastYear >= 1){
            this.previouslyAttended = this.calcService.getValue("tlInputLOB"+this.activeINdex+"Cln"+this.rowNo+"Mtng_R"+lastYear) != 0;
        }
        for(let key in this.scene){
            let compareName = this.scene[key]['name'];
            if(compareName.trim() == name.trim()){
                this.meeting = this.scene[key];
                if(this.checkForText && z==0){
                    let nonExperienced = this.calcService.getValueForYear("tlOutputLOB"+this.activeINdex+"Cln11NonExperienced", "xxRound"),
                     experienced = this.calcService.getValueForYear("tlOutputLOB"+this.activeINdex+"Cln11Experienced", "xxRound");
                    if(experienced == 1){
                        // break;
                    }else if(nonExperienced == 1){
                            z=1;
                            checkOnce = true;
                            // break;

                    }
                }
                if(z == 1 && checkOnce){
                    checkOnce = false;
                    continue;
                }
                // this.meeting = this.scene[key];
                break;
            }
        }
        this.showMeeting = allMeetingAttended ? true : (this.calcService.getValueForYear("tlInputLOB"+this.activeINdex+"Cln"+this.rowNo+"Mtng", "xxRound") != 0);
        this.dsiableTextarea = this.showMeeting;
        this.isThisMeetingAttended = allMeetingAttended && (this.calcService.getValueForYear("tlInputLOB"+this.activeINdex+"Cln"+this.rowNo+"Mtng", "xxRound") == 0);
        this.imageHeader = (((this.meeting["image"] != undefined) && (this.meeting["image"] != "")) ? "assets/images/" + this.meeting["image"] : "");
        this.showModal = true;
    }

    ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }

    hideAlert(submit:boolean = false){
        if(submit){
            this.calcService.setValueForYear("tlInputLOB"+this.activeINdex+"Cln"+this.rowNo+"Mtng", 1, "xxRound");
        }
        this.showModal = false;
    }
}
