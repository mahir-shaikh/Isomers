import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../../calcmodule/calc.service';
import { TextEngineService } from '../../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart, UrlTree } from '@angular/router';
import { DataStore, MESSAGES_OUTLET, PRIMARY_OUTLET, Utils, INTRO_COMPLETE, APP_READY } from '../../../utils/utils';

@Component({
    selector: 'registration',
    templateUrl: './registration.html',
    styleUrls: ['./registration.css']
})
export class Registration implements OnInit, OnDestroy {

    private routeAnimation: string = "fadeIn";
    private content:any = {};
    private routeObserver: any;
    private currentPage: string;
    private participantName:string = "";
    private teamName:string = "";
    private isChecked: boolean = false;
    private placeholder:string = "";

    constructor(private calcService: CalcService, private textengineService: TextEngineService, private route: ActivatedRoute, private router: Router, private utils: Utils, private dataStore: DataStore) { };

    ngOnInit() {

        this.placeholder = this.textengineService.getText("EnterTeamName");
        this.routeObserver = this.router.events.subscribe((event) => {
            let tree: UrlTree = this.router.parseUrl(this.router.url),
                treeFragment = tree.fragment,
                newUrl = '/';
            if (event instanceof NavigationEnd) {
                // this.route.params.forEach(params => this.id = params['id']);
                let root = tree.root.children[PRIMARY_OUTLET],
                    rootSegments = root.segments;

                rootSegments.forEach(segment => {
                    if (segment.path === 'registration') {
                        this.routeAnimation = "fadeIn"
                        this.currentPage = segment.path;
                        this.setUpdatedText(this.currentPage);
                    }
                });
            }
           
        });
    }

    setUpdatedText(segmentLabel) {

        this.content.title = this.textengineService.getText("Title");
        this.content.body = "";
        // this.content.imagePath = "assets/images/" + this.textengineService.getText("RegistrationImage");

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

    navigate() {
        let url = ['intro', 'welcome'];

        this.router.navigate(url);
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
    }

    onFocus($event) {

    }

    onBlur($event) {
        this.calcService.setValue("tlInputTeamName", this.teamName);
        this.calcService.setValue("tlInputParticipantName", this.participantName);
    }
}
