import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../../calcmodule/calc.service';
import { TextEngineService } from '../../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart, UrlTree } from '@angular/router';
import { DataStore, MESSAGES_OUTLET, PRIMARY_OUTLET, Utils, INTRO_COMPLETE, APP_READY } from '../../../utils/utils';

@Component({
    selector: 'intro-component',
    templateUrl: './introemail.html',
    styleUrls: ['./introemail.css']
})
export class IntroEmail implements OnInit, OnDestroy {

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

        this.content.title = this.textengineService.getText("IntroEmailTitle");
        this.content.body = this.textengineService.getText("IntroEmailText");
        // this.content.imagePath = "/assets/images/" + this.textengineService.getText("IntroEmailImage");
        this.content.imagePath = "assets/images/chairmanIcon.png";
        this.content.buttonImagePath = "assets/images/" + this.textengineService.getText("IntroEmailButtonImage");
        this.content.buttonText = this.textengineService.getText("XYZOverview");

        this.content.body = this.findAndReplaceTags(this.content.body);
        this.content.buttonText = this.findAndReplaceTags(this.content.buttonText);
    }

    navigate() {
        // [routerLink] = "['/intro','email']
        // this.router.navigateByUrl(DASHBOARD_PATH);
        let url = ['intro', 'overview'];

        this.router.navigate(url);
    }

    ngOnDestroy() {

    }
}
