import { Component, Input, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule';
// import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { Utils, DataStore, EVENTS, ROUTES, PRINT_DATA } from '../../utils';

@Component({
    selector: 'developmentplan',
    templateUrl: './development.plan.component.html',
    styleUrls: ['./development.plan.component.css'],
    providers: []
})

export class DevelopmentPlanComponent implements OnInit, OnDestroy {
    private content: string = "";
    private resetEventListener: EventEmitter<any>;
    private printEventListener: EventEmitter<any>;
    private modelChangeListner: EventEmitter<any>;
    private arrInputRefs: Array<string>;
    private metricsMaster = {};
    private metric1: Array<string> = [];
    private metric2: Array<string> = [];
    private metric3: Array<string> = [];
    
    constructor(private utils: Utils, private router: Router, private dataStore: DataStore, private calcService: CalcService) { };

    ngOnInit() {
        let self = this;
        this.metricsMaster = {
            "ROI": "Metric1",
            "EPV": "Metric2",
            "NPV": "Metric3",
            "Peak Sales": "Metric4",
            "Launch Date": "Metric5",
            "R&D Cost": "Metric6",
            "POS": "Metric7"
        }
        this.resetEventListener = this.dataStore.getObservableFor(EVENTS.RESET_TOOL_PAGE).subscribe(() => {
            this.utils.resetInputs(this.arrInputRefs, this.calcService);
        });

        this.printEventListener = this.dataStore.getObservableFor(EVENTS.PRINT_PAGE).subscribe(() => {
            this.dataStore.setData(PRINT_DATA, this.getPrintReportData());
        });
            
        self.updateMetrics();

        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            self.updateMetrics();
        });

        this.arrInputRefs = ['tlInputPlanNotes1', 'tlInputPlanQ1Metric1', 'tlInputPlanQ1Metric2', 'tlInputPlanQ1Metric3',
            'tlInputPlanQ1Notes', 'tlInputPlanQ2Notes', 'tlInputPlanQ3Notes', 'tlInputPlanQ4Assumption1', 'tlInputPlanQ4Assumption2', 
            'tlInputPlanQ4Assumption3', 'tlInputPlanQ4Notes', 'tlInputPlanQ5', 'tlInputPlanQ6', 
            'tlInputPlanDiseaseArea', 'tlInputPlanFormulation', 'tlInputPlanTargetIndication', 'tlInputPlanProjectStartDate', 
            'tlInputPlanTargetLaunchDate', 'tlInputPlanCurrentStage', 'tlInputPlanLOEDate', 'tlInputPlanDrugAdministration', 
            'tlInputPlanInLicenseStage', 'tlInputPlanInLicenseCost'
        ];
    }

    updateMetrics(){
        let metric2Value,
            metric3Value,
            metric1Index = 1,
            metric2Index = 2;
        for(let i=0;i<3;i++){
            metric1Index++;
            metric2Index++;
            if(metric1Index > 3){
                metric1Index = 1;
            }else if(metric2Index > 3 ){
                metric2Index = 1;
            }
            metric2Value = this.calcService.getValue("tlInputPlanQ1Metric"+metric1Index),
            metric3Value = this.calcService.getValue("tlInputPlanQ1Metric"+metric2Index);
            this['metric'+(i + 1)] = [];
            for(let key in this.metricsMaster){
                if(key == metric2Value || key == metric3Value){
                    continue;
                }else{
                    this['metric'+(i + 1)].push(this.metricsMaster[key]);
                }
            }
        }
    }

    private getPrintReportData(): Array<any> {
        return [
        {
            "type": "headertext",
            "content": "AlignmentPlanning"
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
            },
            {
                "columns": [{ "text": "Notes", "indent": 0 }, { "value": "tlInputPlanNotes1" }]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{"text": "PreliminaryPlan"}],
                "class": "heading-row"
            },
            {
                "columns": [{"text": "PrimaryMetrics"}, {"text": ""}]
            },
            {
                "columns": [{ "text": "MetricText1", "indent": 1 }, { "value": "tlInputPlanQ1Metric1" }]
            },
            {
                "columns": [{ "text": "MetricText2", "indent": 1 }, { "value": "tlInputPlanQ1Metric2" }]
            },
            {
                "columns": [{ "text": "MetricText3", "indent": 1 }, { "value": "tlInputPlanQ1Metric3" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentPurpose", "indent": 0 }, { "value": "tlInputPlanQ2Notes" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentAssets", "indent": 0 }, { "value": "tlInputPlanQ3Notes" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentAssumptions"}, { "text": "" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentAssumptionsRisk1", "indent": 1 }, { "value": "tlInputPlanQ4Assumption1" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentAssumptionsRisk2", "indent": 1 }, { "value": "tlInputPlanQ4Assumption2" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentAssumptionsRisk2", "indent": 1 }, { "value": "tlInputPlanQ4Assumption3" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentInvestments", "indent": 0 }, { "value": "tlInputPlanQ5" }]
            },
            {
                "columns": [{ "text": "PrintDevelopmentOpportunities", "indent": 0 }, { "value": "tlInputPlanQ6" }]
            }]
        }];
    }

    
    onDone(){
        this.router.navigateByUrl(ROUTES.SCENARIO);
    }

    ngOnDestroy() {
        this.resetEventListener.unsubscribe();
        this.printEventListener.unsubscribe();
    }

    onMetricChange(){
        debugger
    }

}
