import { Component, ElementRef, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
// import { DASHBOARD_PATH, Dictionary } from '../../utils/utils';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
// import { TabsetComponent } from 'ng2-bootstrap';
import { Utils, DataStore, EVENTS, PRINT_DATA, SCENARIO } from '../../utils';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'scenario',
    templateUrl: './scenario.component.html',
    styleUrls: ['./scenario.component.css'],
    providers: []
})

export class SceanrioComponent implements OnInit, OnDestroy {
    private activeIndex: number = 0;
    private currentYear: number;
    private scenarioNo: number = 3;
    private scenarioName: string = "Scenario1";
    private scenario1:string;
    private scenario2:string;
    private scenario3:string;
    private subscription: Subscription;
    private printEventListener: EventEmitter<any>;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private dataStore : DataStore, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        this.currentYear = this.calcService.getValue("tlInputTeamYear");
        this.scenario1 = this.textengineService.getText("Scenario1");
        this.scenario2 = this.textengineService.getText("Scenario2");
        this.scenario3 = this.textengineService.getText("Scenario3");

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.cdRef.markForCheck();
        })

        this.printEventListener = this.dataStore.getObservableFor(EVENTS.PRINT_PAGE).subscribe(() => {
            this.dataStore.setData(PRINT_DATA, this.getPrintReportData());
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.printEventListener.unsubscribe();
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {
            case 0:
                this.scenarioNo = 1;
                this.scenarioName = this.textengineService.getText("Scenario1");
                break;
            
            case 1:
                this.scenarioNo = 2;
                this.scenarioName = this.textengineService.getText("Scenario2");
                break;
            case 2:
                this.scenarioNo = 3;
                this.scenarioName = this.textengineService.getText("Scenario3");
                break;
            default:
                this.scenarioNo = 1;
                this.scenarioName = this.textengineService.getText("Scenario1");
                break;
        }

        this.dataStore.setData(SCENARIO, this.scenarioNo);
    }


    private getPrintReportData(): Array<any> {
        return [
        {
            "type": "headertext",
            "content": "DevelopmentPlan"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "DevelopmentPlan", "indent": 0, "isHeading": true },{ "text": "Scenario1", "indent": 0, "isHeading": true },{ "text": "Scenario2", "indent": 0, "isHeading": true },{ "text": "Scenario3", "indent": 0, "isHeading": true }],
                "class": "heading-row"
                },
            {
                "columns": [{ "text": "CumulativePOS", "indent": 0 }, { "value": "tlOutputScenario1CumPOS", "format":"0.0%" }, { "value": "tlOutputScenario2CumPOS", "format":"0.0%" }, { "value": "tlOutputScenario3CumPOS", "format":"0.0%" }]
            },
            {
                "columns": [{ "text": "ExpectedLaunchDate", "indent": 0 }, { "value": "tlOutputScenario1LaunchDate" }, { "value": "tlOutputScenario2LaunchDate" }, { "value": "tlOutputScenario3LaunchDate" }]
            },
            {
                "columns": [{ "text": "TotalRDExpense", "indent": 0 }, { "value": "tlOutputScenario1TotRnDCost", "format":"$0,0.0a" }, { "value": "tlOutputScenario2TotRnDCost", "format":"$0,0.0a" }, { "value": "tlOutputScenario3TotRnDCost", "format":"$0,0.0a" }]
            },
            {
                "columns": [{ "text": "TotalFteExpense", "indent": 0 }, { "value": "tlOutputScenario1TotFTEExp", "format":"$0,0.0a" }, { "value": "tlOutputScenario2TotFTEExp", "format":"$0,0.0a" }, { "value": "tlOutputScenario3TotFTEExp", "format":"$0,0.0a" }]
            },
            {
                "columns": [{ "text": "PrintEarlyResearch", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintBioMarkerDiag", "indent": 1 }, { "value": "tlInputScenario1AddBiomarker" }, { "value": "tlInputScenario2AddBiomarker" }, { "value": "tlInputScenario3AddBiomarker" }]
            },
            {
                "columns": [{ "text": "PrintAdministration", "indent": 1 }, { "value": "tlInputScenario1Administration" }, { "value": "tlInputScenario2Administration" }, { "value": "tlInputScenario3Administration" }]
            },
            {
                "columns": [{ "text": "Phase1", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintTrailSize", "indent": 1 }, { "value": "tlInputScenario1TrialSizePh1" }, { "value": "tlInputScenario2TrialSizePh1" }, { "value": "tlInputScenario3TrialSizePh1" }]
            },
            {
                "columns": [{ "text": "PrintChangeInDuration", "indent": 1 }, { "value": "tlInputScenario1ObservationPh1" }, { "value": "tlInputScenario2ObservationPh1" }, { "value": "tlInputScenario3ObservationPh1" }]
            },

            {
                "columns": [{ "text": "Phase2", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintTrailSize", "indent": 1 }, { "value": "tlInputScenario1TrialSizePh2" }, { "value": "tlInputScenario2TrialSizePh2" }, { "value": "tlInputScenario3TrialSizePh2" }]
            },
            {
                "columns": [{ "text": "PrintChangeInDuration", "indent": 1 }, { "value": "tlInputScenario1ObservationPh2" }, { "value": "tlInputScenario2ObservationPh2" }, { "value": "tlInputScenario3ObservationPh2" }]
            },
            {
                "columns": [{ "text": "PrintTrailLocation", "indent": 1 }, { "value": "tlInputScenario1MNTrialsPh2" }, { "value": "tlInputScenario2MNTrialsPh2" }, { "value": "tlInputScenario3MNTrialsPh2" }]//
            },
            {
                "columns": [{ "text": "PrintAdditionalIndication", "indent": 1 }, { "value": "tlInputScenario1AddIndication" }, { "value": "tlInputScenario2AddIndication" }, { "value": "tlInputScenario3AddIndication" }]
            },            {
                "columns": [{ "text": "PrintDeliveryFrequency", "indent": 1 }, { "value": "tlInputScenario1DDFrequency" }, { "value": "tlInputScenario2DDFrequency" }, { "value": "tlInputScenario3DDFrequency" }]
            },
            {
                "columns": [{ "text": "Phase2Study", "indent": 1 }, { "value": "tlInputScenario1Ph2bStudy" }, { "value": "tlInputScenario2Ph2bStudy" }, { "value": "tlInputScenario3Ph2bStudy" }]
            },


            {
                "columns": [{ "text": "Phase3", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintTrailSize", "indent": 1 }, { "value": "tlInputScenario1TrialSizePh3" }, { "value": "tlInputScenario2TrialSizePh3" }, { "value": "tlInputScenario3TrialSizePh3" }]
            },
            {
                "columns": [{ "text": "PrintChangeInDuration", "indent": 1 }, { "value": "tlInputScenario1ObservationPh3" }, { "value": "tlInputScenario2ObservationPh3" }, { "value": "tlInputScenario3ObservationPh3" }]
            },
            {
                "columns": [{ "text": "PrintPrimaryEndpoint", "indent": 1 }, { "value": "tlInputScenario1PrimaryEndpoint" }, { "value": "tlInputScenario2PrimaryEndpoint" }, { "value": "tlInputScenario3PrimaryEndpoint" }]//
            },
            {
                "columns": [{ "text": "PrintSecondaryEndpoint", "indent": 1 }, { "value": "tlInputScenario1SecondaryEndpoint" }, { "value": "tlInputScenario2SecondaryEndpoint" }, { "value": "tlInputScenario3SecondaryEndpoint" }]
            },
            {
                "columns": [{ "text": "PrintComparator", "indent": 1 }, { "value": "tlInputScenario1Comparator" }, { "value": "tlInputScenario2Comparator" }, { "value": "tlInputScenario3Comparator" }]
            },
            {
                "columns": [{ "text": "RegulatorySuccess", "indent": 1 }, { "value": "tlInputScenario1RegulatorySuccess" }, { "value": "tlInputScenario2RegulatorySuccess" }, { "value": "tlInputScenario3RegulatorySuccess" }]
            },

            {
                "columns": [{ "text": "Notes", "indent": 0 }, { "value": "tlInputScenario1Notes1" }, { "value": "tlInputScenario2Notes1" }, { "value": "tlInputScenario3Notes1" }]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "ValueAssumptions", "indent": 0, "isHeading": true },{ "text": "Scenario1", "indent": 0, "isHeading": true },{ "text": "Scenario2", "indent": 0, "isHeading": true },{ "text": "Scenario3", "indent": 0, "isHeading": true }],
                "class": "heading-row"
                },

            {
                "columns": [{ "text": "Region1", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintAddressablePopulation", "indent": 1 }, { "value": "tlInputScenario1PatPopRegion1" }, { "value": "tlInputScenario2PatPopRegion1" }, { "value": "tlInputScenario3PatPopRegion1" }]
            },
            {
                "columns": [{ "text": "PeakMarketShare", "indent": 1 }, { "value": "tlInputScenario1PeakMSRegion1" }, { "value": "tlInputScenario2PeakMSRegion1" }, { "value": "tlInputScenario3PeakMSRegion1" }]
            },
            {
                "columns": [{ "text": "PrintPricePatientYear", "indent": 1 }, { "value": "tlOutputScenario1PriceRegion1" }, { "value": "tlOutputScenario2PriceRegion1" }, { "value": "tlOutputScenario3PriceRegion1" }]//
            },
            {
                "columns": [{ "text": "PrintSMPerc", "indent": 1 }, { "value": "tlOutputScenario1Region1SnM" }, { "value": "tlOutputScenario2Region1SnM" }, { "value": "tlOutputScenario3Region1SnM" }]
            },

            {
                "columns": [{ "text": "Region2", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintAddressablePopulation", "indent": 1 }, { "value": "tlInputScenario1PatPopRegion2" }, { "value": "tlInputScenario2PatPopRegion2" }, { "value": "tlInputScenario3PatPopRegion2" }]
            },
            {
                "columns": [{ "text": "PeakMarketShare", "indent": 1 }, { "value": "tlInputScenario1PeakMSRegion2" }, { "value": "tlInputScenario2PeakMSRegion2" }, { "value": "tlInputScenario3PeakMSRegion2" }]
            },
            {
                "columns": [{ "text": "PrintPricePatientYear", "indent": 1 }, { "value": "tlOutputScenario1PriceRegion2" }, { "value": "tlOutputScenario2PriceRegion2" }, { "value": "tlOutputScenario3PriceRegion2" }]//
            },
            {
                "columns": [{ "text": "PrintSMPerc", "indent": 1 }, { "value": "tlOutputScenario1Region2SnM" }, { "value": "tlOutputScenario2Region2SnM" }, { "value": "tlOutputScenario3Region2SnM" }]
            },

            {
                "columns": [{ "text": "Region3", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintAddressablePopulation", "indent": 1 }, { "value": "tlInputScenario1PatPopRegion3" }, { "value": "tlInputScenario2PatPopRegion3" }, { "value": "tlInputScenario3PatPopRegion3" }]
            },
            {
                "columns": [{ "text": "PeakMarketShare", "indent": 1 }, { "value": "tlInputScenario1PeakMSRegion3" }, { "value": "tlInputScenario2PeakMSRegion3" }, { "value": "tlInputScenario3PeakMSRegion3" }]
            },
            {
                "columns": [{ "text": "PrintPricePatientYear", "indent": 1 }, { "value": "tlOutputScenario1PriceRegion3" }, { "value": "tlOutputScenario2PriceRegion3" }, { "value": "tlOutputScenario3PriceRegion3" }]//
            },
            {
                "columns": [{ "text": "PrintSMPerc", "indent": 1 }, { "value": "tlOutputScenario1Region3SnM" }, { "value": "tlOutputScenario2Region3SnM" }, { "value": "tlOutputScenario3Region3SnM" }]
            },

            {
                "columns": [{ "text": "Region4", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintAddressablePopulation", "indent": 1 }, { "value": "tlInputScenario1PatPopRegion4" }, { "value": "tlInputScenario2PatPopRegion4" }, { "value": "tlInputScenario3PatPopRegion4" }]
            },
            {
                "columns": [{ "text": "PeakMarketShare", "indent": 1 }, { "value": "tlInputScenario1PeakMSRegion4" }, { "value": "tlInputScenario2PeakMSRegion4" }, { "value": "tlInputScenario3PeakMSRegion4" }]
            },
            {
                "columns": [{ "text": "PrintPricePatientYear", "indent": 1 }, { "value": "tlOutputScenario1PriceRegion4" }, { "value": "tlOutputScenario2PriceRegion4" }, { "value": "tlOutputScenario3PriceRegion4" }]//
            },
            {
                "columns": [{ "text": "PrintSMPerc", "indent": 1 }, { "value": "tlOutputScenario1Region4SnM" }, { "value": "tlOutputScenario2Region4SnM" }, { "value": "tlOutputScenario3Region4SnM" }]
            },

            {
                "columns": [{ "text": "PrintGlobalBaseline", "indent": 0 }, { "text": "" }, { "text": "" }, { "text": "" }]//
            },
            {
                "columns": [{ "text": "PrintPeneterationRate", "indent": 1 }, { "value": "tlOutputScenario1Penetration" }, { "value": "tlOutputScenario2Penetration" }, { "value": "tlOutputScenario3Penetration" }]
            },
            {
                "columns": [{ "text": "PrintComplianceRate", "indent": 1 }, { "value": "tlOutputScenario1Compliance" }, { "value": "tlOutputScenario2Compliance" }, { "value": "tlOutputScenario3Compliance" }]
            },
            {
                "columns": [{ "text": "PrintDiscountPerc", "indent": 1 }, { "value": "tlOutputScenario1DiscountRate" }, { "value": "tlOutputScenario2DiscountRate" }, { "value": "tlOutputScenario3DiscountRate" }]//
            },
            {
                "columns": [{ "text": "PrintCogsPatientYear", "indent": 1 }, { "value": "tlOutputScenario1COGS" }, { "value": "tlOutputScenario2COGS" }, { "value": "tlOutputScenario3COGS" }]
            },
            {
                "columns": [{ "text": "MedicalAffairsEffort", "indent": 1 }, { "value": "tlInputScenario1MAEffort" }, { "value": "tlInputScenario2MAEffort" }, { "value": "tlInputScenario3MAEffort" }]
            },
            {
                "columns": [{ "text": "Royalty", "indent": 1 }, { "value": "tlInputScenario1Royalty" }, { "value": "tlInputScenario2Royalty" }, { "value": "tlInputScenario3Royalty" }]
            },
            {
                "columns": [{ "text": "DiscountRateEpv", "indent": 1 }, { "value": "tlInputScenario1EPVRate" }, { "value": "tlInputScenario2EPVRate" }, { "value": "tlInputScenario3EPVRate" }]
            },
            {
                "columns": [{ "text": "DiscountRateNpv", "indent": 1 }, { "value": "tlInputScenario1NPVRate" }, { "value": "tlInputScenario2NPVRate" }, { "value": "tlInputScenario3NPVRate" }]//
            },

            {
                "columns": [{ "text": "PrintBreakeven", "indent": 0 }, { "value": "tlOutputScenario1Breakeven" }, { "value": "tlOutputScenario2Breakeven" }, { "value": "tlOutputScenario3Breakeven" }]
            },
            {
                "columns": [{ "text": "PrintROI", "indent": 0 }, { "value": "tlOutputScenario1ROI", "format":"0%" }, { "value": "tlOutputScenario2ROI", "format":"0%" }, { "value": "tlOutputScenario3ROI", "format":"0%" }]
            },
            {
                "columns": [{ "text": "PrintEPV", "indent": 0 }, { "value": "tlOutputScenario1EPV", "format":"$0,0.0a"  }, { "value": "tlOutputScenario2EPV", "format":"$0,0.0a"  }, { "value": "tlOutputScenario3EPV", "format":"$0,0.0a"  }]
            },
            {
                "columns": [{ "text": "PrintNPV", "indent": 0 }, { "value": "tlOutputScenario1NPV", "format":"$0,0.0a"  }, { "value": "tlOutputScenario2NPV", "format":"$0,0.0a"  }, { "value": "tlOutputScenario3NPV", "format":"$0,0.0a"  }]
            },
            {
                "columns": [{ "text": "Notes", "indent": 0 }, { "value": "tlInputScenario1Notes2" }, { "value": "tlInputScenario2Notes2" }, { "value": "tlInputScenario3Notes2" }]
            }]
        }];
    }
}