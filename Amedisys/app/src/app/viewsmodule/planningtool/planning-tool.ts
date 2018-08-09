import { Component, OnInit, OnDestroy, trigger, state, style, animate, transition, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { Utils, PLANNING_OUTLET, DataStore } from '../../utils/utils';
import { MESSAGE_LINK_ADDED_EVENT } from '../link/link.component';

export const PLANNING_TOOL_TABS = {
    TIPS: "tips",
    SALESANDMARKETING: "pt:salesandmarketing:activeindex",
    RESEARCHANDDEV: "pt:researchanddev:activeindex",
    HUMANRESOURCES: "pt:humanresources:activeindex",
    OPERATIONS: "pt:operations:activeindex",
    CORPORATE: "pt:corporate:activeindex",
    REPORTS: "pt:reports:activeindex",
    DOOFOCUS: "pt:doofocus:activeindex",
    CARECENTER: "pt:carecenter:activeindex",
    STAFFING: "pt:staffing:activeindex",
    FORECAST: "pt:forecast:activeindex",
}

export const TAB_SWITCHED_EVENT = "tabswitched";

@Component({
    selector: 'planning-tool',
    templateUrl: './planning-tool.html',
    styleUrls: ['./planning-tool.css'],
    providers: []
})

export class PlanningTool implements OnInit, OnDestroy {
    private isClosing = false;
    private subscription: EventEmitter<any>;
    private linkSubscription: EventEmitter<any>;
    private tabSubscription: EventEmitter<any>;
    private showNewLinkNotification: boolean = false;
    private notificationTitle = "";
    private notificationType = "";
    private notificationVisible = false;
    private disableLinksConditionRef = "tlInputTeamYear";
    private linkEnabled = true;
    private isOpening = true;
    private modelSubscription:any;
    private activeTab:number = 1;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private router: Router, private utils: Utils, private dataStore: DataStore) {
    }

    ngOnInit() {
        this.isClosing = false;
        this.isOpening = true;
        this.subscription = this.utils.getObservable(MESSAGE_LINK_ADDED_EVENT).subscribe((data) => {
            this.notificationVisible = true;
            if (data) {
                if (data.PageType == "SingleSelect") {
                    this.notificationType = "Update"
                }
                else {
                    this.notificationType = "New Message"
                }
                this.notificationTitle = data.name;
            }
        });

        this.tabSubscription = this.utils.getObservable(TAB_SWITCHED_EVENT).subscribe((index) => {
            // this will be a product of the tab (1-3) and the lineOfBusiness (1-2) = 1-6
            this.activeTab = index;
        });

        this.linkEnabled = (this.calcService.getValue(this.disableLinksConditionRef) === "1") ? false: true;

        this.linkSubscription = this.calcService.getObservable().subscribe(() => {
            this.linkEnabled = (this.calcService.getValue(this.disableLinksConditionRef) === "1") ? false : true;
        })

        this.modelSubscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });

    }
    
    onModelChange(){
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.linkSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.modelSubscription.unsubscribe();
        this.isOpening = false;
    }

    onSelect() {
        var el = event.srcElement.attributes['data-planning-segment'] || event.srcElement.parentElement.attributes['data-planning-segment'];
        let path: string = el.value || "doofocus";

        this.router.navigate(['/dashboard', { outlets: { 'planning': 'planning/' + path }}]);
    }

    onClose() {
        this.isClosing = true;
        this.notificationVisible = false;
        // stop listening to any link added events
        this.subscription.unsubscribe();
        this.linkSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.modelSubscription.unsubscribe();
        setTimeout(() => this.router.navigateByUrl(this.utils.stripOutletFromUrl(this.router.url, PLANNING_OUTLET)), 1000);
    }

    navigateToComp(){
        this.isClosing = true;
        this.notificationVisible = false;
        // stop listening to any link added events
        this.subscription.unsubscribe();
        this.linkSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.modelSubscription.unsubscribe();
        setTimeout(() => this.router.navigateByUrl(this.utils.stripOutletFromUrl(this.router.url, PLANNING_OUTLET) + "/analysis"), 1000);

    }
}
