import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../../calcmodule/calc.service';
import { TextEngineService } from '../../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart, UrlTree } from '@angular/router';
import { DataStore, MESSAGES_OUTLET, PRIMARY_OUTLET, Utils, INTRO_COMPLETE, APP_READY } from '../../../utils/utils';

@Component({
    selector: 'intro-component',
    templateUrl: './introoverview.html',
    styleUrls: ['./introoverview.css']
})
export class IntroOverview implements OnInit, OnDestroy {

    private routeAnimation: string = "flipInY";
    private content:any = {};
    private routeObserver: any;
    private currentPage: string;
    constructor(private calcService: CalcService, private textengineService: TextEngineService, private route: ActivatedRoute, private router: Router, private utils: Utils, private dataStore: DataStore) { };

    ngOnInit() {

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
        //                 this.routeAnimation = "fadeIn"
        //                 this.currentPage = segment.path;
        //                 this.setUpdatedText(this.currentPage);
        //             }
        //             else if (segment.path === 'email') {
        //                 this.routeAnimation = "flipInY"
        //                 this.currentPage = segment.path;
        //                 this.setUpdatedText(this.currentPage);
        //             }
        //             else if (segment.path === 'overview') {
        //                 this.routeAnimation = "flipInY"
        //                 this.currentPage = segment.path;
        //                 this.setUpdatedText(this.currentPage);
        //             }
        //         });
        //     }
        // });
        this.setUpdatedText();
    }

    findAndReplaceTags(taggedContent) {

        if (taggedContent != undefined) {
            let startLoc = taggedContent.indexOf("{{");
            let index = 0;

            while ((startLoc != -1) && (index < 100)) {
                let endLoc = taggedContent.indexOf("}}");
                if (endLoc != -1) {
                    let lookupVal = taggedContent.substr(startLoc+2, ((endLoc-1)-startLoc-1)).trim();
                    taggedContent = taggedContent.substr(0, startLoc) + this.calcService.getValue(lookupVal) + taggedContent.substr(endLoc+2);
                }
                startLoc = taggedContent.indexOf("{{");
                index++;
            }
        }

        return taggedContent;
    }

    setUpdatedText() {

        this.content.title = this.textengineService.getText("IntroOverviewTitle");
        this.content.body = this.textengineService.getText("IntroOverviewText");
        this.content.imagePath = "assets/images/" + this.textengineService.getText("IntroOverviewImage");
        this.content.buttonText = this.textengineService.getText("IntroOverviewButtonTitle");

        this.content.title = this.findAndReplaceTags(this.content.title);
        this.content.body = this.findAndReplaceTags(this.content.body);
    }

    navigate() {
        // [routerLink] = "['/intro','email']
        // this.router.navigateByUrl(DASHBOARD_PATH);
        let url = ['intro', 'swot'];
        // let url = ['dashboard'];

        // if (this.currentPage === "overview") {
        //     // showdashboard 
        //     this.dataStore.setData(APP_READY, true);
        //     // mark introviewed - and persist
        //     this.dataStore.setData(INTRO_COMPLETE, true, true);

        // }
        this.router.navigate(url);
    }

    ngOnDestroy() {

    }
}
