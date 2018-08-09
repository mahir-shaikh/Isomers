import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'topnavbar',
    templateUrl: './topnavbar.component.html',
    styleUrls: ['./topnavbar.component.styl']
})

export class TopNavbarComponent {
    private currentDecision: string = "";
    private routeObserver: any;
    private modelChangeListner: Subscription;
    // private commonChartOption: string = '{"chart":{"backgroundColor" : "#f4f5f6"},"xAxis":{"tickWidth":0,"lineWidth":0,"labels":{"enabled":false}},"yAxis":{"tickWidth":0,"lineWidth":0,"labels":{"enabled":false}},"legend":{"enabled" : false}, "tooltip" : {"style" : {"width" : "120px"}},"plotOptions":{ "series" : {"dataLabels" : { "enabled" : true }} }}';
    private commonChartOption: string = '{"chart":{"backgroundColor" : "#f4f5f6"},"xAxis":{"visible":false},"yAxis":{"visible":false},"legend":{"enabled" : false}, "tooltip" : {"style" : {"width" : "120px"}},"plotOptions":{ "series" : {"dataLabels" : { "enabled" : true }} }}';
    private isColorOneActive: boolean = true;
    private isColorTwoActive: boolean = false;
    private isColorThreeActive: boolean = false;
    private isColorFourActive: boolean = false;
    private isERActive : boolean = false;
    private routeName: string = "EG";
    private hideDashboardData: boolean = false;
    private etusRemaining: number;
    @ViewChild('commitModal') public commitModalRef: ModalDirective;

    constructor(private dataStore: DataStore, private utils: Utils, private route: ActivatedRoute, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.onRouteChange();
        this.routeObserver = this.router.events.subscribe((val) => {
            if(val instanceof NavigationEnd){
                self.onRouteChange();
            }            
        });
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
    }

    onRouteChange(){
        this.isERActive = (this.router.url.indexOf("erPlatform") > 0) || (this.router.url.indexOf("erProduct") > 0) ? true : false;
        this.hideDashboardData = false;
        if(this.isERActive){
            this.routeName = "EG";
            this.isColorOneActive = this.router.url.indexOf("erPlatform") > 0 ? true : false;
            this.isColorTwoActive = (this.router.url.indexOf("erProduct") > 0) && (this.router.url.indexOf("1") > 0) ? true : false;
            this.isColorThreeActive = (this.router.url.indexOf("erProduct") > 0) && (this.router.url.indexOf("2") > 0) ? true : false;
            this.isColorFourActive = (this.router.url.indexOf("erProduct") > 0) && (this.router.url.indexOf("3") > 0) ? true : false;
        }else{
            this.isColorOneActive = (this.router.url.indexOf("opsOperation") > 0) || (this.router.url.indexOf("opsInfrastructure") > 0) || (this.router.url.indexOf("talentdevelopment") > 0) || (this.router.url.indexOf("opsMarketing") > 0) ? true : false;
            this.isColorTwoActive = ((this.router.url.indexOf("pricingForecasting") > 0) || (this.router.url.indexOf("salesService") > 0) || (this.router.url.indexOf("partner") > 0)) && (this.router.url.indexOf("1") > 0) ? true : false;
            this.isColorThreeActive = ((this.router.url.indexOf("pricingForecasting") > 0) || (this.router.url.indexOf("salesService") > 0) || (this.router.url.indexOf("partner") > 0)) && (this.router.url.indexOf("0") > 0) ? true : false;
            this.isColorFourActive = this.router.url.indexOf("pnl") > 0 ? true : false;

            if(this.isColorOneActive){
                this.routeName = "Ops";
            }else if(this.isColorTwoActive){
                this.routeName = "Commercial";
            }else if(this.isColorThreeActive){
                this.routeName = "Consumer";
            }else if(this.isColorFourActive){
                this.hideDashboardData = true;
            }
        }

        //Chart Reflow Issue
        if(typeof(Event) === 'function') {
          // modern browsers
          setTimeout(()=>{
              window.dispatchEvent(new Event('resize'));
            },1000);
        }else{
          // for IE and other old browsers
          // causes deprecation warning on modern browsers
          setTimeout(()=>{
              var evt = window.document.createEvent('UIEvents'); 
              evt.initUIEvent('resize', true, false, window, 0); 
              window.dispatchEvent(evt);
            },1000);
        }
    }

    showCommitModal(){
        this.etusRemaining = this.calcService.getValue("tlOutputEGDashboardETUs");
        this.commitModalRef.show();
    }

    commitER(){
        //Set Commit Boolean to true
        // this.calcService.setValue("",true);
        this.dataStore.setData(EVENTS.ER_COMPLETE,true,true);
        //Navigate
        this.hideCommitAlert();
        this.router.navigate(["/opsOperation"]);
    }

    hideCommitAlert(){
        this.commitModalRef.hide();
    }
}
