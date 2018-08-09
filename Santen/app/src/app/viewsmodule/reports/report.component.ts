import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { BasicColumnComponent } from '../../charts/basiccolumn/basiccolumn'
import { BasicLineComponent } from '../../charts/basicline/basicline'
import { Utils, DataStore, EVENTS, ROUTES, PRINT_DATA } from '../../utils';

@Component({
    selector: 'reports',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css'],
    providers: []
})

export class ReportsComponent implements OnInit, OnDestroy {
    private chartOptions: string = '{ "legend": { "itemStyle": { "color": "#000" }, "layout": "vertical", "align": "right", "verticalAlign": "middle" } }'
    private seriesDataScenario1: Array<any>;
    private seriesDataScenario2: Array<any>;
    private seriesDataScenario3: Array<any>;
    private printEventListener: EventEmitter<any>;
    private expandChart1: boolean = true;
    private expandChart2: boolean = true;
    private expandChart3: boolean = true;
    private discountedChartDataAllScenarios = [
        ["tlOutputGraphsScenario1DCFYr1", "tlOutputGraphsScenario1DCFYr2", "tlOutputGraphsScenario1DCFYr3", "tlOutputGraphsScenario1DCFYr4", "tlOutputGraphsScenario1DCFYr5", "tlOutputGraphsScenario1DCFYr6", "tlOutputGraphsScenario1DCFYr9", "tlOutputGraphsScenario1DCFYr8", "tlOutputGraphsScenario1DCFYr9", "tlOutputGraphsScenario1DCFYr10"], 
        ["tlOutputGraphsScenario2DCFYr1", "tlOutputGraphsScenario2DCFYr2", "tlOutputGraphsScenario2DCFYr3", "tlOutputGraphsScenario2DCFYr4", "tlOutputGraphsScenario2DCFYr5", "tlOutputGraphsScenario2DCFYr6", "tlOutputGraphsScenario2DCFYr9", "tlOutputGraphsScenario2DCFYr8", "tlOutputGraphsScenario2DCFYr9", "tlOutputGraphsScenario2DCFYr10"], 
        ["tlOutputGraphsScenario3DCFYr1", "tlOutputGraphsScenario3DCFYr2", "tlOutputGraphsScenario3DCFYr3", "tlOutputGraphsScenario3DCFYr4", "tlOutputGraphsScenario3DCFYr5", "tlOutputGraphsScenario3DCFYr6", "tlOutputGraphsScenario3DCFYr9", "tlOutputGraphsScenario3DCFYr8", "tlOutputGraphsScenario3DCFYr9", "tlOutputGraphsScenario3DCFYr10"]
    ];
    private discountedChartDataScenario1 = [["tlOutputGraphsScenario1DCFYr1", "tlOutputGraphsScenario1DCFYr2", "tlOutputGraphsScenario1DCFYr3", "tlOutputGraphsScenario1DCFYr4", "tlOutputGraphsScenario1DCFYr5", "tlOutputGraphsScenario1DCFYr6", "tlOutputGraphsScenario1DCFYr9", "tlOutputGraphsScenario1DCFYr8", "tlOutputGraphsScenario1DCFYr9", "tlOutputGraphsScenario1DCFYr10"]];
    
    private discountedChartSeriesAllScenarios = ["Scenario1", "Scenario2", "Scenario3"];
    private discountedChartSeriesScenarios1 = ["Scenario1"];

    private discountedChartSeries;
    private discountedChartData;
    private hideSeries: Array<number> = [];
    private toggleShowAllScenarios: boolean = true;
    @ViewChild('epvChart') epvChartRef: BasicColumnComponent;
    @ViewChild('discountedChart') discountedChartRef: BasicLineComponent;
    constructor(private dataStore: DataStore ,private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {

        this.printEventListener = this.dataStore.getObservableFor(EVENTS.PRINT_PAGE).subscribe(() => {
            this.dataStore.setData(PRINT_DATA, this.getPrintReportData());
        });

        this.discountedChartData = this.discountedChartDataAllScenarios;
        this.discountedChartSeries = this.discountedChartSeriesAllScenarios;
        this.seriesDataScenario1 = [
        {
            type: 'column',
            name: 'SalesMarketing',
            data: ['tlOutputGraphsScenario1SnMTotYr1','tlOutputGraphsScenario1SnMTotYr2','tlOutputGraphsScenario1SnMTotYr3','tlOutputGraphsScenario1SnMTotYr4','tlOutputGraphsScenario1SnMTotYr5','tlOutputGraphsScenario1SnMTotYr6','tlOutputGraphsScenario1SnMTotYr7','tlOutputGraphsScenario1SnMTotYr8','tlOutputGraphsScenario1SnMTotYr9','tlOutputGraphsScenario1SnMTotYr10']
        },
        {
            type: 'column',
            name: 'ResearchDevelopment',
            data: ['tlOutputGraphsScenario1RnDTotYr1','tlOutputGraphsScenario1RnDTotYr2','tlOutputGraphsScenario1RnDTotYr3','tlOutputGraphsScenario1RnDTotYr4','tlOutputGraphsScenario1RnDTotYr5','tlOutputGraphsScenario1RnDTotYr6','tlOutputGraphsScenario1RnDTotYr7','tlOutputGraphsScenario1RnDTotYr8','tlOutputGraphsScenario1RnDTotYr9','tlOutputGraphsScenario1RnDTotYr10']
        },
        {
            type: 'column',
            name: 'COGS',
            data: ['tlOutputGraphsScenario1COGSTotYr1','tlOutputGraphsScenario1COGSTotYr2','tlOutputGraphsScenario1COGSTotYr3','tlOutputGraphsScenario1COGSTotYr4','tlOutputGraphsScenario1COGSTotYr5','tlOutputGraphsScenario1COGSTotYr6','tlOutputGraphsScenario1COGSTotYr7','tlOutputGraphsScenario1COGSTotYr8','tlOutputGraphsScenario1COGSTotYr9','tlOutputGraphsScenario1COGSTotYr10']
        },
         {
            type: 'column',
            name: 'Revenues',
            data: ['tlOutputGraphsScenario1SalesTotYr1','tlOutputGraphsScenario1SalesTotYr2','tlOutputGraphsScenario1SalesTotYr3','tlOutputGraphsScenario1SalesTotYr4','tlOutputGraphsScenario1SalesTotYr5','tlOutputGraphsScenario1SalesTotYr6','tlOutputGraphsScenario1SalesTotYr7','tlOutputGraphsScenario1SalesTotYr8','tlOutputGraphsScenario1SalesTotYr9','tlOutputGraphsScenario1SalesTotYr10']
        },
        {
            type: 'spline',
            name: 'OperatingMargin',
            data: ['tlOutputGraphsScenario1OMTotYr1','tlOutputGraphsScenario1OMTotYr2','tlOutputGraphsScenario1OMTotYr3','tlOutputGraphsScenario1OMTotYr4','tlOutputGraphsScenario1OMTotYr5','tlOutputGraphsScenario1OMTotYr6','tlOutputGraphsScenario1OMTotYr7','tlOutputGraphsScenario1OMTotYr8','tlOutputGraphsScenario1OMTotYr9','tlOutputGraphsScenario1OMTotYr10']
        }];

        this.seriesDataScenario2 = [
        {
            type: 'column',
            name: 'SalesMarketing',
            data: ['tlOutputGraphsScenario2SnMTotYr1','tlOutputGraphsScenario2SnMTotYr2','tlOutputGraphsScenario2SnMTotYr3','tlOutputGraphsScenario2SnMTotYr4','tlOutputGraphsScenario2SnMTotYr5','tlOutputGraphsScenario2SnMTotYr6','tlOutputGraphsScenario2SnMTotYr7','tlOutputGraphsScenario2SnMTotYr8','tlOutputGraphsScenario2SnMTotYr9','tlOutputGraphsScenario2SnMTotYr10']
        },
        {
            type: 'column',
            name: 'ResearchDevelopment',
            data: ['tlOutputGraphsScenario2RnDTotYr1','tlOutputGraphsScenario2RnDTotYr2','tlOutputGraphsScenario2RnDTotYr3','tlOutputGraphsScenario2RnDTotYr4','tlOutputGraphsScenario2RnDTotYr5','tlOutputGraphsScenario2RnDTotYr6','tlOutputGraphsScenario2RnDTotYr7','tlOutputGraphsScenario2RnDTotYr8','tlOutputGraphsScenario2RnDTotYr9','tlOutputGraphsScenario2RnDTotYr10']
        },
        {
            type: 'column',
            name: 'COGS',
            data: ['tlOutputGraphsScenario2COGSTotYr1','tlOutputGraphsScenario2COGSTotYr2','tlOutputGraphsScenario2COGSTotYr3','tlOutputGraphsScenario2COGSTotYr4','tlOutputGraphsScenario2COGSTotYr5','tlOutputGraphsScenario2COGSTotYr6','tlOutputGraphsScenario2COGSTotYr7','tlOutputGraphsScenario2COGSTotYr8','tlOutputGraphsScenario2COGSTotYr9','tlOutputGraphsScenario2COGSTotYr10']
        },
         {
            type: 'column',
            name: 'Revenues',
            data: ['tlOutputGraphsScenario2SalesTotYr1','tlOutputGraphsScenario2SalesTotYr2','tlOutputGraphsScenario2SalesTotYr3','tlOutputGraphsScenario2SalesTotYr4','tlOutputGraphsScenario2SalesTotYr5','tlOutputGraphsScenario2SalesTotYr6','tlOutputGraphsScenario2SalesTotYr7','tlOutputGraphsScenario2SalesTotYr8','tlOutputGraphsScenario2SalesTotYr9','tlOutputGraphsScenario2SalesTotYr10']
        },
        {
            type: 'spline',
            name: 'OperatingMargin',
            data: ['tlOutputGraphsScenario2OMTotYr1','tlOutputGraphsScenario2OMTotYr2','tlOutputGraphsScenario2OMTotYr3','tlOutputGraphsScenario2OMTotYr4','tlOutputGraphsScenario2OMTotYr5','tlOutputGraphsScenario2OMTotYr6','tlOutputGraphsScenario2OMTotYr7','tlOutputGraphsScenario2OMTotYr8','tlOutputGraphsScenario2OMTotYr9','tlOutputGraphsScenario2OMTotYr10']
        }];

        this.seriesDataScenario3 = [
        {
            type: 'column',
            name: 'SalesMarketing',
            data: ['tlOutputGraphsScenario3SnMTotYr1','tlOutputGraphsScenario3SnMTotYr2','tlOutputGraphsScenario3SnMTotYr3','tlOutputGraphsScenario3SnMTotYr4','tlOutputGraphsScenario3SnMTotYr5','tlOutputGraphsScenario3SnMTotYr6','tlOutputGraphsScenario3SnMTotYr7','tlOutputGraphsScenario3SnMTotYr8','tlOutputGraphsScenario3SnMTotYr9','tlOutputGraphsScenario3SnMTotYr10']
        },
        {
            type: 'column',
            name: 'ResearchDevelopment',
            data: ['tlOutputGraphsScenario3RnDTotYr1','tlOutputGraphsScenario3RnDTotYr2','tlOutputGraphsScenario3RnDTotYr3','tlOutputGraphsScenario3RnDTotYr4','tlOutputGraphsScenario3RnDTotYr5','tlOutputGraphsScenario3RnDTotYr6','tlOutputGraphsScenario3RnDTotYr7','tlOutputGraphsScenario3RnDTotYr8','tlOutputGraphsScenario3RnDTotYr9','tlOutputGraphsScenario3RnDTotYr10']
        },
        {
            type: 'column',
            name: 'COGS',
            data: ['tlOutputGraphsScenario3COGSTotYr1','tlOutputGraphsScenario3COGSTotYr2','tlOutputGraphsScenario3COGSTotYr3','tlOutputGraphsScenario3COGSTotYr4','tlOutputGraphsScenario3COGSTotYr5','tlOutputGraphsScenario3COGSTotYr6','tlOutputGraphsScenario3COGSTotYr7','tlOutputGraphsScenario3COGSTotYr8','tlOutputGraphsScenario3COGSTotYr9','tlOutputGraphsScenario3COGSTotYr10']
        },
         {
            type: 'column',
            name: 'Revenues',
            data: ['tlOutputGraphsScenario3SalesTotYr1','tlOutputGraphsScenario3SalesTotYr2','tlOutputGraphsScenario3SalesTotYr3','tlOutputGraphsScenario3SalesTotYr4','tlOutputGraphsScenario3SalesTotYr5','tlOutputGraphsScenario3SalesTotYr6','tlOutputGraphsScenario3SalesTotYr7','tlOutputGraphsScenario3SalesTotYr8','tlOutputGraphsScenario3SalesTotYr9','tlOutputGraphsScenario3SalesTotYr10']
        },
        {
            type: 'spline',
            name: 'OperatingMargin',
            data: ['tlOutputGraphsScenario3OMTotYr1','tlOutputGraphsScenario3OMTotYr2','tlOutputGraphsScenario3OMTotYr3','tlOutputGraphsScenario3OMTotYr4','tlOutputGraphsScenario3OMTotYr5','tlOutputGraphsScenario3OMTotYr6','tlOutputGraphsScenario3OMTotYr7','tlOutputGraphsScenario3OMTotYr8','tlOutputGraphsScenario3OMTotYr9','tlOutputGraphsScenario3OMTotYr10']
        }];
    }

    toggleAllScenarios() {
        this.toggleShowAllScenarios = !this.toggleShowAllScenarios;
        this.hideSeries = (this.toggleShowAllScenarios) ? [] : [1, 2];
        // this.discountedChartData = (this.toggleShowAllScenarios) ? this.discountedChartDataAllScenarios : this.discountedChartDataScenario1;
        // this.discountedChartSeries = (this.toggleShowAllScenarios) ? this.discountedChartSeriesAllScenarios : this.discountedChartSeriesScenarios1;
    }

    onCollapseChart1(){
        this.expandChart1 = this.expandChart1? false : true;
    }

    onCollapseChart2(){
        this.expandChart2 = this.expandChart2? false : true;
    }

    onCollapseChart3(){
        this.expandChart3 = this.expandChart3? false : true;
    }
    ngOnDestroy() {
        this.printEventListener.unsubscribe();
    }

    private getPrintReportData(): Array<any> {
        let SummaryTableAllScenario =  [
        {
            "type": "headertext",
            "content": "PrintReportPage"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "ProjectName", "indent": 0, "isHeading": true }, { "value": "tlInputPlanProjectName" }],
                "class": "heading-row"
                },
            {
                "columns": [{ "text": "DiseaseArea", "indent": 0 }, { "value": "tlInputPlanDiseaseArea" }]
            },
            {
                "columns": [{ "text": "Formulation", "indent": 0 }, { "value": "tlInputPlanFormulation" }]
            },
            {
                "columns": [{ "text": "TargetIndication", "indent": 0 }, { "value": "tlInputPlanTargetIndication" }]
            },
            {
                "columns": [{ "text": "ProjectStartDate", "indent": 0 }, { "value": "tlInputPlanProjectStartDate" }]
            },
            {
                "columns": [{ "text": "TargetLaunchDate", "indent": 0 }, { "value": "tlInputPlanTargetLaunchDate" }]
            },
            {
                "columns": [{ "text": "CurrentStage", "indent": 0 }, { "value": "tlInputPlanCurrentStage" }]
            },
            {
                "columns": [{ "text": "LOE", "indent": 0 }, { "value": "tlInputPlanLOEDate" }]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "", "indent": 0, "isHeading": true }, { "text": "Scenario1", "indent": 0, "isHeading": true }, { "text": "Scenario2", "indent": 0, "isHeading": true }, { "text": "Scenario3", "indent": 0, "isHeading": true }],
                "class": "heading-row"
                },
            {
                "columns": [{ "text": "Metric1", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1ROI", "format":"0.0%" }, { "value": "tlOutputReportSummaryScenario2ROI", "format":"0.0%" }, { "value": "tlOutputReportSummaryScenario3ROI", "format":"0.0%" }]
            },
            {
                "columns": [{ "text": "Metric2", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1EPV", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario2EPV", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario3EPV", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric3", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1NPV", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario2NPV", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario3NPV", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric4", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1PeakSales", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario2PeakSales", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario3PeakSales", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric5", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1LaunchDate" }, { "value": "tlOutputReportSummaryScenario2LaunchDate" }, { "value": "tlOutputReportSummaryScenario3LaunchDate" }]
            },
            {
                "columns": [{ "text": "Metric6", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1RnDCost", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario2RnDCost", "format":"($0,0a)" }, { "value": "tlOutputReportSummaryScenario3RnDCost", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric7", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1POS", "format":"0.0%" }, { "value": "tlOutputReportSummaryScenario2POS", "format":"0.0%" }, { "value": "tlOutputReportSummaryScenario3POS", "format":"0.0%" }]
            },
            {
                "columns": [{ "text": "PrintBreakeven", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1Breakeven" }, { "value": "tlOutputReportSummaryScenario2Breakeven" }, { "value": "tlOutputReportSummaryScenario3Breakeven" }]
            },
            {
                "columns": [{ "text": "IRR", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1IRR", "format":"0.0%" }, { "value": "tlOutputReportSummaryScenario2IRR", "format":"0.0%" }, { "value": "tlOutputReportSummaryScenario3IRR", "format":"0.0%" }]
            }]
        },
        {
            "type": "linebreak"
        },{
            "type": "image",
            "content": [this.epvChartRef.getChartAsImageURI(), this.discountedChartRef.getChartAsImageURI()]
        }];


        let SummaryTableScenario1 =  [
        {
            "type": "headertext",
            "content": "PrintReportPage"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "ProjectName", "indent": 0, "isHeading": true }, { "value": "tlInputPlanProjectName" }],
                "class": "heading-row"
                },
            {
                "columns": [{ "text": "DiseaseArea", "indent": 0 }, { "value": "tlInputPlanDiseaseArea" }]
            },
            {
                "columns": [{ "text": "Formulation", "indent": 0 }, { "value": "tlInputPlanFormulation" }]
            },
            {
                "columns": [{ "text": "TargetIndication", "indent": 0 }, { "value": "tlInputPlanTargetIndication" }]
            },
            {
                "columns": [{ "text": "Administration", "indent": 0 }, { "value": "tlInputPlanDrugAdministration" }]
            },
            {
                "columns": [{ "text": "ProjectStartDate", "indent": 0 }, { "value": "tlInputPlanProjectStartDate" }]
            },
            {
                "columns": [{ "text": "TargetLaunchDate", "indent": 0 }, { "value": "tlInputPlanTargetLaunchDate" }]
            },
            {
                "columns": [{ "text": "CurrentStage", "indent": 0 }, { "value": "tlInputPlanCurrentStage" }]
            },
            {
                "columns": [{ "text": "LOE", "indent": 0 }, { "value": "tlInputPlanLOEDate" }]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "", "indent": 0, "isHeading": true }, { "text": "Scenario1", "indent": 0, "isHeading": true }],
                "class": "heading-row"
                },
            {
                "columns": [{ "text": "Metric1", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1ROI", "format":"0.0%" }]
            },
            {
                "columns": [{ "text": "Metric2", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1EPV", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric3", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1NPV", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric4", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1PeakSales", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric5", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1LaunchDate" }]
            },
            {
                "columns": [{ "text": "Metric6", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1RnDCost", "format":"($0,0a)" }]
            },
            {
                "columns": [{ "text": "Metric7", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1POS", "format":"0.0%" }]
            },
            {
                "columns": [{ "text": "PrintBreakeven", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1Breakeven" }]
            },
            {
                "columns": [{ "text": "IRR", "indent": 0 }, { "value": "tlOutputReportSummaryScenario1IRR", "format":"0.0%" }]
            }]
        },
        {
            "type": "linebreak"
        },{
            "type": "image",
            "content": [this.epvChartRef.getChartAsImageURI(), this.discountedChartRef.getChartAsImageURI()]
        }];


        if(this.toggleShowAllScenarios){
            return SummaryTableAllScenario;
        }else{
            return SummaryTableScenario1;
        }
    }
}