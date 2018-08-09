import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Utils, MEETINGS_OUTLET, PLANNING_OUTLET, TUTORIALS_ROUTE, RESOURCES_ROUTE, EOR_FEEDBACK, SWOT_ROUTE, ANALYSIS_ROUTE } from '../../../utils/utils';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: './routes.html',
    styleUrls: ['./routes.css'],
})
export class DashboardRoute implements OnInit, OnDestroy { 
    private subscription: Subscription;
    private isPlanningToolActive: boolean = false;
    private isMessagesActive: boolean = false;
    private isTutorialsActive: boolean = false;
    private isResourcesActive: boolean = false;
    private isAnonPaneActive: boolean = false;
    constructor(private router: Router, private route: ActivatedRoute, private utils: Utils) {}

    ngOnInit() {
        this.subscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isMessagesActive = this.utils.isOutletRouteActive(MEETINGS_OUTLET, this.router.url);
                this.isPlanningToolActive = this.utils.isOutletRouteActive(PLANNING_OUTLET, this.router.url);
                this.isAnonPaneActive = this.getAnonPaneActiveStatus();
            }
        });
    }

    getAnonPaneActiveStatus(): boolean {
        let outlets:Array<string> = [
            TUTORIALS_ROUTE,
            RESOURCES_ROUTE,
            EOR_FEEDBACK,
            SWOT_ROUTE,
            ANALYSIS_ROUTE,
        ],
        isActive = false;

        outlets.forEach(outlet => {
            let result = this.utils.isChildRouteActive(outlet, this.router.url, true);
            if (result) {
                isActive = true;
            }
        });

        return isActive;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
