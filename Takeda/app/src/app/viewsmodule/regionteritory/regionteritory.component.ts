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
    selector: 'regionteritory',
    templateUrl: './regionteritory.component.html',
    styleUrls: ['./regionteritory.component.styl'],
    providers: []
})

export class RegionTeritoryComponent implements OnInit, OnDestroy {
    private activeIndex:number = 1;
    private areaHeading1:string = "";
    private areaHeading2:string = "";
    private areaHeading3:string = "";
    private titleKey:string = "Riverrun";
    private subscription:any;
    private area: string="Prod";

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private dataStore : DataStore, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            // this.areaHeading = "District";
            this.area = "Reg";
            this.titleKey = "Westeros"
        }
        this.areaHeading1 = this.textengineService.getText(this.area+"Title1");
        this.areaHeading2 = this.textengineService.getText(this.area+"Title2");
        this.areaHeading3 = this.textengineService.getText(this.area+"Title3");
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.updateArea();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateArea(){
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            // this.areaHeading = "District";
            this.area = "Reg";
            this.titleKey = "Westeros"
        }else{
            // this.areaHeading = "Footprint";
            this.area = "Prod";
            this.titleKey = "Riverrun";
        }
        this.areaHeading1 = this.textengineService.getText(this.area+"Title1");
        this.areaHeading2 = this.textengineService.getText(this.area+"Title2");
        this.areaHeading3 = this.textengineService.getText(this.area+"Title3");
    }

    setActiveIndex(activeIndex: number){
        this.activeIndex = activeIndex;
    }
}