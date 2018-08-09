import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, NavigationEnd } from '@angular/router';
import { DataStore, Dictionary, Utils, ANALYSIS_ROUTE } from '../../utils/utils';


@Component({
    selector: 'analysis',
    templateUrl: 'analysis.html',
    styleUrls: ['./analysis.css']
})

export class AnalysisComponent implements OnInit, OnDestroy {
    private activeTabIndex: number;
    private isOpening: boolean = false;
    private isClosing: boolean = false;
    private modalShow: boolean = true;
    private expanded = false;
    private routeAnimation: string;
    private Competitor2Background:string = "";
    private Competitor1Background:string = "";
    private Competitor2MarketIntelligence:string = "";
    private Competitor3MarketIntelligence:string = "";

    constructor(private calcService: CalcService, private textEngine: TextEngineService, private router: Router, private dataStore: DataStore, private utils: Utils) { }

    ngOnInit() {
        this.isClosing = false;
        this.isOpening = true;
        // this.routeAnimation = "slideInRight"

        this.Competitor2Background = this.textEngine.getText("Competitors2Background");
        this.Competitor1Background = this.textEngine.getText("Competitors1Background");
        // this.Competitor2MarketIntelligence = this.textEngine.getTextForYear("Competitor2MarketIntelligence", "tlInputTeamYear");
        // this.Competitor3MarketIntelligence = this.textEngine.getTextForYear("Competitor3MarketIntelligence", "tlInputTeamYear");
    }

    ngOnDestroy() {
    }

    onClose() {
        this.isClosing = true;
        this.isOpening = false;
        this.modalShow = false;
        // this.routeAnimation = "slideOutRight";
        // let regex = new RegExp("(/)?" + ANALYSIS_ROUTE + "(//)?");
        // let newUrl = this.router.url.replace(regex, '');
        // setTimeout(() => this.router.navigateByUrl(newUrl), 1000);
        setTimeout(() => this.router.navigateByUrl(this.utils.stripChildRouteFromUrl(this.router.url, ANALYSIS_ROUTE)), 1000);
    }
}