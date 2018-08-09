import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, NavigationEnd } from '@angular/router';
import { DataStore, Dictionary, APP_READY, INTRO_COMPLETE, Utils, SWOT_ROUTE } from '../../utils/utils';


@Component({
    selector: 'swot',
    templateUrl: './swot.html',
    styleUrls: ['./swot.css'],
    providers: []
})
export class SwotComponent implements OnInit, OnDestroy {
    private activeTabIndex:number;
    private isOpening: boolean = false;
    private isClosing: boolean = false;
    private isIntro: boolean = false;
    private routeAnimation: string;
    // private SWOTStrengthTitle:string = "";
    // private SWOTWeaknessTitle:string = "";
    // private SWOTOpportunityTitle:string = "";
    // private SWOTThreatTitle:string = "";

    // private SWOTAnalysisText:string = "";
    // private GlobalTrendsTitle:string = "";
    // private BusinessChallengesTitle:string = "";
    // private CompetitiveLandscapeTitle:string = "";
    // private KeyMetricsTitle:string = "";
    // private GlobalTrendsText:string = "";
    // private BusinessChallengesText:string = "";
    // private CompetitiveLandscapeText:string = "";
    // private KeyMetricsText:string = "";

    constructor(private calcService: CalcService, private textEngine: TextEngineService, private router: Router, private dataStore: DataStore, private utils: Utils) {}

    ngOnInit(){
        // this.SWOTAnalysisText = this.textEngine.getText("SWOTAnalysisText");
        
        // this.SWOTStrengthTitle = this.textEngine.getText("SWOTStrengthTitle"); 
        // this.SWOTWeaknessTitle = this.textEngine.getText("SWOTWeaknessTitle"); 
        // this.SWOTOpportunityTitle = this.textEngine.getText("SWOTOpportunityTitle"); 
        // this.SWOTThreatTitle = this.textEngine.getText("SWOTThreatTitle"); 

        // this.GlobalTrendsTitle = this.textEngine.getText("GlobalTrendsTitle"); 
        // this.BusinessChallengesTitle = this.textEngine.getText("BusinessChallengesTitle"); 
        // this.CompetitiveLandscapeTitle = this.textEngine.getText("CompetitiveLandscapeTitle"); 
        // this.KeyMetricsTitle = this.textEngine.getText("KeyMetricsTitle"); 
        // this.GlobalTrendsText = this.textEngine.getText("GlobalTrendsText"); 
        // this.BusinessChallengesText = this.textEngine.getText("BusinessChallengesText"); 
        // this.CompetitiveLandscapeText = this.textEngine.getText("CompetitiveLandscapeText"); 
        // this.KeyMetricsText = this.textEngine.getText("KeyMetricsText"); 
        let getDataPromise = this.dataStore.getData(INTRO_COMPLETE, true);
        
        getDataPromise.then((value) => {
            if (value == "true") {
                this.routeAnimation = "slideInRight"
            }
            else {
                this.isIntro = true;
                this.routeAnimation = "fadeIn"
            }
        });
    
    }

    ngOnDestroy() {
    }

    navigate() {
        // [routerLink] = "['/intro','email']
        // this.router.navigateByUrl(DASHBOARD_PATH);
        // let url = ['intro', 'goalsetting'];
        let url = ['dashboard'];

        // if (this.currentPage === "overview") {
            // showdashboard 
            this.dataStore.setData(APP_READY, true);
            // mark introviewed - and persist
            this.dataStore.setData(INTRO_COMPLETE, true, true);

        // }
        this.router.navigate(url);
    }

    close() {
        this.routeAnimation = "slideOutRight";
        // let regex = new RegExp("(/)?" + SWOT_ROUTE + "(//)?");
        // let newUrl = this.router.url.replace(regex, '');
        // setTimeout(() => this.router.navigateByUrl(newUrl), 1000);
        setTimeout(() => this.router.navigateByUrl(this.utils.stripChildRouteFromUrl(this.router.url, SWOT_ROUTE)), 1000);
    }
}