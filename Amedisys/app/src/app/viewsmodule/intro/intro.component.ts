import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { ModalDirective } from 'ng2-bootstrap';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart } from '@angular/router';
import { MESSAGES_OUTLET, Utils, Dictionary } from '../../utils/utils';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
// import { SyncService } from '../connect/sync.service';

@Component({
    selector: 'intro-component',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit, OnDestroy {

    private routeAnimation: string;
    @ViewChild('childModal') public childModal: ModalDirective;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private route: ActivatedRoute, private router: Router, private utils: Utils) { };

    ngOnInit() {
        
    }

    onClose() {
        // this.router.navigateByUrl(DASHBOARD_PATH);
    }

    ngOnDestroy() {
        
    }

    showAlert() {
        this.childModal.show();
    }
    
    hideAlert(confirmed:boolean = false) {
        this.childModal.hide();
  
    }
}
