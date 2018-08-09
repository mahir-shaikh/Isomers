import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { ModalDirective } from 'ng2-bootstrap';
import { SyncService } from '../../connect/sync.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { DataStore, Utils, CURRENT_YEAR, PASSWORD_VISIBLE_AFTERINTRO, PASSWORD_VISIBLE_AFTERSUBMIT_R1, DISABLE_DASH } from '../../utils/utils';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service';

const KEY_NUM_0 = 48; // used to reset sim


@Component({
    selector: 'my-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    private currentYear: number;
    private subscription: any;
    private simComplete: any;
    private passwordToSubmit_AfterIntro = "grainger1"
    private passwordToSubmit_AfterSubmit_R1 = "grainger2"
    private submitPassword = "";
    private passwordVisible = 0;
    private showPasswordError = false;
    private showActions:boolean = true;
    private updatedActions:boolean = false;

    @ViewChild('childModal') public childModal: ModalDirective;

    @HostListener('document:keyup', ['$event'])
    onKeypress($event) {
        // console.log("Key pressed :: " + $event.keyCode, $event.shiftKey, $event.ctrlKey);
        if ($event.keyCode === KEY_NUM_0 && $event.shiftKey && $event.ctrlKey) {
            this.resetSim();
        }
    }

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private textengineservice:TextEngineService, private calcService: CalcService, private dataAdaptor: DataAdaptorService) {}

    ngOnInit() {
        this.getCurrentYear();
        // this.checkSimComplete();
        // this.showActions = (this.calcService.getValue("tlInputReadR"+this.currentYear+"Message1") == 0);
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.getCurrentYear();
            this.updateActionStatus();
            // this.checkSimComplete();
        });
        // this.calcService.getApi();
        this.passwordVisible = this.calcService.getValue(PASSWORD_VISIBLE_AFTERINTRO);

    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(){
        this.updateActionStatus();
    }

    updateActionStatus(){
        this.showActions = (this.calcService.getValue("tlInputReadR"+this.currentYear+"Message1") == 0);
        if(this.showActions){
            this.updatedActions = true;
            this.dataStore.setData(DISABLE_DASH, true);
        }

        if(this.updatedActions && !this.showActions){
            this.dataStore.setData(DISABLE_DASH, false);
        }
    }

    getCurrentYear() {
        this.currentYear = Number(this.calcService.getValue('xxRound'));
        this.dataStore.setData(CURRENT_YEAR, this.currentYear);
    }

    checkSimComplete() {
        this.simComplete = Number(this.calcService.getValue('tlInputSimComplete'));
    }

    resetSim() {
        // localStorage.clear();
        let confirmResponse = confirm("Do you wish to reset sim progress? You cannot undo this.")
        if (confirmResponse) {
            this.dataAdaptor.clear(null, true)
            window.location.reload();            
        }
    }

    showAlert() {
        this.childModal.show();
    }

    hideAlert(confirmed:boolean = false) {
        this.childModal.hide();
  
    }
}
