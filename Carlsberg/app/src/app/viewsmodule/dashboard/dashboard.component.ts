import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, RouterModule, ActivatedRoute, Data, Params, NavigationEnd } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'

declare var nw:any;

@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent {
   private routeObserver: any;
   private modelChangeObserver: any;
   private currentChannel: number;
   private showChannelDashboard: boolean = false;
   private showDropDown:boolean;
   private showReports: boolean = false;
   private showDecisions: boolean = false;
   private showSKUSubtitle :boolean = false;
   private showChannelSubtitle :boolean = false;
   private showChannelHeading :boolean = false;
   private showCompanyHeading :boolean = false;
   private showCustomerReportHeading: boolean = false;
   private showIncomeStatementHeading: boolean = false;
   private showDecisionSummaryHeading: boolean = false;
   private breadCrumbHeading: string = "";
   private outsideClickEventListener: any;
   private currentChackBoxClicked: any;
   private confirmToBuy1: boolean = false;
   private confirmToBuy2: boolean = false;
   private confirmToBuy3: boolean = false;
   private confirmToBuy4: boolean = false;
   private confirmToBuy5: boolean = false;
   private confirmToBuy6: boolean = false;
   private buyedReport1: boolean = false;
   private buyedReport2: boolean = false;
   private buyedReport3: boolean = false;
   private buyedReport4: boolean = false;
   private buyedReport5: boolean = false;
   private buyedReport6: boolean = false;
   private noOfReports: Array<Number> = [1,1,1,1,1,1];
   private showPasswordErrorMessage: boolean = false;
   private resetPassword: string;
   private password: string = "";
   @ViewChild('arrowDown1') arrowDown1;
   @ViewChild('arrowDown2') arrowDown2;
   @ViewChild('arrowDownText1') arrowDownText1;
   @ViewChild('arrowDownText2') arrowDownText2;
   @ViewChild('footerMenu') footerMenu;
   @ViewChild('footerMenuText') footerMenuText;
   @ViewChild('importbalances') importBalancesEl;
   @ViewChild('buyReportModal') buyReportModalEl;
   @ViewChild('exitModal') public exitModalRef: ModalDirective;
   @ViewChild('resetModal') public resetModalRef: ModalDirective;
   @ViewChild('importsuccess') public importsuccessModalRef: ModalDirective;
   private exportRangeNames: Array<string> = ["tlInputTeamNumber", "tlInputTeamRound", "tlInputTeamName", "xxRound","tlInputCh1MarkPlan", "tlInputCh1Prod1Forecast", "tlInputCh1Prod2Forecast", "tlInputCh1Prod3Forecast", "tlInputCh1Prod4Forecast", "tlInputCh1ValDriv1", "tlInputCh1ValDriv2", "tlInputCh1ValDriv3", "tlInputCh1ValDriv4", "tlInputCh1ValDriv5", "tlInputCh1ValDrivCond", "tlInputPackInnovation1", "tlInputPackInnovation2", "tlInputReport1", "tlInputReport2", "tlInputReport3", "tlInputReport4", "tlInputReport5", "tlInputReport6", "tlInputSi1", "tlInputSi2", "tlInputSi3", "tlInputCh1Prod1Slot1Active", "tlinputCh1Prod1Slot1CustPrice", "tlinputCh1Prod1Slot1Forecast", "tlinputCh1Prod1Slot1Pack", "tlinputCh1Prod1Slot1Promo1", "tlinputCh1Prod1Slot1Promo1ShareFrc", "tlinputCh1Prod1Slot1Promo1Weeks", "tlinputCh1Prod1Slot1Promo2", "tlinputCh1Prod1Slot1Promo2ShareFrc", "tlinputCh1Prod1Slot1Promo2Weeks", "tlInputCh1Prod1Slot2Active", "tlinputCh1Prod1Slot2CustPrice", "tlinputCh1Prod1Slot2Forecast", "tlinputCh1Prod1Slot2Pack", "tlinputCh1Prod1Slot2Promo1", "tlinputCh1Prod1Slot2Promo1ShareFrc", "tlinputCh1Prod1Slot2Promo1Weeks", "tlinputCh1Prod1Slot2Promo2", "tlinputCh1Prod1Slot2Promo2ShareFrc", "tlinputCh1Prod1Slot2Promo2Weeks", "tlInputCh1Prod1Slot3Active", "tlinputCh1Prod1Slot3CustPrice", "tlinputCh1Prod1Slot3Forecast", "tlinputCh1Prod1Slot3Pack", "tlinputCh1Prod1Slot3Promo1", "tlinputCh1Prod1Slot3Promo1ShareFrc", "tlinputCh1Prod1Slot3Promo1Weeks", "tlinputCh1Prod1Slot3Promo2", "tlinputCh1Prod1Slot3Promo2ShareFrc", "tlinputCh1Prod1Slot3Promo2Weeks", "tlInputCh1Prod2Slot1Active", "tlinputCh1Prod2Slot1CustPrice", "tlinputCh1Prod2Slot1Forecast", "tlinputCh1Prod2Slot1Pack", "tlinputCh1Prod2Slot1Promo1", "tlinputCh1Prod2Slot1Promo1ShareFrc", "tlinputCh1Prod2Slot1Promo1Weeks", "tlinputCh1Prod2Slot1Promo2", "tlinputCh1Prod2Slot1Promo2ShareFrc", "tlinputCh1Prod2Slot1Promo2Weeks", "tlInputCh1Prod2Slot2Active", "tlinputCh1Prod2Slot2CustPrice", "tlinputCh1Prod2Slot2Forecast", "tlinputCh1Prod2Slot2Pack", "tlinputCh1Prod2Slot2Promo1", "tlinputCh1Prod2Slot2Promo1ShareFrc", "tlinputCh1Prod2Slot2Promo1Weeks", "tlinputCh1Prod2Slot2Promo2", "tlinputCh1Prod2Slot2Promo2ShareFrc", "tlinputCh1Prod2Slot2Promo2Weeks", "tlInputCh1Prod2Slot3Active", "tlinputCh1Prod2Slot3CustPrice", "tlinputCh1Prod2Slot3Forecast", "tlinputCh1Prod2Slot3Pack", "tlinputCh1Prod2Slot3Promo1", "tlinputCh1Prod2Slot3Promo1ShareFrc", "tlinputCh1Prod2Slot3Promo1Weeks", "tlinputCh1Prod2Slot3Promo2", "tlinputCh1Prod2Slot3Promo2ShareFrc", "tlinputCh1Prod2Slot3Promo2Weeks", "tlInputCh1Prod3Slot1Active", "tlinputCh1Prod3Slot1CustPrice", "tlinputCh1Prod3Slot1Forecast", "tlinputCh1Prod3Slot1Pack", "tlinputCh1Prod3Slot1Promo1", "tlinputCh1Prod3Slot1Promo1ShareFrc", "tlinputCh1Prod3Slot1Promo1Weeks", "tlinputCh1Prod3Slot1Promo2", "tlinputCh1Prod3Slot1Promo2ShareFrc", "tlinputCh1Prod3Slot1Promo2Weeks", "tlInputCh1Prod3Slot2Active", "tlinputCh1Prod3Slot2CustPrice", "tlinputCh1Prod3Slot2Forecast", "tlinputCh1Prod3Slot2Pack", "tlinputCh1Prod3Slot2Promo1", "tlinputCh1Prod3Slot2Promo1ShareFrc", "tlinputCh1Prod3Slot2Promo1Weeks", "tlinputCh1Prod3Slot2Promo2", "tlinputCh1Prod3Slot2Promo2ShareFrc", "tlinputCh1Prod3Slot2Promo2Weeks", "tlInputCh1Prod3Slot3Active", "tlinputCh1Prod3Slot3CustPrice", "tlinputCh1Prod3Slot3Forecast", "tlinputCh1Prod3Slot3Pack", "tlinputCh1Prod3Slot3Promo1", "tlinputCh1Prod3Slot3Promo1ShareFrc", "tlinputCh1Prod3Slot3Promo1Weeks", "tlinputCh1Prod3Slot3Promo2", "tlinputCh1Prod3Slot3Promo2ShareFrc", "tlinputCh1Prod3Slot3Promo2Weeks", "tlInputCh1Prod4Slot1Active", "tlinputCh1Prod4Slot1CustPrice", "tlinputCh1Prod4Slot1Forecast", "tlinputCh1Prod4Slot1Pack", "tlinputCh1Prod4Slot1Promo1", "tlinputCh1Prod4Slot1Promo1ShareFrc", "tlinputCh1Prod4Slot1Promo1Weeks", "tlinputCh1Prod4Slot1Promo2", "tlinputCh1Prod4Slot1Promo2ShareFrc", "tlinputCh1Prod4Slot1Promo2Weeks", "tlInputCh1Prod4Slot2Active", "tlinputCh1Prod4Slot2CustPrice", "tlinputCh1Prod4Slot2Forecast", "tlinputCh1Prod4Slot2Pack", "tlinputCh1Prod4Slot2Promo1", "tlinputCh1Prod4Slot2Promo1ShareFrc", "tlinputCh1Prod4Slot2Promo1Weeks", "tlinputCh1Prod4Slot2Promo2", "tlinputCh1Prod4Slot2Promo2ShareFrc", "tlinputCh1Prod4Slot2Promo2Weeks", "tlInputCh1Prod4Slot3Active", "tlinputCh1Prod4Slot3CustPrice", "tlinputCh1Prod4Slot3Forecast", "tlinputCh1Prod4Slot3Pack", "tlinputCh1Prod4Slot3Promo1", "tlinputCh1Prod4Slot3Promo1ShareFrc", "tlinputCh1Prod4Slot3Promo1Weeks", "tlinputCh1Prod4Slot3Promo2", "tlinputCh1Prod4Slot3Promo2ShareFrc", "tlinputCh1Prod4Slot3Promo2Weeks", "tlInputCh1R1Report1", "tlInputCh1R1Report2", "tlInputCh1R2Report3", "tlInputCh1R2Report4", "tlInputCh1R3Report5", "tlInputCh1R3Report6", "tlInputCh1VT", "tlInputCh2MarkPlan", "tlInputCh2Prod1Forecast", "tlInputCh2Prod2Forecast", "tlInputCh2Prod3Forecast", "tlInputCh2Prod4Forecast", "tlInputCh2ValDriv1", "tlInputCh2ValDriv2", "tlInputCh2ValDriv3", "tlInputCh2ValDriv4", "tlInputCh2ValDriv5", "tlInputCh2ValDrivCond", "tlInputCh2Prod1Slot1Active", "tlinputCh2Prod1Slot1CustPrice", "tlinputCh2Prod1Slot1Forecast", "tlinputCh2Prod1Slot1Pack", "tlInputCh2Prod1Slot2Active", "tlinputCh2Prod1Slot2CustPrice", "tlinputCh2Prod1Slot2Forecast", "tlinputCh2Prod1Slot2Pack", "tlInputCh2Prod1Slot3Active", "tlinputCh2Prod1Slot3CustPrice", "tlinputCh2Prod1Slot3Forecast", "tlinputCh2Prod1Slot3Pack", "tlInputCh2Prod2Slot1Active", "tlinputCh2Prod2Slot1CustPrice", "tlinputCh2Prod2Slot1Forecast", "tlinputCh2Prod2Slot1Pack", "tlInputCh2Prod2Slot2Active", "tlinputCh2Prod2Slot2CustPrice", "tlinputCh2Prod2Slot2Forecast", "tlinputCh2Prod2Slot2Pack", "tlInputCh2Prod2Slot3Active", "tlinputCh2Prod2Slot3CustPrice", "tlinputCh2Prod2Slot3Forecast", "tlinputCh2Prod2Slot3Pack", "tlInputCh2Prod3Slot1Active", "tlinputCh2Prod3Slot1CustPrice", "tlinputCh2Prod3Slot1Forecast", "tlinputCh2Prod3Slot1Pack", "tlInputCh2Prod3Slot2Active", "tlinputCh2Prod3Slot2CustPrice", "tlinputCh2Prod3Slot2Forecast", "tlinputCh2Prod3Slot2Pack", "tlInputCh2Prod3Slot3Active", "tlinputCh2Prod3Slot3CustPrice", "tlinputCh2Prod3Slot3Forecast", "tlinputCh2Prod3Slot3Pack", "tlInputCh2Prod4Slot1Active", "tlinputCh2Prod4Slot1CustPrice", "tlinputCh2Prod4Slot1Forecast", "tlinputCh2Prod4Slot1Pack", "tlInputCh2Prod4Slot2Active", "tlinputCh2Prod4Slot2CustPrice", "tlinputCh2Prod4Slot2Forecast", "tlinputCh2Prod4Slot2Pack", "tlInputCh2Prod4Slot3Active", "tlinputCh2Prod4Slot3CustPrice", "tlinputCh2Prod4Slot3Forecast", "tlinputCh2Prod4Slot3Pack", "tlInputCh2R1Report1", "tlInputCh2R1Report2", "tlInputCh2R2Report3", "tlInputCh2R2Report4", "tlInputCh2R3Report5", "tlInputCh2R3Report6", "tlInputCh2VT", "tlInputCh3MarkPlan", "tlInputCh3Prod1Forecast", "tlInputCh3Prod2Forecast", "tlInputCh3Prod3Forecast", "tlInputCh3Prod4Forecast", "tlInputCh3ValDriv1", "tlInputCh3ValDriv2", "tlInputCh3ValDriv3", "tlInputCh3ValDriv4", "tlInputCh3ValDriv5", "tlInputCh3ValDrivCond", "tlInputCh3Prod1Slot1Active", "tlinputCh3Prod1Slot1CustPrice", "tlinputCh3Prod1Slot1Forecast", "tlinputCh3Prod1Slot1Pack", "tlinputCh3Prod1Slot1Promo1", "tlinputCh3Prod1Slot1Promo1ShareFrc", "tlinputCh3Prod1Slot1Promo1Weeks", "tlInputCh3Prod1Slot2Active", "tlinputCh3Prod1Slot2CustPrice", "tlinputCh3Prod1Slot2Forecast", "tlinputCh3Prod1Slot2Pack", "tlinputCh3Prod1Slot2Promo1", "tlinputCh3Prod1Slot2Promo1ShareFrc", "tlinputCh3Prod1Slot2Promo1Weeks", "tlInputCh3Prod1Slot3Active", "tlinputCh3Prod1Slot3CustPrice", "tlinputCh3Prod1Slot3Forecast", "tlinputCh3Prod1Slot3Pack", "tlinputCh3Prod1Slot3Promo1", "tlinputCh3Prod1Slot3Promo1ShareFrc", "tlinputCh3Prod1Slot3Promo1Weeks", "tlInputCh3Prod2Slot1Active", "tlinputCh3Prod2Slot1CustPrice", "tlinputCh3Prod2Slot1Forecast", "tlinputCh3Prod2Slot1Pack", "tlinputCh3Prod2Slot1Promo1", "tlinputCh3Prod2Slot1Promo1ShareFrc", "tlinputCh3Prod2Slot1Promo1Weeks", "tlInputCh3Prod2Slot2Active","tlinputCh3Prod2Slot2CustPrice", "tlinputCh3Prod2Slot2Forecast", "tlinputCh3Prod2Slot2Pack", "tlinputCh3Prod2Slot2Promo1", "tlinputCh3Prod2Slot2Promo1ShareFrc", "tlinputCh3Prod2Slot2Promo1Weeks", "tlInputCh3Prod2Slot3Active", "tlinputCh3Prod2Slot3CustPrice", "tlinputCh3Prod2Slot3Forecast", "tlinputCh3Prod2Slot3Pack", "tlinputCh3Prod2Slot3Promo1", "tlinputCh3Prod2Slot3Promo1ShareFrc", "tlinputCh3Prod2Slot3Promo1Weeks","tlInputCh3Prod3Slot1Active", "tlinputCh3Prod3Slot1CustPrice", "tlinputCh3Prod3Slot1Forecast", "tlinputCh3Prod3Slot1Pack", "tlinputCh3Prod3Slot1Promo1", "tlinputCh3Prod3Slot1Promo1ShareFrc", "tlinputCh3Prod3Slot1Promo1Weeks", "tlInputCh3Prod3Slot2Active", "tlinputCh3Prod3Slot2CustPrice", "tlinputCh3Prod3Slot2Forecast", "tlinputCh3Prod3Slot2Pack", "tlinputCh3Prod3Slot2Promo1", "tlinputCh3Prod3Slot2Promo1ShareFrc", "tlinputCh3Prod3Slot2Promo1Weeks", "tlInputCh3Prod3Slot3Active", "tlinputCh3Prod3Slot3CustPrice", "tlinputCh3Prod3Slot3Forecast", "tlinputCh3Prod3Slot3Pack", "tlinputCh3Prod3Slot3Promo1", "tlinputCh3Prod3Slot3Promo1ShareFrc", "tlinputCh3Prod3Slot3Promo1Weeks", "tlInputCh3Prod4Slot1Active", "tlinputCh3Prod4Slot1CustPrice", "tlinputCh3Prod4Slot1Forecast", "tlinputCh3Prod4Slot1Pack", "tlinputCh3Prod4Slot1Promo1", "tlinputCh3Prod4Slot1Promo1ShareFrc", "tlinputCh3Prod4Slot1Promo1Weeks", "tlInputCh3Prod4Slot2Active", "tlinputCh3Prod4Slot2CustPrice", "tlinputCh3Prod4Slot2Forecast","tlinputCh3Prod4Slot2Pack", "tlinputCh3Prod4Slot2Promo1", "tlinputCh3Prod4Slot2Promo1ShareFrc", "tlinputCh3Prod4Slot2Promo1Weeks", "tlInputCh3Prod4Slot3Active", "tlinputCh3Prod4Slot3CustPrice", "tlinputCh3Prod4Slot3Forecast", "tlinputCh3Prod4Slot3Pack", "tlinputCh3Prod4Slot3Promo1", "tlinputCh3Prod4Slot3Promo1ShareFrc", "tlinputCh3Prod4Slot3Promo1Weeks", "tlInputCh3R1Report1", "tlInputCh3R1Report2", "tlInputCh3R2Report3", "tlInputCh3R2Report4", "tlInputCh3R3Report5", "tlInputCh3R3Report6", "tlInputCh3VT", "tlInputCh4MarkPlan", "tlInputCh4Prod1Forecast", "tlInputCh4Prod2Forecast", "tlInputCh4Prod3Forecast", "tlInputCh4Prod4Forecast", "tlInputCh4ValDriv1", "tlInputCh4ValDriv2", "tlInputCh4ValDriv3", "tlInputCh4ValDriv4", "tlInputCh4ValDriv5", "tlInputCh4ValDrivCond","tlInputCh4Prod1Slot1Active", "tlinputCh4Prod1Slot1CustPrice", "tlinputCh4Prod1Slot1Forecast", "tlinputCh4Prod1Slot1Pack", "tlinputCh4Prod1Slot1Promo1", "tlinputCh4Prod1Slot1Promo1ShareFrc", "tlinputCh4Prod1Slot1Promo1Weeks", "tlinputCh4Prod1Slot1Promo2ShareFrc", "tlInputCh4Prod1Slot2Active", "tlinputCh4Prod1Slot2CustPrice", "tlinputCh4Prod1Slot2Forecast", "tlinputCh4Prod1Slot2Pack", "tlinputCh4Prod1Slot2Promo1", "tlinputCh4Prod1Slot2Promo1ShareFrc", "tlinputCh4Prod1Slot2Promo1Weeks", "tlinputCh4Prod1Slot2Promo2ShareFrc", "tlInputCh4Prod1Slot3Active", "tlinputCh4Prod1Slot3CustPrice", "tlinputCh4Prod1Slot3Forecast", "tlinputCh4Prod1Slot3Pack", "tlinputCh4Prod1Slot3Promo1", "tlinputCh4Prod1Slot3Promo1ShareFrc", "tlinputCh4Prod1Slot3Promo1Weeks", "tlinputCh4Prod1Slot3Promo2ShareFrc", "tlInputCh4Prod2Slot1Active", "tlinputCh4Prod2Slot1CustPrice", "tlinputCh4Prod2Slot1Forecast", "tlinputCh4Prod2Slot1Pack", "tlinputCh4Prod2Slot1Promo1", "tlinputCh4Prod2Slot1Promo1ShareFrc", "tlinputCh4Prod2Slot1Promo1Weeks", "tlinputCh4Prod2Slot1Promo2ShareFrc", "tlInputCh4Prod2Slot2Active", "tlinputCh4Prod2Slot2CustPrice", "tlinputCh4Prod2Slot2Forecast", "tlinputCh4Prod2Slot2Pack", "tlinputCh4Prod2Slot2Promo1", "tlinputCh4Prod2Slot2Promo1ShareFrc", "tlinputCh4Prod2Slot2Promo1Weeks", "tlinputCh4Prod2Slot2Promo2ShareFrc", "tlInputCh4Prod2Slot3Active", "tlinputCh4Prod2Slot3CustPrice", "tlinputCh4Prod2Slot3Forecast", "tlinputCh4Prod2Slot3Pack", "tlinputCh4Prod2Slot3Promo1", "tlinputCh4Prod2Slot3Promo1ShareFrc", "tlinputCh4Prod2Slot3Promo1Weeks", "tlinputCh4Prod2Slot3Promo2ShareFrc", "tlInputCh4Prod3Slot1Active", "tlinputCh4Prod3Slot1CustPrice", "tlinputCh4Prod3Slot1Forecast", "tlinputCh4Prod3Slot1Pack", "tlinputCh4Prod3Slot1Promo1", "tlinputCh4Prod3Slot1Promo1ShareFrc", "tlinputCh4Prod3Slot1Promo1Weeks", "tlinputCh4Prod3Slot1Promo2ShareFrc", "tlInputCh4Prod3Slot2Active", "tlinputCh4Prod3Slot2CustPrice", "tlinputCh4Prod3Slot2Forecast", "tlinputCh4Prod3Slot2Pack", "tlinputCh4Prod3Slot2Promo1", "tlinputCh4Prod3Slot2Promo1ShareFrc", "tlinputCh4Prod3Slot2Promo1Weeks", "tlinputCh4Prod3Slot2Promo2ShareFrc", "tlInputCh4Prod3Slot3Active", "tlinputCh4Prod3Slot3CustPrice", "tlinputCh4Prod3Slot3Forecast", "tlinputCh4Prod3Slot3Pack", "tlinputCh4Prod3Slot3Promo1", "tlinputCh4Prod3Slot3Promo1ShareFrc", "tlinputCh4Prod3Slot3Promo1Weeks", "tlinputCh4Prod3Slot3Promo2ShareFrc", "tlInputCh4Prod4Slot1Active", "tlinputCh4Prod4Slot1CustPrice", "tlinputCh4Prod4Slot1Forecast", "tlinputCh4Prod4Slot1Pack", "tlinputCh4Prod4Slot1Promo1", "tlinputCh4Prod4Slot1Promo1ShareFrc", "tlinputCh4Prod4Slot1Promo1Weeks", "tlinputCh4Prod4Slot1Promo2ShareFrc", "tlInputCh4Prod4Slot2Active", "tlinputCh4Prod4Slot2CustPrice", "tlinputCh4Prod4Slot2Forecast", "tlinputCh4Prod4Slot2Pack", "tlinputCh4Prod4Slot2Promo1", "tlinputCh4Prod4Slot2Promo1ShareFrc", "tlinputCh4Prod4Slot2Promo1Weeks", "tlinputCh4Prod4Slot2Promo2ShareFrc", "tlInputCh4Prod4Slot3Active", "tlinputCh4Prod4Slot3CustPrice", "tlinputCh4Prod4Slot3Forecast", "tlinputCh4Prod4Slot3Pack", "tlinputCh4Prod4Slot3Promo1", "tlinputCh4Prod4Slot3Promo1ShareFrc", "tlinputCh4Prod4Slot3Promo1Weeks", "tlinputCh4Prod4Slot3Promo2ShareFrc", "tlInputCh4R1Report1", "tlInputCh4R1Report2", "tlInputCh4R2Report3", "tlInputCh4R2Report4", "tlInputCh4R3Report5", "tlInputCh4R3Report6", "tlInputCh4VT"];


   // @HostListener("click", ['$event']) onOutsideClick(event: Event){
   //     if(this.arrowDown1.nativeElement != event.target && this.arrowDown2.nativeElement != event.target && this.arrowDownText1.el.nativeElement != event.target && this.arrowDownText2.el.nativeElement != event.target){
   //         this.showReports = false;
   //         this.showDecisions = false;
   //     }
   // }
   constructor(private dataStore: DataStore, private utils: Utils, private router: Router, private route: ActivatedRoute, private calcService: CalcService, private textEngineService: TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.resetPassword = this.textEngineService.getText("ResetPassword");

        this.changeChannelNumber();
        // this.routeObserver = this.router.events.subscribe((event) => {
        //     let tree: UrlTree = this.router.parseUrl(this.router.url),
        //         treeFragment = tree.fragment,
        //         newUrl = '/';
        //     if (event instanceof NavigationEnd) {
        //         // this.route.params.forEach(params => this.id = params['id']);
        //         let root = tree.root.children[PRIMARY_OUTLET],
        //             rootSegments = root.segments;

        //         rootSegments.forEach(segment => {
        //             if (segment.path === 'welcome') {
        //                 this.routeAnimation = "flipInY"
        //                 this.currentPage = segment.path;
        //                 this.setUpdatedText(this.currentPage);
        //             }
        //             // else if (segment.path === 'email') {
        //             //     this.routeAnimation = "flipInY"
        //             //     this.currentPage = segment.path;
        //             //     this.setUpdatedText(this.currentPage);
        //             // }
        //         });
        //         // this.setUpdatedText(this.currentPage);
        //     }
        // });
        this.routeObserver = this.router.events.subscribe((events) => {
            if(events instanceof NavigationEnd){
                self.changeChannelNumber();
                self.closeReportsDecsions();
            }
        });
        this.checkforBuyReports();
        this.modelChangeObserver = this.calcService.getObservable().subscribe(() => {
          this.checkforBuyReports();
        });

        this.outsideClickEventListener = this.dataStore.getObservableFor(EVENTS.OUTSIDE_CLICK).subscribe((event) => {
           // if(self.arrowDown1.nativeElement != event.target && self.arrowDown2.nativeElement != event.target && self.arrowDownText1.el.nativeElement != event.target && self.arrowDownText2.el.nativeElement != event.target && self.footerMenu.nativeElement != event.target){
           // if(self.arrowDown2.nativeElement != event.target && self.arrowDownText2.el.nativeElement != event.target && self.footerMenu.nativeElement != event.target){
           if(self.footerMenu.nativeElement != event.target && self.footerMenuText.el.nativeElement != event.target){
               self.showReports = false;
               self.showDecisions = false;
               self.showDropDown = false;
           }
        });
    }

  checkforBuyReports(){

        for(let i=0;i< 6 ;i++){
          let buyedReport = this.calcService.getValue("tlInputReport"+(i+1));
          if(buyedReport == "1"){
            this['buyedReport'+(i+1)]=true;
          }
        }

  }

    changeChannelNumber(){
        let channelName = this.router.url.indexOf("Hypermarket") > 0 ? "Hypermarket" : this.router.url.indexOf("Discounters") > 0 ? "Discounters" : this.router.url.indexOf("Convenience") > 0 ? "Convenience" : this.router.url.indexOf("OnTrade") > 0 ? "OnTrade" : this.router.url.indexOf("dashboard") > 0 ? "Company" : this.router.url.indexOf("customer-report") > 0 ? "CustReport" : this.router.url.indexOf("income-statement") > 0 ? "income-statement": this.router.url.indexOf("decision-summary") > 0 ? "decision-summary": null;
        let category = this.router.url.indexOf("SKUs") > 0 ? "SKUs" : this.router.url.indexOf("channel") > 0 ? "channel" : null;
        let z= 0;
        if(category == "SKUs"){
          this.showSKUSubtitle = true;
          this.showChannelSubtitle = false;
        }else if(category == "channel"){
          this.showSKUSubtitle = false;
          this.showChannelSubtitle = true;
        }
        if(channelName){
            switch (channelName) {
              case "Hypermarket":
                    this.currentChannel = 1;
                    z = 1;
                    break;
              case "Discounters":
                    this.currentChannel = 2;
                    z = 1;
                    break;
              case "Convenience":
                    this.currentChannel = 3;
                    z = 1;
                    break;
              case "OnTrade":
                    this.currentChannel = 4;
                    z = 1;
                    break;
              case "Company":
                    this.showChannelDashboard = false;
                    this.showChannelHeading = false;
                    this.showCompanyHeading = true;
                    this.showSKUSubtitle = false;
                    this.showChannelSubtitle = false;
                    this.showCustomerReportHeading = false;
                    this.showIncomeStatementHeading = false;
                    this.showDecisionSummaryHeading = false;
                    break;
              case "CustReport":
                    this.showChannelDashboard = false;
                    this.showChannelHeading = false;
                    this.showCompanyHeading = false;
                    this.showSKUSubtitle = false;
                    this.showChannelSubtitle = false;
                    this.showCustomerReportHeading = true;
                    this.showIncomeStatementHeading = false;
                    this.showDecisionSummaryHeading = false;
                    break;
              case "income-statement":
                    this.showChannelDashboard = false;
                    this.showChannelHeading = false;
                    this.showCompanyHeading = false;
                    this.showSKUSubtitle = false;
                    this.showChannelSubtitle = false;
                    this.showCustomerReportHeading = false;
                    this.showDecisionSummaryHeading = false;
                    this.showIncomeStatementHeading = true;
                    let paramValue =  this.router.url.indexOf("Brands") > 0 ? "Brands" : this.router.url.indexOf("Channels") > 0 ? "Channels":null;
                    if (paramValue == 'Brands') {
                      this.breadCrumbHeading = "IncomeStatementBrands";                       
                    } else if(paramValue == 'Channels'){
                      this.breadCrumbHeading = "IncomeStatementChannels";
                    }else{
                      this.breadCrumbHeading = "IncomeStatement";                      
                    }
                    break;
              case "decision-summary":
                    this.showChannelDashboard = false;
                    this.showChannelHeading = false;
                    this.showCompanyHeading = false;
                    this.showSKUSubtitle = false;
                    this.showChannelSubtitle = false;
                    this.showCustomerReportHeading = false;
                    this.showIncomeStatementHeading = false;
                    this.showDecisionSummaryHeading = true;
                    break;
            }
            if(z == 1){
              this.showChannelHeading = true;
              this.showCompanyHeading = false;
              this.showChannelDashboard = true;
              this.showCustomerReportHeading = false;
              this.showIncomeStatementHeading = false;
              this.showDecisionSummaryHeading = false;
            }
        }else{
            this.showChannelDashboard = false;
        }
    }

    toggleFooterMenu() {
        this.showDropDown = !this.showDropDown;
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
        this.outsideClickEventListener.unsubscribe();
        this.modelChangeObserver.unsubscribe();
    }

    onReportsClick(){
        this.showReports = !this.showReports;
        this.showDecisions = false;
    }

    onDecisionsClick(){
        this.showDecisions = !this.showDecisions; 
        this.showReports = false;       
    }

    closeReportsDecsions(){
        this.showDecisions = false;
        this.showReports = false;
    }

    exit() {
      if (typeof nw === "object") {
        var win = nw.Window.get();
        win.close();
      }
      this.hideExitAlert();
    }

    resetData() {
      this.dataAdaptor.clear(null, true);
      window.location.reload();
    }

    exportDecisions() {
      this.calcService.exportData(true, this.exportRangeNames);
    }

    importBalances() {
        this.importBalancesEl.showFileChooser();
    }

    onFileLoaded(jsonOb) {
      console.log("Loaded file", jsonOb);
      return new Promise((resolve, reject) => {
      try {
          this.calcService.appendDataToModel(jsonOb).then(() => {
            this.showAlert();
            resolve();
          }, reject);
      }
      catch(err) {
          reject(err);
        }
      });
    }

    openReportModal(){
      this.buyReportModalEl.show();
    }

    buyReport(activeIndex: number){
      if(!this['buyedReport'+activeIndex]){
        this['confirmToBuy'+activeIndex]= true;
      }
    }

    hideReportConfirmtion(){
      this.buyReportModalEl.hide();
    }

    confirmationBuyReport(activeIndex: number, buyReport?: boolean){
      if(buyReport){
        this.calcService.setValue("tlInputReport"+activeIndex, 1);
        this['buyedReport'+activeIndex]= true;
      }
      this['confirmToBuy'+activeIndex]= false;
    }

    onCheckBox(input: string){
      // this.showReportCOnfirmMsgEl.show();
      this.currentChackBoxClicked = input; 
    }

    confirmBuyReport(){
      this.currentChackBoxClicked.toggleValue();
      // this.showReportCOnfirmMsgEl.hide();
    }

    hideConfirmBuyReport(){
      // this.showReportCOnfirmMsgEl.hide();      
    }

    showExitAlert(){
        this.exitModalRef.show();
    }
    hideExitAlert(confirmed:boolean = false) {
        this.exitModalRef.hide();  
    }

    showResetAlert(){
        this.resetModalRef.show();
    }
    hideResetAlert() {
        this.resetModalRef.hide();  
        this.password = "";
    }

    showAlert() {
        this.importsuccessModalRef.show();
    }
    hideAlert() {
        this.importsuccessModalRef.hide();
        this.router.navigateByUrl(ROUTES.INTRO);
    }

    onPasswordSubmit(){       
        if(this.password == this.resetPassword){
            this.showPasswordErrorMessage = false;
            this.resetModalRef.hide();
            this.resetData();
        }else{
            this.showPasswordErrorMessage = true;
        }

        this.password = "";
    }
}
