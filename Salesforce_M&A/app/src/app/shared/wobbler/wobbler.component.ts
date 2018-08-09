import { Component, Input, OnInit, AfterViewInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service';

@Component({
    selector: 'wobbler',
    templateUrl: 'wobbler.component.html',
    styleUrls: ['./wobbler.component.styl']
})

export class WobblerComponent implements OnInit {

    private selfRef;
    private wobblersArray = [];
    private wobblersOverrideList = [];
    private wobbler:any;
    private wobblerLoc = -1;
    private override = -1;
    private name = "";
    private narrative = "";
    private choices = [];
    private isViewed = false;
    private answer = -1;
    private feedback = "";    
    private wobblerManualMode = false;
    private wobblerTimeMS = 10000;
    private wobblerTimer;
    private wobblerInterval;
    private wobblerCurrentTime = 0;
    private currentYear = 1;
    private readOnly: boolean = false;
    @ViewChild('wobblerModal') public wobblerModal: ModalDirective;
    @ViewChild('wobblerOverrideModal') public wobblerOverrideModal: ModalDirective;

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {

    }
    initializeWobblers() {
        let wobblers = this.textEngineService.getMeetings();
        let index = 0;
        this.wobblerLoc = -1;
        this.wobblersArray = [];
        this.currentYear = 3//this.calcService.getValue("tlInputTeamRound");

        console.log ("wobblers found ...");
        for (var key in wobblers) {
            var localScene = [];
            for (var property in wobblers[key]) {
                if (wobblers[key].hasOwnProperty(property)) {
                    localScene[property] = wobblers[key][property];
                }
            }

            localScene["wobblerNum"] = 0;

            localScene["wobblerNum"] = parseInt(localScene["ID"].substr(localScene["ID"].length - 2));
            localScene["wobblerRange"] = "tlInputWobbler"+localScene["wobblerNum"];
            localScene["wobblerCode"] = localScene["ID"].substr(1,(localScene["ID"].length - 2 - 1));
            localScene["isViewed"] = false;

            if (parseInt(localScene["round"]) == this.currentYear) {
                console.log (localScene["ID"]);
                this.wobblersArray.push(localScene);

                let completed = (this.calcService.getValue(localScene["wobblerRange"]) != "0");
                localScene["isViewed"] = completed;
                if (!completed && (this.wobblerLoc == -1)) {
                    this.wobblerLoc = index;
                }
                index++;
            }
        }

        this.wobblerCurrentTime = 0;
        var modelTime = this.calcService.getValue("tlInputWobblerCurrentTime");
        if (modelTime) {
            this.wobblerCurrentTime = parseInt(modelTime.replace(/,/g,''));
        }

        if (this.wobblerLoc != -1) {
            this.wobbler = this.wobblersArray[this.wobblerLoc];
            let timeToWobbler = (this.wobblerManualMode ? -1 : (parseInt(this.wobbler.time)*10 - this.wobblerCurrentTime));

            this.wobblerTimer = (timeToWobbler > 0 ? setTimeout(this.showWobbler.bind(null, this, this.wobbler.ID), timeToWobbler) : null);
            this.wobblerInterval = setInterval(this.updateTime.bind(null, this), this.wobblerTimeMS);
        }
    }

    // make sure we're in a decision/report section that can actually display a wobbler
    // change according to your navigations
    isGoodWobblerLocation () {
        let currentRoute = this.router.url;
        let goodLocation = ((currentRoute != "/intro") &&
                            (currentRoute != "/intPlanStratergy"));

        return goodLocation;
    }

    updateTime(self) {
        if (self.isGoodWobblerLocation()) {
            self.wobblerCurrentTime += self.wobblerTimeMS;
            // self.calcService.setValue("tlInputWobblerCurrentTime", self.wobblerCurrentTime);
        }
    }

    showWobbler(self, wobblerID) {
        let conditional = false;
        let index = 1;

        if (self == undefined) {
            self = this.selfRef;
        }
        clearTimeout(self.wobblerTimer);

        if (!self.isGoodWobblerLocation()) {
            // set a 10 second delay to check again
            self.wobblerTimer = setTimeout(self.showWobbler.bind(null, self, wobblerID), 10000);
            return;
        }
        clearTimeout(self.wobblerInterval);
 
        self.isViewed = false;
        self.answer = -1;

        self.name = self.wobbler.name;
        self.narrative = self.wobbler.narrative;

        if (self.narrative == "conditional") {
            self.narrative = "";

            let result = 0;
            let cond = self.wobbler["narrative" + index + "_conditional"];
            while ((cond != undefined) && (index < 100)) {
                result = self.calcService.getValue(cond);
                if (result == 1) {
                    conditional = true;
                    self.narrative = self.wobbler["narrative" + index];
                    break;
                }
                index++;
                cond = self.wobbler["narrative" + index + "_conditional"];
            }
            self.isViewed = true;
            self.readOnly = true;
        }

        self.choices = [];
        let i=1;
        while (self.wobbler["alt"+i] != undefined) {
            self.choices.push({
                "value": self.wobbler["alt"+i],
                "label": self.wobbler["alt"+i+"_narrative"],
                "classLabel": (self.wobbler["alt"+i].toLowerCase() + "-button")
            })
            i++;
        }
        self.wobblerModal.show();
    }

    hideWobbler(confirmed:boolean = false) {
        this.wobblerModal.hide();
    }

    onSelect(index) {
        if (!this.isViewed) {
            this.answer = index+1;
        }
    }

    onSubmitWobbler() {
        if (this.answer != -1 || this.readOnly) {
            // this.feedback = this.wobbler["alt"+this.answer+"_feedback"];
            // this.wobbler["wobblerCode"] = this.wobbler["wobblerCode"]+this.wobbler["alt"+this.answer];
            // this.calcService.setValue (this.wobbler["wobblerRange"], this.wobbler["wobblerCode"]);
            // console.log (this.wobbler["wobblerRange"] + " set to " + this.wobbler["wobblerCode"]);
            this.wobbler["isViewed"] = true;
            this.isViewed = true;

            this.wobblerLoc = this.wobblerLoc + 1;
            

            // for(;this.wobblersArray[this.wobblerLoc] != undefined;this.wobblerLoc++){
            //     if(this.wobblersArray[this.wobblerLoc].isConditional){
            //         let tlInput = this.calcService.getValue("tlINputInvokeConditionalWobbler");
            //         if(tlInput == this.wobblersArray[this.wobblerLoc].wobblerRange){
            //             break;
            //         }else{
            //             continue;
            //         }
            //     }else{
            //         break;
            //     }
            // }


            if (this.wobblersArray[this.wobblerLoc] != undefined) {
                this.wobbler = this.wobblersArray[this.wobblerLoc];
                let timeToWobbler = (this.wobblerManualMode ? -1 : parseInt(this.wobbler.time)*1000);

                this.wobblerTimer = (timeToWobbler>0) ? setTimeout(this.showWobbler.bind(null, this, this.wobbler.ID), timeToWobbler) : null;
                this.wobblerCurrentTime = 0;
                // this.calcService.setValue("tlInputWobblerCurrentTime_R"+this.currentYear, this.wobblerCurrentTime);
                // this.calcService.setValue("tlInputWobblerCurrentTime", this.wobblerCurrentTime);
                this.wobblerInterval = setInterval(this.updateTime.bind(null, this), this.wobblerTimeMS);
            }
            if(this.readOnly){
                this.hideWobbler();
                this.readOnly = false;
            }
        }
    }

    showWobblerOverride() {
        if (this.isGoodWobblerLocation()) {
            this.wobblerOverrideModal.show();
        }
    }

    hideWobblerOverride(activate) {
        if (activate == 0) {
            console.log ("not activating wobbler :(");
        } else if ((activate == 1) && (this.override >= 0)) {
            console.log ("Wobbler AWAY: " + this.override + ", " + this.wobblersArray[this.override].name);

            this.wobblerLoc = this.override;
            if (this.wobblersArray[this.wobblerLoc] != undefined) {
                this.wobbler = this.wobblersArray[this.wobblerLoc];
                let timeToWobbler = 5000;
                console.log ("new wobbler: " + this.wobblerLoc + ", " + timeToWobbler);

                this.wobblerTimer = setTimeout(this.showWobbler.bind(null, this, this.wobbler.ID), timeToWobbler);
                this.wobblerCurrentTime = 0;
                // this.calcService.setValue("tlInputWobblerCurrentTime_R"+this.currentYear, this.wobblerCurrentTime);
                // this.calcService.setValue("tlInputWobblerCurrentTime", this.wobblerCurrentTime);
                this.wobblerInterval = setInterval(this.updateTime.bind(null, this), this.wobblerTimeMS);
            }
        }
        this.wobblerOverrideModal.hide();
    }

    public activateWobblerOverride(){
        console.log ("wobbler override");
        this.wobblersOverrideList = [];
        for (let i=0; i<this.wobblersArray.length; i++) {
            var localScene = [];
            localScene["name"] = this.wobblersArray[i].name;
            localScene["isViewed"] = this.wobblersArray[i].isViewed;
            this.wobblersOverrideList.push(localScene);
        }
        this.showWobblerOverride();
    }

    @HostListener('document:keyup', ["$event"])
    onkeyup(evt: KeyboardEvent) {
        if ((evt.keyCode == 50) && (evt.ctrlKey == true)) {
            console.log ("wobbler override");
            this.wobblersOverrideList = [];
            for (let i=0; i<this.wobblersArray.length; i++) {
                var localScene = [];
                localScene["name"] = this.wobblersArray[i].name;
                localScene["isViewed"] = this.wobblersArray[i].isViewed;
                this.wobblersOverrideList.push(localScene);
            }
            this.showWobblerOverride();
        }
    }
}