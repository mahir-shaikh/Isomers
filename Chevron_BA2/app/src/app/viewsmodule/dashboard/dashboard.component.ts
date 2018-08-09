import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'

const KEY_NUM_0 = 48; // used to reset sim
const KEY_NUM_1 = 49; // used to export data

@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent implements AfterViewInit {
    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    @ViewChild('resourcesModal') public resourcesModalRef: ModalDirective;
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    private routeObserver: any;
    private showMenu:boolean = false;
    private tableHeadings: Array<string> = [];
    private earningGraphBaseRange: Array<string>=[];
    private earningGraphCurrentRange: Array<string>=[];
    private categorylabels: Array<string>=[];
    private netEarningsrangeRef:Array<any>=[];
    private cashFlowrangeRef:Array<any>=[];
    private cashFlowBaseRange: Array<string> =[];
    private cashFlowCurrentRange: Array<string> =[];
    private hurdle3RangeRef:Array<Array<string>>=[];
    private hurdle5RangeRef:Array<Array<string>>=[];
    private scenario1RangeRef:Array<string>=[];
    private scenario2RangeRef:Array<string>=[];
    private scenario3RangeRef:Array<string>=[];
    private scenario4RangeRef:Array<string>=[];
    private DPIRangeRef:Array<any>=[];
    private table2Ranges: Array<string> = [];
    private serieslabels: Array<string>=[];
    private arrResetInputs: Array<string> = [];
    private isCollapsed1: boolean = false;
    private isCollapsed2: boolean = false;
    private arrInputs: Array<string> = ["tlInputSched", "tlInputCapEx", "tlInputProd", "tlInputRes", "tlInputRel", "tlInputOpEx", "tlInputNetback", "tlInputWorkingCap"];
    private arrResetRefs: Array<string> = ["tlOutputResetSched", "tlOutputResetCapEx", "tlOutputResetProd", "tlOutputResetRes", "tlOutputResetRel", "tlOutputResetOpEx", "tlOutputResetNetback", "tlOutputResetWorkingCap"];
    private arrScenario1Refs : Array<string> = ["tlOutput_tlInputFinancials_K6", "tlOutput_tlInputFinancials_K7", "tlOutput_tlInputFinancials_K8", "tlOutput_tlInputFinancials_K9", "tlOutput_tlInputFinancials_K11", "tlOutput_tlInputFinancials_K12", "tlOutput_tlInputFinancials_K13", "tlOutput_tlInputFinancials_K14", "tlOutput_tlInputFinancials_K15"];
    private arrScenario2Refs : Array<string> = ["tlOutput_tlInputFinancials_L6", "tlOutput_tlInputFinancials_L7", "tlOutput_tlInputFinancials_L8", "tlOutput_tlInputFinancials_L9", "tlOutput_tlInputFinancials_L11", "tlOutput_tlInputFinancials_L12", "tlOutput_tlInputFinancials_L13", "tlOutput_tlInputFinancials_L14", "tlOutput_tlInputFinancials_L15"];
    private arrScenario3Refs : Array<string> = ["tlOutput_tlInputFinancials_M6", "tlOutput_tlInputFinancials_M7", "tlOutput_tlInputFinancials_M8", "tlOutput_tlInputFinancials_M9", "tlOutput_tlInputFinancials_M11", "tlOutput_tlInputFinancials_M12", "tlOutput_tlInputFinancials_M13", "tlOutput_tlInputFinancials_M15", "tlOutput_tlInputFinancials_M16"];
    private arrScenario4Refs : Array<string> = ["tlOutput_tlInputFinancials_N6", "tlOutput_tlInputFinancials_N7", "tlOutput_tlInputFinancials_N8", "tlOutput_tlInputFinancials_N9", "tlOutput_tlInputFinancials_N11", "tlOutput_tlInputFinancials_N12", "tlOutput_tlInputFinancials_N13", "tlOutput_tlInputFinancials_N15", "tlOutput_tlInputFinancials_N16"];
    private arrCurrentValueRefs : Array<string> = ["tlOutputDash1", "tlOutputDash2", "tlOutputDash3", "tlOutputDash4", "tlInputSched", "tlInputCapEx","tlOutputDash5", "tlInputProd", "tlInputRes"];
    private lineChartOption: string = '{"yAxis":{"title":{"text": "NPV ($MM)" }},"xAxis":{"title":{"text": "PV Investment ($MM)" }}}';
    @ViewChild('scrollContainer') public scrollContainerRef: ElementRef;
    private seriesData = [];
    private showBlankS1: boolean = false;
    private showBlankS2: boolean = false;
    private showBlankS3: boolean = false;
    private showBlankS4: boolean = false;

    @HostListener('document:keyup', ['$event'])
    onKeypress($event) {
        // console.log("Key pressed :: " + $event.keyCode, $event.shiftKey, $event.ctrlKey);
        if ($event.keyCode === KEY_NUM_0 && $event.shiftKey && $event.ctrlKey) {
            this.resetSim();
        }
        if ($event.keyCode === KEY_NUM_1 && $event.shiftKey && $event.ctrlKey) {
            this.exportData();
        }

    }

    constructor(private dataStore: DataStore, private utils: Utils, private router: Router, private calcService: CalcService, private textEngineService: TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.updateLMS();
        
        self.onRouteChange();
        this.routeObserver = this.router.events.subscribe((val) => {
            if(val instanceof NavigationEnd){
                self.onRouteChange();
            }            
        });
        this.tableHeadings.push("Project Financials");
        this.tableHeadings.push("BUI Financials");
        this.earningGraphBaseRange = ["tlOutput_Graphs_E3","tlOutput_Graphs_F3","tlOutput_Graphs_G3","tlOutput_Graphs_H3","tlOutput_Graphs_I3","tlOutput_Graphs_J3","tlOutput_Graphs_K3","tlOutput_Graphs_L3","tlOutput_Graphs_M3","tlOutput_Graphs_N3"];
        this.earningGraphCurrentRange = ["tlOutput_Graphs_E4","tlOutput_Graphs_F4","tlOutput_Graphs_G4","tlOutput_Graphs_H4","tlOutput_Graphs_I4","tlOutput_Graphs_J4","tlOutput_Graphs_K4","tlOutput_Graphs_L4","tlOutput_Graphs_M4","tlOutput_Graphs_N4"];
        this.netEarningsrangeRef.push(this.earningGraphBaseRange);
        this.netEarningsrangeRef.push(this.earningGraphCurrentRange);
        this.cashFlowBaseRange = ["tlOutput_Graphs_E8","tlOutput_Graphs_F8","tlOutput_Graphs_G8","tlOutput_Graphs_H8","tlOutput_Graphs_I8","tlOutput_Graphs_J8","tlOutput_Graphs_K8","tlOutput_Graphs_L8","tlOutput_Graphs_M8","tlOutput_Graphs_N8"];
        this.cashFlowCurrentRange = ["tlOutput_Graphs_E9","tlOutput_Graphs_F9","tlOutput_Graphs_G9","tlOutput_Graphs_H9","tlOutput_Graphs_I9","tlOutput_Graphs_J9","tlOutput_Graphs_K9","tlOutput_Graphs_L9","tlOutput_Graphs_M9","tlOutput_Graphs_N9"];
        this.cashFlowrangeRef.push(this.cashFlowBaseRange);
        this.cashFlowrangeRef.push(this.cashFlowCurrentRange);
        this.hurdle3RangeRef = [["tlOutput_Graphs_E14","tlOutput_Graphs_E13"],["tlOutput_Graphs_F14","tlOutput_Graphs_F13"]];
        this.hurdle5RangeRef = [["tlOutput_Graphs_G14","tlOutput_Graphs_G13"],["tlOutput_Graphs_H14","tlOutput_Graphs_H13"]];
        this.scenario1RangeRef =["tlOutput_Graphs_I14","tlOutput_Graphs_I13"];
        this.scenario2RangeRef =["tlOutput_Graphs_J14","tlOutput_Graphs_J13"];
        this.scenario3RangeRef =["tlOutput_Graphs_K14","tlOutput_Graphs_K13"];
        this.scenario4RangeRef =["tlOutput_Graphs_L14","tlOutput_Graphs_L13"];
        this.DPIRangeRef.push(this.hurdle3RangeRef);
        this.DPIRangeRef.push(this.hurdle5RangeRef);
        this.DPIRangeRef.push(this.scenario1RangeRef);
        this.DPIRangeRef.push(this.scenario2RangeRef);
        this.DPIRangeRef.push(this.scenario3RangeRef);
        this.DPIRangeRef.push(this.scenario4RangeRef);
        this.serieslabels= ["Baseline","Current"];

        this.seriesData = [
            {
                type: 'column',
                name: 'CombinationChartCategoryLabel1',
                data: ['tlOutput_Graphs_E3','tlOutput_Graphs_F3','tlOutput_Graphs_G3','tlOutput_Graphs_H3','tlOutput_Graphs_I3','tlOutput_Graphs_J3','tlOutput_Graphs_K3','tlOutput_Graphs_L3','tlOutput_Graphs_M3','tlOutput_Graphs_N3']
            },
            {
                type: 'column',
                name: 'CombinationChartCategoryLabel2',
                data: ['tlOutput_Graphs_E4','tlOutput_Graphs_F4','tlOutput_Graphs_G4','tlOutput_Graphs_H4','tlOutput_Graphs_I4','tlOutput_Graphs_J4','tlOutput_Graphs_K4','tlOutput_Graphs_L4','tlOutput_Graphs_M4','tlOutput_Graphs_N4']
            },
            {
                type: 'column',
                name: 'CombinationChartCategoryLabel3',
                data: ['tlOutput_Graphs_E5','tlOutput_Graphs_F5','tlOutput_Graphs_G5','tlOutput_Graphs_H5','tlOutput_Graphs_I5','tlOutput_Graphs_J5','tlOutput_Graphs_K5','tlOutput_Graphs_L5','tlOutput_Graphs_M5','tlOutput_Graphs_N5']
            },
            {
                type: 'column',
                name: 'CombinationChartCategoryLabel4',
                data: ['tlOutput_Graphs_E6','tlOutput_Graphs_F6','tlOutput_Graphs_G6','tlOutput_Graphs_H6','tlOutput_Graphs_I6','tlOutput_Graphs_J6','tlOutput_Graphs_K6','tlOutput_Graphs_L6','tlOutput_Graphs_M6','tlOutput_Graphs_N6']
            },
            {
                type: 'column',
                name: 'CombinationChartCategoryLabel5',
                data: ['tlOutput_Graphs_E7','tlOutput_Graphs_F7','tlOutput_Graphs_G7','tlOutput_Graphs_H7','tlOutput_Graphs_I7','tlOutput_Graphs_J7','tlOutput_Graphs_K7','tlOutput_Graphs_L7','tlOutput_Graphs_M7','tlOutput_Graphs_N7']
            },
            {
                type: 'column',
                name: 'CombinationChartCategoryLabel6',
                data: ['tlOutput_Graphs_E8','tlOutput_Graphs_F8','tlOutput_Graphs_G8','tlOutput_Graphs_H8','tlOutput_Graphs_I8','tlOutput_Graphs_J8','tlOutput_Graphs_K8','tlOutput_Graphs_L8','tlOutput_Graphs_M8','tlOutput_Graphs_N8']
            },
            {
                type: 'line',
                name: 'CombinationChartCategoryLabel7',
                data: ['tlOutput_Graphs_E9','tlOutput_Graphs_F9','tlOutput_Graphs_G9','tlOutput_Graphs_H9','tlOutput_Graphs_I9','tlOutput_Graphs_J9','tlOutput_Graphs_K9','tlOutput_Graphs_L9','tlOutput_Graphs_M9','tlOutput_Graphs_N9']
            }
        ];
    }

    onRouteChange(){
    }

    onCLickOfMenu(){
        let showMenu  = !this.showMenu;
        this.showMenu = showMenu;
    }

    closeMenu(){
        setTimeout(()=>{
            this.showMenu = false;            
        },500);
    }

    openMenu($event){
        this.showMenu = true;

        $event.preventDefault();
        $event.stopPropagation();
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
    }

    ngAfterViewInit(){
        this.resourcesModalRef.show();
    }

    showLogoutAlert(){
        this.logoutModalRef.show();
    }

    hideLogoutAlert(confirmed: boolean = false) {
        this.logoutModalRef.hide();
    }

    showResourceModal(){
        this.resourcesModalRef.show();
    }

    hideResourceModal() {
        this.resourcesModalRef.hide();
    }

    showResetModal(){        
        this.resetModalRef.show();
    }

    hideResetAlert() {
        this.resetModalRef.hide();
    }

    saveScenario(number){
        let saveArray : Array<string> = [];
        switch (number) {
            case 1:
                saveArray = this.arrScenario1Refs;
                this.showBlankS1 = true;
                break;
            case 2:
                saveArray = this.arrScenario2Refs;
                this.showBlankS2 = true;
                break;
            case 3:
                saveArray = this.arrScenario3Refs;
                this.showBlankS3 = true;
                break;
            case 4:
                saveArray = this.arrScenario4Refs;
                this.showBlankS4 = true;
                break;
        }
        this.calcService.saveScenario(this.arrCurrentValueRefs,saveArray);
    }

    clearScenario(number){
        let clearArray : Array<string> = [];
        switch (number) {
            case 1:
                clearArray = this.arrScenario1Refs;
                this.showBlankS1 = false;
                break;
            case 2:
                clearArray = this.arrScenario2Refs;
                this.showBlankS2 = false;
                break;
            case 3:
                clearArray = this.arrScenario3Refs;
                this.showBlankS3 = false;
                break;
            case 4:
                clearArray = this.arrScenario4Refs;
                this.showBlankS4 = false;
                break;
        }
        this.calcService.clearScenario(clearArray);
    }

    resetInputs(){
        this.calcService.saveScenario(this.arrResetRefs,this.arrInputs);
    }

    resetSim(){
        this.dataAdaptor.clear(null, true).then(()=>{
            window.location.reload();
        });
    }

    scrollContainerTo(num){

        let topValue = this.scrollContainerRef.nativeElement.getElementsByClassName("scroll-section")[num].offsetTop;
        // this.worksheetContainerRef.nativeElement.scrollTop = topValue;
        this.smoothScroll(this.scrollContainerRef.nativeElement,topValue,120);
    }

    smoothScroll(element, to, duration){
        let self = this;
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(()=>{
            element.scrollTop = element.scrollTop + perTick;
            // if (element.scrollTop >= to){
            //     element.scrollTop = to;
            //     return;
            // } 
            if (element.scrollTop === to) return;
            self.smoothScroll(element, to, duration - 10);
        }, 10);
    }
    accodionBtnClicked(e)
    {
        this.isCollapsed1 = !this.isCollapsed1;
    }

    exportData(){
        this.calcService.exportData(true,this.arrInputs);
    }

    onClickLink1(){
        window.open("https://sway.com/dsZAjYYhyQeUXIDI?ref=Link", "_blank");
    }

    onClickLink2(){
        window.open("https://sway.com/xU4FnUFLEnotFuxC?ref=Link", "_blank");
    }

    updateLMS(){
        let score = this.calcService.getValue("tlInput_LMS_FINISHED");
        if(score == 0){
            this.calcService.setValue("tlInput_LMS_FINISHED", 1);
        }
    }
}
