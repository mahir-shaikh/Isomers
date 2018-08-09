import { Component, Input, OnInit, OnDestroy, EventEmitter, HostListener } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';
import { Utils, DataStore } from '../../utils/utils';
import { MEETING_STATUS, MESSAGE_STATUS } from '../messagesdash/messages-dashboard';
import { LinkStatus } from './linkstatus';

// timer to update the link in messages = 10s
const LINK_UPDATE_INTERVAL = 10000;
const R1_FIRST_CHALLENGE_UPDATE_INTERVAL = 45*60*1000; // 45 mins
const R2_FIRST_CHALLENGE_UPDATE_INTERVAL = 20*60*1000; // 20 mins
const CHALLENGE_UPDATE_INTERVAL = 10*60*1000; // 10 mins
const MESSAGE_UPDATE_INTERVAL = 10000; // 10 secs
export const MESSAGE_LINK_ADDED_EVENT = "messagelinkadded";

const TIME_ELAPSED = "link_time_elapsed";
const KEY_NUM_1 = 49; // used to show next available link


@Component({
    selector: 'message-link',
    templateUrl: './link.html',
    styleUrls: ['./link.css'],
    providers: []
})
export class LinkComponent implements OnInit, OnDestroy {
    @Input() data;
    @Input() index;
    @Input() type:string;
    @Input() firstTimeChallengeInterval : boolean = false;


    protected observable:EventEmitter<any>;
    protected isHidden = true;
    protected isViewed = false;
    private isUpdating = false;
    private _timeout = null;
    private timeToDisplay;
    private timeElapsed = 0;
    private originalTimeToDisplay;
    private subscriber;
    private isTimerRunning;

    constructor(private calcService: CalcService, private router: Router, private utils: Utils, private dataStore: DataStore) { };

    ngOnInit() {
        let self = this;
        // check if linktype == meeting, if so, show R#Event1 after FIRST_CHALLENGE_UPDATE_INTERVAL, 
        // show subsequent events after CHALLENGE_UPDATE_INTERVAL
        if (this.type === "meeting") {
            this.timeToDisplay = CHALLENGE_UPDATE_INTERVAL;
            let regExpR1 = new RegExp(/^R1Event1$/i),
                regExpR2 = new RegExp(/^R2Event1$/i);
            // console.log(this.data.ID + " test " + regExp.test(this.data.ID));
            if (regExpR1.test(this.data.ID)) {
                this.timeToDisplay = R1_FIRST_CHALLENGE_UPDATE_INTERVAL;
            }
            if (regExpR2.test(this.data.ID)) {
                this.timeToDisplay = R2_FIRST_CHALLENGE_UPDATE_INTERVAL;
            }
        } else {
            this.timeToDisplay = MESSAGE_UPDATE_INTERVAL;
        }

        this.originalTimeToDisplay = this.timeToDisplay;

        this.observable = this.calcService.getObservable().subscribe(() => {
            this.getLinkStatus()
                .then((status) => {
                    // debugger;
                    // if link is not hidden and not visible, start timer to show link
                    if (status.hidden === false && status.visible !== true) {
                        this.triggerLinkTimer()
                    }
                });
        });

        this.data["icon"] = "assets/images/" + this.data["icon"];
        this.data["image"] = "assets/images/" + this.data["image"];
        // this.isUpdating = true;
        this.updateLink(true);
    }

    triggerLinkTimer() {
        // start timer and tick down to show link
        // when checking whether to start timer
        // check if we have any timeElapsed and update timeToDisplay
        return this.dataStore.getData(TIME_ELAPSED + this.data.ID, true)
            .then((val) => {
                this.timeElapsed = (val) ? Number(val) : 0;
                // update timeToDisplay 
                this.timeToDisplay -= this.timeElapsed;
            })
            .catch(err => {
                this.timeElapsed = 0;
            })
            .then(() => {
                this.startTimerForLinkDisplay();
            });
    }

    getLinkStatus(): Promise<any> {
        let calcTriggerStatus = this.calcService.getValue(this.data.triggerRange);
        let isHidden = (calcTriggerStatus != 1);
        let isViewed = (this.calcService.getValue(this.data.readRange) != 0);

        return Promise.resolve({
            hidden: isHidden,
            viewed: isViewed
        });
    }

    startTimerForLinkDisplay() {
        if (this.isTimerRunning) return;
        // increment timeElapsed by 10secs at each interval and save to persistent storage when counting down
        // so that user does not have to wait the entire time if they need to refresh browser at any point / continue later
        this.isTimerRunning = true;
        let intervalId = setInterval(() => {

            this.timeElapsed = Number(this.timeElapsed) + 10000;
            //console.log(this.data.ID + " time elapsed " + this.timeElapsed);
            this.dataStore.setData(TIME_ELAPSED + this.data.ID, (this.timeElapsed), true);
            if (this.timeElapsed > this.timeToDisplay) {
                clearInterval(intervalId);
            }
        }, 10000);
        //console.log("Going to wait for " + (this.timeToDisplay/1000) + " secs before showing the link " + this.data.ID);
        this._timeout = setTimeout(() => {
            clearInterval(intervalId);
            this.onTimerComplete();
        }, this.timeToDisplay);
    }

    onTimerComplete() {
        if (this.isTimerRunning) {
            //console.log(this.data.ID + " timer complete ");
            this.dataStore.setData(TIME_ELAPSED + this.data.ID, this.originalTimeToDisplay, true);
            this.timeToDisplay = this.originalTimeToDisplay; // reset timings 
            this.showLink();
            this.isTimerRunning = false;
        }
    }

    onSelect() {
        let childUrl: string = this.type + '/' + this.data.ID;
        let key = (this.type === "meeting") ? MEETING_STATUS : MESSAGE_STATUS,
            linkStatus = this.dataStore.getData(key);
        if (!this.isViewed) {
            linkStatus.markVisited();
            this.isViewed = true;
        }
        this.dataStore.triggerChange(key);
        // this.router.navigate(['/dashboard', 'meetings', this.meeting.ID]);
        this.router.navigate(['/dashboard', { outlets: { 'messages': childUrl }}]);
    }

    showLink() {
        let key = (this.type === "meeting") ? MEETING_STATUS : MESSAGE_STATUS,
            linkStatus = this.dataStore.getData(key);
        this.isViewed = (this.calcService.getValue(this.data.readRange) != 0);
        this.isHidden = false;
        linkStatus.updateLink(this.data.readRange, false, this.isViewed);
        if (!this.isViewed) {
            this.utils.getObservable(MESSAGE_LINK_ADDED_EVENT).emit(this.data);
        }
        this.dataStore.triggerChange(key);
    }

    updateLink(isInit?:boolean) {
        let key = (this.type === "meeting") ? MEETING_STATUS : MESSAGE_STATUS,
            linkStatus = this.dataStore.getData(key);
        // add link to storage

        this.getLinkStatus()
            .then((status) => {
                this.isViewed = status.viewed;
                this.isHidden = status.hidden;
                // link is not hidden but not viewed so let the timer decide if it needs to be shown or not!
                if (!this.isHidden && !this.isViewed) {
                    this.isHidden = true;
                    linkStatus.addLink(this.data.readRange, true , this.isViewed);
                    this.triggerLinkTimer();
                }
                // if already viewed just show the link :)
                if (this.isViewed) {
                    linkStatus.addLink(this.data.readRange, this.isHidden , this.isViewed);
                    this.showLink();
                };
                this.dataStore.triggerChange(key);
            });
    }

    @HostListener('document:keyup', ['$event'])
    onKeypress($event) {
        // console.log("Key pressed :: " + $event.keyCode, $event.shiftKey, $event.ctrlKey);
        if (this.isTimerRunning) {
            if ($event.keyCode === KEY_NUM_1 && $event.ctrlKey) {
                this.onTimerComplete();
                this.timeElapsed = this.timeToDisplay;
            }
        }
    }

    ngOnDestroy() {
        clearTimeout(this._timeout);
        this.observable.unsubscribe();
    }
}