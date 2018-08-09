import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { DataStore } from '../../utils/utils';
import { LinkStatus } from '../link/linkstatus';

export const MEETING_STATUS = "meetingstatus";
export const MESSAGE_STATUS = "messagestatus";

@Component({
    selector: 'messages-dashboard',
    templateUrl: './messages-dashboard.html',
    styleUrls: ['./messages-dashboard.css'],
    providers: []
})

export class MessagesDash implements OnInit, OnDestroy {
    private content = {};
    private meetings = {};
    private messages = {};
    private scenes = {};
    private messagesArray = [];
    private meetingsArray = [];
    private feedbackArray = [];
    private meetingStatusSubscription: EventEmitter<any>;
    private messageStatusSubscription: EventEmitter<any>;
    private newMeetingsCount = 0;
    private newMessagesCount = 0;
    private totalMeetings = 0;
    private totalMessages = 0;
    private showBusinessUpdates = 0;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private router: Router, private dataStore: DataStore) { };

    ngOnInit() {
        let self = this;
        this.fetchSceneData();
        this.initializeStatus();
        this.meetingStatusSubscription = this.dataStore.getObservableFor(MEETING_STATUS).subscribe(status => {
            this.newMeetingsCount = status.getNewLinksCount();
            this.totalMeetings = status.getTotalLinksCount();
            // console.log("New meetings: " + this.newMeetingsCount);
            self.showBusinessUpdates = (self.newMeetingsCount || 0) + (self.newMessagesCount || 0);
        });
        this.messageStatusSubscription = this.dataStore.getObservableFor(MESSAGE_STATUS).subscribe(status => {
            this.newMessagesCount = status.getNewLinksCount();
            this.totalMessages = status.getTotalLinksCount();
            self.showBusinessUpdates = (self.newMeetingsCount || 0) + (self.newMessagesCount || 0);
            // console.log("New messages: " + this.newMessagesCount);
        });
        // this.router.events.subscribe((event) => {
        //     if (event instanceof NavigationEnd) {
        //         this.fetchSceneData();
        //     }
        // });
    }

    ngOnDestroy() {
        this.meetingStatusSubscription.unsubscribe();
        this.messageStatusSubscription.unsubscribe();
    }

    initializeStatus() {
        this.dataStore.setData(MEETING_STATUS, new LinkStatus());
        this.dataStore.setData(MESSAGE_STATUS, new LinkStatus());
    }

    fetchSceneData() {
        this.scenes = this.textengineService.getScenes();

        for (var key in this.scenes) {
            var localScene = [];
            for (var property in this.scenes[key]) {
                if (this.scenes[key].hasOwnProperty(property)) {
                    localScene[property] = this.scenes[key][property];
                }
            }
            if(localScene["ID"]){
                localScene["decisionRange"] = "tlInput" + localScene["ID"];
                // localScene["roundRange"] = "tlInputRound" + localScene["ID"];
                localScene["readRange"] = "tlInputRead"+localScene["ID"];
                localScene["triggerRange"] = "tlOutputTrigger" + localScene["ID"];
            }


            if (localScene["PageType"] == "Read Update") {
                this.messagesArray.push(localScene);
            } else if ((localScene["PageType"] == "SingleSelect") || (localScene["PageType"] == "MultiSelect")) {
                this.meetingsArray.push(localScene);
            } else if (localScene["PageType"] == "Initiative") {
                // processed in corporate.ts
            } else if (localScene["PageType"] == "Feedback") {
                this.feedbackArray.push(localScene);
            } else {
                console.log("Unknown Page Type: " + localScene["PageType"]);
            }
        }

        this.messagesArray = this.messagesArray.reverse();
        this.meetingsArray = this.meetingsArray.reverse();
    }
}