import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';


@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    private routeObserver: any;
    private activeReportRoute: boolean = false;
    private currentscenario: Number;
    private resetVisible: boolean = true;
    private metricconditions: Array<string> = [
        "tlOutputDBScenario1ConditionMetric1",
        "tlOutputDBScenario1ConditionMetric2",
        "tlOutputDBScenario1ConditionMetric3",
        "tlOutputDBScenario1ConditionMetric4",
        "tlOutputDBScenario1ConditionMetric5",
        "tlOutputDBScenario1ConditionMetric6",
        "tlOutputDBScenario1ConditionMetric7"
    ];
    private metricvisibility = [{
        label: "ROI",
        visible: null,
        valueref: "Metric1",
        format: "(0.0%)"
    },{
        label: "EPV",
        visible: null,
        valueref: "Metric2",
        format: "$(0.0a)"
    },{
        label: "NPV",
        visible: null,
        valueref: "Metric3",
        format: "$(0.0a)"
    },{
        label: "PeakSales",
        visible: null,
        valueref: "Metric4",
        format: "$(0.0a)"
    },{
        label: "LaunchDate",
        visible: null,
        valueref: "Metric5",
        format: "0",
        Value: true
    }, {
        label: "RDCost",
        visible: null,
        valueref: "Metric6",
        format: "$(0.0a)"
    }, {
        label: "POS",
        visible: null,
        valueref: "Metric7",
        format: "0.0%"
    }];
    private subscription: Subscription;
    private calcServiceSubscription: Subscription;

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService) { };


    ngOnInit() {
        let self = this;
        this.routeObserver = this.router.events.subscribe((event) => {
            // self.activeReportRoute = self.utils.isChildRouteActive("reports","/reports");
            this.checkIfReportRouteIsActive();
        });

        this.currentscenario = this.dataStore.getData(SCENARIO);
        this.subscription = this.dataStore.getObservableFor(SCENARIO).subscribe((val) => {
            this.currentscenario = val;
        });

        this.calcServiceSubscription = this.calcService.getObservable().subscribe(() => {
            this.updateMetricConditions();
        });
        this.updateMetricConditions();
        this.checkIfReportRouteIsActive();
    }

    checkIfReportRouteIsActive() {
        let urlTree = this.router.createUrlTree([ROUTES.REPORTS]);
        this.resetVisible = !this.router.isActive(urlTree, true);
    }

    updateMetricConditions() {
        this.metricconditions.forEach((metriccondition, conditionindex) => {
            var metric = this.metricvisibility[conditionindex];
            // debugger;
            metric.visible = (this.calcService.getValue(metriccondition) === true);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    resetPage() {
        this.resetModalRef.show();
    }

    printPage() {
        this.dataStore.triggerChange(EVENTS.PRINT_PAGE);
    }

    showAlert(){
        this.childModal.show();
    }

    hideAlert(confirmed:boolean = false) {
        this.childModal.hide();  
    }

    hideResetAlert(confirmed:boolean = false){
        if(confirmed){
            this.dataStore.triggerChange(EVENTS.RESET_TOOL_PAGE);
        }
        this.resetModalRef.hide();
    }
}
