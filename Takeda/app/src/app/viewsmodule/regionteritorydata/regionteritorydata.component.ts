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
    selector: 'regionteritorydata',
    templateUrl: './regionteritorydata.component.html',
    styleUrls: ['./regionteritorydata.component.styl'],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegionTeritoryDataComponent implements OnInit, OnDestroy {
    @Input() areaId: number = 1;
    private area:string = "Prod";
    private areaHeading:string = "Territory";
    private marketShareRangeRef:string;
    private profitLossRangeRef:string;
    private areaManagementRangeRef:string;
    private internalMetricsRangeRef:string;
    private managementChartLabels:string;
    private currentYear: string = "1";
    private subscription:any;

    constructor(private utils: Utils, private dataStore: DataStore, private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        //get district or territory
        // this.area = this.calcService.getValue("")tlOutputProd1Seg1PrevInternalCost_R1
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            this.area = "Reg";
        }
        this.updateChartReferences();
        
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.updateArea();
        });
        this.currentYear = this.calcService.getValue("tlTeamRound");
    }

    updateChartReferences(){
        this.marketShareRangeRef = "[tlOutput"+this.area+"1Seg"+this.areaId+"PrevTRxShare, tlOutput"+this.area+"1Seg"+this.areaId+"PrevNRxShare],[tlOutput"+this.area+"1Seg"+this.areaId+"CurrentTRxShare, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentNRxShare]";
        this.internalMetricsRangeRef = "[tlOutput"+this.area+"1Seg"+this.areaId+"PrevESAT, tlOutput"+this.area+"1Seg"+this.areaId+"PrevOE],[tlOutput"+this.area+"1Seg"+this.areaId+"CurrentESAT, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentOE]";
        this.profitLossRangeRef = "[tlOutput"+this.area+"1Seg"+this.areaId+"PrevProfit, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentProfit],[tlOutput"+this.area+"1Seg"+this.areaId+"PrevInternalCost, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentInternalCost],[tlOutput"+this.area+"1Seg"+this.areaId+"PrevLunchMoneyCost, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentLunchMoneyCost],[tlOutput"+this.area+"1Seg"+this.areaId+"CurrentSpeakersCost, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentSpeakersCost],[tlOutput"+this.area+"1Seg"+this.areaId+"PrevSamplesCost, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentSampleCost],[tlOutput"+this.area+"1Seg"+this.areaId+"PrevReimb, tlOutput"+this.area+"1Seg"+this.areaId+"CurrentReimb]";
        this.areaManagementRangeRef = "[tlOutput"+this.area+"1Seg"+this.areaId+"Rep1IntTime, tlOutput"+this.area+"1Seg"+this.areaId+"Rep2IntTime, tlOutput"+this.area+"1Seg"+this.areaId+"Rep3IntTime],[tlOutput"+this.area+"1Seg"+this.areaId+"Rep1ExtTime, tlOutput"+this.area+"1Seg"+this.areaId+"Rep2ExtTime, tlOutput"+this.area+"1Seg"+this.areaId+"Rep3ExtTime]";
        if(this.area=='Prod'){
            this.managementChartLabels = ""+this.area+"ManagementChartLabel"+(1+(3*(this.areaId-1)))+", "+this.area+"ManagementChartLabel"+(2+(3*(this.areaId-1)))+", "+this.area+"ManagementChartLabel"+(3+(3*(this.areaId-1)));
        }else{
            this.managementChartLabels = ""+this.area+"ManagementChartLabelA, "+this.area+"ManagementChartLabelB, "+this.area+"ManagementChartLabelC";
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateArea(){
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            this.area = "Reg";
        }else{
            this.area = "Prod";
        }
        this.cdRef.markForCheck();
        this.updateChartReferences();
    }
}
