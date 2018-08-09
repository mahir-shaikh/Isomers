import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import { EOR_FEEDBACK, DataStore, APP_READY, INTRO_COMPLETE, LOCATION, END_OF_ROUND } from '../../utils/utils';

const FTE_REMAINING_REF = "tlOutputEmp1FTERemaining";

@Component({
    selector: 'submit-decisions',
    templateUrl: './submit-decisions.html',
    styleUrls: ['./submit-decisions.css']
})

export class SubmitDecisions implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;
    @Input() trigger: string;
    @Input() yearRef: string;

    private isVisible:boolean = false;
    private ref:string;
    private subscription:any;
    private remainingFTEs: number;
    private simNotComplete = false;
    private errorMessage:string = "";

    constructor(private calcService: CalcService, private router: Router, private dataStore: DataStore, private textEngine:TextEngineService) {}

    ngOnInit() {
        if (this.trigger) {
                this.subscription = this.calcService.getObservable().subscribe(() => {
                    this.checkVisible();
                    this.updateFTEs();
                });
                this.checkVisible();
                this.updateFTEs();
        }
        else {
            // if year ref is not provided keep always visible
            this.isVisible = true;
        }
    }

    checkVisible() {
        this.ref = this.trigger;
        if (this.yearRef) {
            let curYear = this.calcService.getValue(this.yearRef);
            if (curYear) {
                this.ref += "_R" + curYear;
            }
        }
        this.isVisible = (this.calcService.getValue(this.ref) != 0);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateFTEs() {
       let totalDooactionsMade =0;
       for(let i=0;i<8;i++){
           let j = i%4;
           let currentInit = (this.calcService.getValueForYear("tlInputLOB"+(parseInt(""+i/4)+1)+"SpecProg"+(j+1), "xxRound") != 0);
           totalDooactionsMade += Number(currentInit);
       }
       if(totalDooactionsMade < 8){
           this.simNotComplete = true;
           this.errorMessage = this.textEngine.getText("DooActionErrorText");
           return;
       }else{
           this.simNotComplete = !((this.calcService.getValueForYear('tlOutputLOB1MeetingCountRemaining', "xxRound") == 0) && (this.calcService.getValueForYear('tlOutputLOB2MeetingCountRemaining', "xxRound") == 0));
           this.errorMessage = this.simNotComplete? this.textEngine.getText("StaffMeetingErrorText") : "";
           // if(!this.simNotComplete){}
       }
    }

    showAlert() {
        this.childModal.show();
    }

    hideAlert(confirmed:boolean = false) {
        this.childModal.hide();
        // if user has confirmed submit decisions and take user to end of round feedbacks!
        if (confirmed) {
            // set year lookup range for feedbacks

           let xxRound = this.calcService.getValue("xxRound");
           //check doo actions
           this.calcService.setValueForYear("tlInputSubmitted", 1, "xxRound");

           this.dataStore.setData(END_OF_ROUND, true, true);
           this.router.navigate(['/dashboard', EOR_FEEDBACK, { 'outlets': { 'year': xxRound } }]);
        }
    }
}