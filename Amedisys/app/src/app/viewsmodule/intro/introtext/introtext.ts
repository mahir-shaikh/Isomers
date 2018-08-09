import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../../calcmodule/calc.service';
import { TextEngineService } from '../../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart, UrlTree } from '@angular/router';
import { DataStore, MESSAGES_OUTLET, PRIMARY_OUTLET, Utils, INTRO_COMPLETE, APP_READY } from '../../../utils/utils';

@Component({
    selector: 'intro-component',
    templateUrl: './introtext.html',
    styleUrls: ['./introtext.css']
})
export class IntroText implements OnInit, OnDestroy {

    private routeAnimation: string = "flipInY";
    private content:any = {};
    private routeObserver: any;
    private showForwardButton : boolean = false;
    private tabsHeaders = [];
    private showBackButton : boolean = false;
    private activeIndex: number = 0;
    private currentPage: string;
    constructor(private calcService: CalcService, private textengineService: TextEngineService, private route: ActivatedRoute, private router: Router, private utils: Utils, private dataStore: DataStore) { };

    ngOnInit() {
        this.setUpdatedText();
        // this.routeObserver = this.router.events.subscribe((event) => {
        //     let tree: UrlTree = this.router.parseUrl(this.router.url),
        //         treeFragment = tree.fragment,
        //         newUrl = '/';
        //     if (event instanceof NavigationEnd) {
        //         // this.route.params.forEach(params => this.id = params['id']);
        //         let root = tree.root.children[PRIMARY_OUTLET],
        //             rootSegments = root.segments;

        //         rootSegments.forEach(segment => {
        //             if (segment.path === 'welcome') {
        //                 this.routeAnimation = "flipInY"
        //                 this.currentPage = segment.path;
        //                 this.setUpdatedText(this.currentPage);
        //             }
        //             // else if (segment.path === 'email') {
        //             //     this.routeAnimation = "flipInY"
        //             //     this.currentPage = segment.path;
        //             //     this.setUpdatedText(this.currentPage);
        //             // }
        //         });
        //         // this.setUpdatedText(this.currentPage);
        //     }
        // });
    }

    setUpdatedText() {
        this.content.simulationtitle = this.textengineService.getText("IntroSimulationTitle");
        this.content.simulationbody = this.textengineService.getText("IntroSimulationText");
        this.content.companyoverviewtitle = this.textengineService.getText("IntroCompanyOverviewTitle");
        this.content.companyoverviewbody = this.textengineService.getText("IntroCompanyOverviewText");
        this.content.challengestitle = this.textengineService.getText("IntroChallengesTitle");
        this.content.challengesbody = this.textengineService.getText("IntroChallengesText");
        this.content.Competitivetitle = this.textengineService.getText("IntroCompetitiveLandscapeTitle");
        this.content.Competitivebody = this.textengineService.getText("IntroCompetitiveLandscapeText");
        
        // this.content.imagePath = "assets/images/" + this.textengineService.getText("IntroBlogImage");

        if (this.content.body != undefined) {
            let startLoc = this.content.body.indexOf("{{");
            let index = 0;

            while ((startLoc != -1) && (index < 100)) {
                let endLoc = this.content.body.indexOf("}}");
                if (endLoc != -1) {
                    let lookupVal = this.content.body.substr(startLoc+2, ((endLoc-1)-startLoc-1)).trim();
                    this.content.body = this.content.body.substr(0, startLoc) + this.calcService.getValue(lookupVal) + this.content.body.substr(endLoc+2);
                }
                startLoc = this.content.body.indexOf("{{");
                index++;
            }
        }
    }

    setActiveIndex(index):any {
        this.activeIndex = parseInt(index);
        this.showBackButton = this.activeIndex != 0;
        this.showForwardButton = this.activeIndex != 3;
    }

    onNext() {
        this.setActiveIndex(++this.activeIndex);
        this.activeIndex = this.activeIndex++;
        // if(this.activeIndex == 3){
        //     this.navigate();
        // }
        // this.showBackButton = this.activeIndex != 0;
        this.showForwardButton = this.activeIndex != 3;
    }

    // onBack() {
    //     // this.setActiveIndex(--this.activeIndex);
    //     this.activeIndex = this.activeIndex--;
    //     if(this.activeIndex == 3){
    //         this.navigate();
    //     }
    //     this.showBackButton = this.activeIndex != 0;
    //     this.showForwardButton = this.activeIndex !=3;
    // }

    navigate() {
        // [routerLink] = "['/intro','email']
        // this.router.navigateByUrl(DASHBOARD_PATH);
        let url = ['intro', 'swot'];

        this.router.navigate(url);
    }

    ngOnDestroy() {

    }
}
