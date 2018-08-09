import { Component, Input, OnInit, AfterViewInit, EventEmitter, ViewChild, OnDestroy, HostListener, Output } from '@angular/core';
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

export class WobblerComponent implements OnInit, OnDestroy {

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
    private reviewAnswer = -1;
    private selectedValue = -1;
    private feedback = "";    
    private ansName = "";    
    private wobblerManualMode = false;
    private wobblerTimeMS = 10000;
    private wobblerTimer;
    private wobblerInterval;
    private wobblerCurrentTime = 0;
    private currentYear = 1;
    private readOnly: boolean = false;
    private showFeedback: boolean = false;
    private isInfo: boolean = false;
    private currentTab:number = 0;
    private reviewVisible:boolean = false;
    private animate:boolean = false;
    @ViewChild('wobblerModal') public wobblerModal: ModalDirective;
    @ViewChild('wobblerOverrideModal') public wobblerOverrideModal: ModalDirective;
    @ViewChild('reviewModal') public reviewModal: ModalDirective;
    private subscriber: EventEmitter<any>;
    @Output() updateListEvent:EventEmitter<any> = new EventEmitter<any>();
    private reinitializeEventListener: EventEmitter<any>;


    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.subscriber = this.calcService.getObservable().subscribe(() => {
            // let year = self.calcService.getValue("tlInputTeamYear");
            // if(year != this.currentYear){
            //     self.initializeWobblers();
            //     self.updateWobblerList();
            // }
        });

        this.reinitializeEventListener = this.dataStore.getObservableFor(EVENTS.REINITIALIZE_WOBBLERS).subscribe(() => {
            self.initializeWobblers();
            self.updateWobblerList();
        });
    }

    ngOnDestroy(){
        this.subscriber.unsubscribe();
        this.reinitializeEventListener.unsubscribe();
    }

    initializeWobblers() {
        let wobblers = this.textEngineService.getMeetings();
        let index = 0;
        this.wobblerLoc = -1;
        this.wobblersArray = [];
        this.currentYear = this.calcService.getValue("tlInputTeamYear");

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
            localScene["wobblerRange"] = "tlInputWobbler"+localScene["rangesuffix"];
            localScene["wobblerCode"] = parseInt(localScene["ID"].substr(localScene["ID"].length - 2));
            // localScene["wobblerCode"] = parseInt(localScene["ID"].substr(1,1));
            localScene["isViewed"] = (this.calcService.getValue(localScene["wobblerRange"]) == 0) || (this.calcService.getValue(localScene["wobblerRange"]) == undefined) ? false : true ;
            this.isViewed = localScene["isViewed"];

            if(this.isViewed){
                let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
                let ans:string = this.calcService.getValue(localScene["wobblerRange"]).toString();
                //Value 2A for Wobbler 2.... extract A.... Convert to 1,2,3....
                // let letter = ans.replace(localScene["wobblerNum"],"").toLowerCase();
                // let letterPosition = alphabet.indexOf(letter)+1;
                let letterPosition = ans.slice(ans.length-1);
                if(letterPosition != ""){
                    localScene["feedback"] = localScene["alt"+letterPosition+"_feedback"];
                    localScene["reviewAnswer"] = letterPosition;                    
                    localScene["selectedValue"] = letterPosition;
                    localScene["ansName"] = localScene["alt"+letterPosition+"_name"];
                }
            }

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
            console.log(localScene["PageType"]);
            if(localScene["PageType"] == "InfoUpdate"){
                this.isInfo = true;
            }

        }

        this.wobblerCurrentTime = 0;
        var modelTime = this.calcService.getValue("tlInputWobblerCurrentTime");
        if (modelTime) {
            this.wobblerCurrentTime = parseInt(modelTime.replace(/,/g,''));
        }

        // if (this.wobblerLoc != -1) {
        //      this.wobbler = this.wobblersArray[this.wobblerLoc];
        //     let timeToWobbler = (parseInt(this.wobbler.time)*10 - this.wobblerCurrentTime);
        //     console.log ("timeToWobbler: " + timeToWobbler + ", " + this.wobblerCurrentTime + ", " + this.calcService.getValueForYear("tlInputWobblerCurrentTime", "tlInputTeamYear"));
        //     this.wobblerTimer = setTimeout(this.showWobbler.bind(null, this, this.wobbler.ID), timeToWobbler);
        //     this.wobblerInterval = setInterval(this.updateTime.bind(null, this), 10000);
        // }
        if (this.wobblerLoc != -1) {
            this.wobbler = this.wobblersArray[this.wobblerLoc];
            let timeToWobbler = (this.wobblerManualMode ? -1 : (parseInt(this.wobbler.time)*1000 - this.wobblerCurrentTime));

            this.wobblerTimer = (timeToWobbler > 0 ? setTimeout(this.showWobbler.bind(null, this, this.wobbler.ID), timeToWobbler) : null);
            this.wobblerInterval = setInterval(this.updateTime.bind(null, this), this.wobblerTimeMS);
        }

    }

    // make sure we're in a decision/report section that can actually display a wobbler
    // change according to your navigations
    isGoodWobblerLocation () {
        let currentRoute = this.router.url;
        let goodLocation = ((currentRoute != "/intro") &&
                            // (currentRoute != "/overview") &&
                            (currentRoute.indexOf("/holdScreen") == -1));

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
            self.wobblerTimer = setTimeout(self.showWobbler.bind(null, self, wobblerID), 10);
            return;
        }
        clearTimeout(self.wobblerInterval);
 
        // self.isViewed = false;
        self.answer = -1;

        self.name = self.wobbler.name;
        self.narrative = self.wobbler.narrative;
        self.isViewed = self.calcService.getValue(self.wobbler["wobblerRange"]) == 0 ? false : true;

        if(self.isViewed){
            let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
            let ans:string = self.calcService.getValue(self.wobbler["wobblerRange"]).toString();
            //Value 2A for Wobbler 2.... extract A.... Convert to 1,2,3....
            // let letter = ans.replace(self.wobbler["wobblerNum"],"").toLowerCase();
            // let letterPosition = alphabet.indexOf(letter)+1;
            let letterPosition = ans.slice(ans.length-1);

            if(letterPosition != ""){
                self.wobbler["feedback"] = self.wobbler["alt"+letterPosition+"_feedback"];
                self.feedback = self.wobbler.feedback;
                self.wobbler["reviewAnswer"] = letterPosition;
                self.reviewAnswer = self.wobbler.reviewAnswer;
                self.wobbler["selectedValue"] = self.reviewAnswer;
                self.selectedValue = self.reviewAnswer;
                self.wobbler["ansName"] = self.wobbler["alt"+self.reviewAnswer+"_name"];
                self.ansName = self.wobbler["ansName"];
            } 

            self.animate = true;           
        }else{
            self.animate = false;
        }

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
        if (self.wobbler["type"] == "InfoUpdate") {
            self.isViewed = true;
            self.readOnly = true;
        }

        self.choices = [];
        let i=1;
        while (self.wobbler["alt"+i] != undefined) {
            self.choices.push({
                "name": self.wobbler["alt"+i+"_name"],
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
            this.feedback = this.wobbler["alt"+this.answer+"_feedback"];
            this.wobbler["feedback"] = this.wobbler["alt"+this.answer+"_feedback"];
            this.ansName = this.wobbler["alt"+this.answer+"_name"];
            this.wobbler["ansName"] = this.wobbler["alt"+this.answer+"_name"];
            this.reviewAnswer = this.answer;
            this.wobbler["reviewAnswer"] = this.answer;
            this.selectedValue = this.answer;
            this.wobbler["selectedValue"] = this.answer;
     
           // this.wobbler["wobblerCode"] =this.wobbler["type"] == "InfoUpdate"?this.wobbler["wobblerCode"]:this.wobbler["wobblerCode"]+this.wobbler["alt"+this.answer];
           this.wobbler["wobblerCode"] =this.wobbler["type"] == "InfoUpdate"?this.wobbler["wobblerCode"]:this.wobbler["wobblerCode"]+ "0" + this.answer;
             
    
           //this.wobbler["wobblerCode"] = this.wobbler["wobblerCode"]+this.wobbler["alt"+this.answer];
            this.calcService.setValue (this.wobbler["wobblerRange"], this.wobbler["wobblerCode"]);
            console.log (this.wobbler["wobblerRange"] + " set to " + this.wobbler["wobblerCode"]);
            this.wobbler["isViewed"] = true;
            this.isViewed = true;

            this.wobblerLoc = this.wobblerLoc + 1;
            
            //this.showFeedback=false;
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

            this.animate = true;            
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

    public getWobblerList(){
        this.wobblersOverrideList = [];
        for (let i=0; i<this.wobblersArray.length; i++) {
            var localScene = [];
            localScene["name"] = this.wobblersArray[i].name;
            localScene["isViewed"] = this.wobblersArray[i].isViewed;
            if(this.wobblersArray[i].isViewed){
                this.wobblersOverrideList.push(localScene);
            }
        }
        return this.wobblersOverrideList;
    }

    public showEvent(override){
        this.wobblerLoc = override;
        if (this.wobblersArray[this.wobblerLoc] != undefined) {
            this.wobbler = this.wobblersArray[this.wobblerLoc];
            let timeToWobbler = 1000;
            console.log ("new wobbler: " + this.wobblerLoc + ", " + timeToWobbler);

            this.wobblerTimer = setTimeout(this.showWobbler.bind(null, this, this.wobbler.ID), timeToWobbler);
            this.wobblerCurrentTime = 0;
            // this.calcService.setValue("tlInputWobblerCurrentTime_R"+this.currentYear, this.wobblerCurrentTime);
            // this.calcService.setValue("tlInputWobblerCurrentTime", this.wobblerCurrentTime);
            this.wobblerInterval = setInterval(this.updateTime.bind(null, this), this.wobblerTimeMS);
        }
    }

    toggleReview() { 
        this.reviewVisible = !this.reviewVisible;
    }

    showReviewModal(){
        this.reviewVisible = true;
        this.reviewModal.show();
    }

    hideReviewModal(){
        this.reviewModal.hide();
        this.reviewVisible = false;
    }

    updateWobblerList(){
        this.updateListEvent.emit();
    }
}