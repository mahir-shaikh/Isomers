import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils, EOR_FEEDBACK, YEAR_OUTLET, LOCATION, DataStore, FEEDBACK_VIEWED, DASHBOARD_PATH } from '../../utils/utils';
import { FeedbackTextAndImage } from './feedbacktextandimage';
import { FeedbackTextAndChart } from './feedbacktextandchart';

@Component({
    selector: 'endofroundfeedback',
    templateUrl: './end-of-round-feedback.html',
    styleUrls: ['./end-of-round-feedback.css']
})

export class EndOfRoundFeedback implements OnInit {
    private isClosing = false;
    private isOpening = true;
    private modalShow: boolean = true;
    private tabsHeaders = [];
    private scenes = {};
    private feedbackArray = [];
    private typeArray = [];
    private activeTabArray = [];
    private activeIndex: number = 0;
    private roundYearArray = [];
    private feedbackYear:string;
    private showCloseButton : boolean = false;
    private showBackButton : boolean = false;
    private showForwardButton : boolean = false;
    private currentYear:any;;
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private router: Router, private activatedRoute: ActivatedRoute, private utils: Utils, private dataStore: DataStore) { }

    ngOnInit() {
        this.isClosing = false;
        this.isOpening = true;

        this.scenes = this.textengineService.getFeedback();

        this.activatedRoute.params.forEach(params => this.feedbackYear = params['year']);
        // this.calcService.setValue("tlInputFeedbackYear", this.feedbackYear);
        this.currentYear = parseInt(this.calcService.getValue("xxRound"));

        this.feedbackArray = [];
        this.typeArray = [];
        this.tabsHeaders = [];
        this.activeTabArray = [];
        this.roundYearArray = [];

        // let tlInputFeedbackYear = parseInt(this.calcService.getValue("tlInputFeedbackYear"));

        for (var key in this.scenes) {
            var localScene = [];
            for (var property in this.scenes[key]) {
                if (this.scenes[key].hasOwnProperty(property)) {
                    localScene[property] = this.scenes[key][property];
                }
            }

            let round = localScene["round"];
            let currentRound = (round == this.feedbackYear);

            if (currentRound) {
                this.roundYearArray.push(currentRound);
                this.activeTabArray.push(false);
                this.feedbackArray.push(localScene);
                this.typeArray.push(localScene["subpage"].toLowerCase());
                this.tabsHeaders.push(localScene["name"]);
            }
        }
        this.showBackButton = this.activeIndex != 0;
        this.showForwardButton = this.activeIndex != (this.feedbackArray.length-1);
        this.showCloseButton = !this.showBackButton && !this.showForwardButton;
        this.dataStore.getData(FEEDBACK_VIEWED, true).then((result) => {
        if(result == "true"){
                this.showCloseButton = true;
            }
        });
    }

    onClose() {
        this.isClosing = true;
        this.isOpening = false;
        this.modalShow = false;
        let tlInputFeedbackYear = parseInt(this.calcService.getValue("tlInputFeedbackYear"));

        setTimeout(() => {
            // currentYear = currentYear + 1;
            // this.calcService.setValue("tlInputTeamYear", currentYear);
             let url = this.utils.stripOutletFromUrl(this.router.url, YEAR_OUTLET),
                 parentURL = this.utils.stripChildRouteFromUrl(url, EOR_FEEDBACK).replace("/dashboard", "");
            this.router.navigateByUrl("/password");
        }, 1000)
    }

    setActiveIndex(index: string):any {
        this.activeIndex = parseInt(index);
        this.showBackButton = this.activeIndex != 0;
        this.showForwardButton = this.activeIndex != (this.feedbackArray.length-1);
    }

    onNext() {
        this.activeIndex = Math.min(this.activeIndex+1, (this.feedbackArray.length-1));
        if(this.activeIndex == (this.feedbackArray.length-1)){
            this.dataStore.setData(FEEDBACK_VIEWED, true, true);
            this.showCloseButton = true;
        }
        this.showBackButton = this.activeIndex != 0;
        this.showForwardButton = this.activeIndex != (this.feedbackArray.length-1);
    }

    onBack() {
        this.activeIndex = Math.max(0, this.activeIndex-1);
        this.showBackButton = this.activeIndex != 0;
        this.showForwardButton = this.activeIndex != (this.feedbackArray.length-1);
    }
}
