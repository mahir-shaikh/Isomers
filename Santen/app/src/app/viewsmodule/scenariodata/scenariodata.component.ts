import { Component, ElementRef, Input, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';
import { Utils, DataStore, EVENTS, SCENARIO } from '../../utils';



type states = ( "out" | "in" | "none" );

@Component({
    selector: 'scenariodata',
    templateUrl: './scenariodata.component.html',
    styleUrls: ['./scenariodata.component.css'],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SceanrioDataComponent implements OnInit, OnDestroy {
    @Input() scenario: string;
    @Input() scenarioId: number;
    @Input() activeNo: number;
    private arrInputRefs: Array<string>;
    private resetEventListener: EventEmitter<any>;
    private isActive: boolean = false;
    private subscription: Subscription;
    private periodNumber : number = 0;

    private changeInObservation = ["+ 12 months", "+ 6 months", "0 months", "- 6 months", "- 12 months"];
    private DATA_LIST_SIZE_PH1 = ["10", "25", "50", "75", "100"];
    private DATA_LIST_SIZE_PH2 = ["125", "200", "250", "300", "350"];
    private DATA_LIST_SIZE_PH3 = ["750", "1200", "1500", "1750", "2000"];
    // const DATA_LIST_ADMINISTRATION = ["IV", "Subcutaneous", "Eye Drops"];
    private DATA_LIST_INDICATION = ["No P2b", "Multiple Arms", "+ Competitive"];
    private DATA_LIST_COMPARATOR = ["Active", "Historical"];
    private DATA_LIST_FORMULATION = ["Early Stage", "Late Stage", "Prelaunch"];
    // private inputRange = BD_INPUT_RANGE;
    private ColumnChartOptions: string = '{ "legend": { "itemStyle": { "color": "#000" }, "layout": "vertical", "align": "right", "verticalAlign": "middle" },  "yAxis": { "title": { "text": "Revenue (Millions)" } } , "xAxis": { "title": { "text": "Year Post Launch" } }, "plotOptions" : {"column" : { "dataLabels" : {"enabled" : false } } } }';

    constructor(private utils: Utils, private dataStore: DataStore, private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        this.periodNumber = this.calcService.getValue("calcAcquisitionTracker");

        this.resetEventListener = this.dataStore.getObservableFor(EVENTS.RESET_TOOL_PAGE).subscribe(() => {
            this.utils.resetInputs(this.arrInputRefs, this.calcService);
        });

        this.dataStore.setData(SCENARIO, this.scenarioId);

        this.arrInputRefs = [
            'tlInputScenario' + this.scenarioId + 'Notes1',
            'tlInputScenario' + this.scenarioId + 'AddBiomarker',
            'tlInputScenario' + this.scenarioId + 'Administration',
            'tlInputScenario' + this.scenarioId + 'TrialSizePh1',
            'tlInputScenario' + this.scenarioId + 'TrialSizePh2',
            'tlInputScenario' + this.scenarioId + 'TrialSizePh3',
            'tlInputScenario' + this.scenarioId + 'ObservationPh1',
            'tlInputScenario' + this.scenarioId + 'ObservationPh2',
            'tlInputScenario' + this.scenarioId + 'ObservationPh3',
            'tlInputScenario' + this.scenarioId + 'MNTrialsPh2',
            'tlInputScenario' + this.scenarioId + 'MNTrialsPh3',
            'tlInputScenario' + this.scenarioId + 'AddIndication',
            'tlInputScenario' + this.scenarioId + 'DDFrequency',
            'tlInputScenario' + this.scenarioId + 'Ph2bStudy',
            'tlInputScenario' + this.scenarioId + 'PrimaryEndpoint',
            'tlInputScenario' + this.scenarioId + 'SecondaryEndpoint',
            'tlInputScenario' + this.scenarioId + 'Comparator',
            'tlInputScenario' + this.scenarioId + 'RegulatorySuccess',
            'tlInputScenario' + this.scenarioId + 'ResearchPTS',
            'tlInputScenario' + this.scenarioId + 'Ph1PTS',
            'tlInputScenario' + this.scenarioId + 'Ph2PTS',
            'tlInputScenario' + this.scenarioId + 'Ph3PTS',
            'tlInputScenario' + this.scenarioId + 'ResearchTimeReq',
            'tlInputScenario' + this.scenarioId + 'Ph1TimeReq',
            'tlInputScenario' + this.scenarioId + 'Ph2TimeReq',
            'tlInputScenario' + this.scenarioId + 'Ph3TimeReq',
            'tlInputScenario' + this.scenarioId + 'ResearchRnDCost',
            'tlInputScenario' + this.scenarioId + 'Ph1RnDCost',
            'tlInputScenario' + this.scenarioId + 'Ph2RnDCost',
            'tlInputScenario' + this.scenarioId + 'Ph3RnDCost',
            'tlInputScenario' + this.scenarioId + 'ResearchFTECost',
            'tlInputScenario' + this.scenarioId + 'Ph1FTECost',
            'tlInputScenario' + this.scenarioId + 'Ph2FTECost',
            'tlInputScenario' + this.scenarioId + 'Ph3FTECost',
            'tlInputScenario' + this.scenarioId + 'Notes2',
            'tlInputScenario' + this.scenarioId + 'EnterRegion1',
            'tlInputScenario' + this.scenarioId + 'EnterRegion2',
            'tlInputScenario' + this.scenarioId + 'EnterRegion3',
            'tlInputScenario' + this.scenarioId + 'EnterRegion4',
            'tlInputScenario' + this.scenarioId + 'PatPopRegion1',
            'tlInputScenario' + this.scenarioId + 'PatPopRegion2',
            'tlInputScenario' + this.scenarioId + 'PatPopRegion3',
            'tlInputScenario' + this.scenarioId + 'PatPopRegion4',
            'tlInputScenario' + this.scenarioId + 'PeakMSRegion1',
            'tlInputScenario' + this.scenarioId + 'PeakMSRegion2',
            'tlInputScenario' + this.scenarioId + 'PeakMSRegion3',
            'tlInputScenario' + this.scenarioId + 'PeakMSRegion4',
            'tlInputScenario' + this.scenarioId + 'PriceRegion1',
            'tlInputScenario' + this.scenarioId + 'PriceRegion2',
            'tlInputScenario' + this.scenarioId + 'PriceRegion3',
            'tlInputScenario' + this.scenarioId + 'PriceRegion4',
            'tlInputScenario' + this.scenarioId + 'Region1SnM',
            'tlInputScenario' + this.scenarioId + 'Region2SnM',
            'tlInputScenario' + this.scenarioId + 'Region3SnM',
            'tlInputScenario' + this.scenarioId + 'Region4SnM',
            'tlInputScenario' + this.scenarioId + 'Penetration',
            'tlInputScenario' + this.scenarioId + 'MAEffort',
            'tlInputScenario' + this.scenarioId + 'Compliance',
            'tlInputScenario' + this.scenarioId + 'Royalty',
            'tlInputScenario' + this.scenarioId + 'DiscountRate',
            'tlInputScenario' + this.scenarioId + 'EPVRate',
            'tlInputScenario' + this.scenarioId + 'COGS',
            'tlInputScenario' + this.scenarioId + 'NPVRate'
        ];

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.cdRef.markForCheck();
        });
        
    }

    copy(){
        this.arrInputRefs.forEach((ref, refIndex) => {
            let currentRef = ref;
            ref = ref.replace(/(Scenario)(\d)/g, function(match, p1, p2) {
                return p1 + '1';
            });
            let baseValue = this.calcService.getValue(ref, true);
            this.calcService.setValue(currentRef, baseValue);
        });
    }

    ngOnDestroy() {
        this.resetEventListener.unsubscribe();
        this.subscription.unsubscribe();
    }
}
