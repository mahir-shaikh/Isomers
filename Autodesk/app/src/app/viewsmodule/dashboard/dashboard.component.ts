import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'im-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent {
    @ViewChild('dashboardDataModal') public dashboardModalRef: ModalDirective;
    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    @ViewChild('resetModal') public resetModalRef: ModalDirective;
    @ViewChild('videoModal') public videoModalRef: ModalDirective;
    @ViewChild('videoRef') public videoRef;
    private routeObserver: any;
    private showDashboardIcon:boolean = true;
    // private showResetIcon:boolean = true;
    private showPrintIcon:boolean = true;
    private videoEventListener : any;
    private dashboardTitle:string = "";
    private tutorialTitle:string = "";
    private resetTitle:string = "";
    private printTitle:string = "";
    private logoutTitle:string = "";

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.updateDashboardIcons();
        this.initializeTitleText();
        this.routeObserver = this.router.events.subscribe((events) => {
            if(events instanceof NavigationEnd){
                self.updateDashboardIcons();
                self.initializeTitleText();
            }
        });

        this.videoEventListener = this.dataStore.getObservableFor(EVENTS.START_VIDEO).subscribe(() => {
            this.showTutorial();
        });
    }

    initializeTitleText(){
        this.dashboardTitle = this.calcService.getValue("nmDashboardData");
        this.tutorialTitle = this.calcService.getValue("nmTutorial");
        this.resetTitle = this.calcService.getValue("nmResetAll");
        // this.printTitle = this.calcService.getValue("Print");
        this.logoutTitle = this.calcService.getValue("nmLogout");
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
        this.videoEventListener.unsubscribe();
    }

    updateDashboardIcons(){
        this.showDashboardIcon = this.router.url.indexOf("dashboard") > 0 ? false : true;
        this.showPrintIcon = this.router.url.indexOf("reports") > 0 ? true : false;
    }

    resetModel(){
        this.dataAdaptor.clear(null, true)
            .then(() => { window.location.href = window.location.origin; });
        
    }

    printPage() {
        this.dataStore.triggerChange(EVENTS.PRINT_PAGE);
    }

    showDashboardData(){
        this.dashboardModalRef.show();
    }
    hideDashboardData(){
        this.dashboardModalRef.hide();
    }

    showTutorial(){
        this.videoModalRef.show();

        //Start Video
        let video : HTMLVideoElement = this.videoRef.nativeElement;
        video.play();
    }
    hideTutorial(){
        //pause video
        let video : HTMLVideoElement = this.videoRef.nativeElement;
        video.pause();
        video.currentTime = 0;

        this.videoModalRef.hide();
    }

    showLogoutAlert(){
        this.logoutModalRef.show();
    }
    hideLogoutAlert(confirmed:boolean = false) {
        this.logoutModalRef.hide();  
    }

    showResetAlert(){
        this.resetModalRef.show();
    }
    hideResetAlert() {
        this.resetModalRef.hide();  
    }
}
