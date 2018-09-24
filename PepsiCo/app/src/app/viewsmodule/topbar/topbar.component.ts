import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '@btsdigital/ngx-isomer-core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'isma-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.styl']
})

export class TopbarComponent {
    private routeObserver: any;
    private modelChangeListner: Subscription;

    constructor(private dataStore: DataStore, private utils: Utils, private route: ActivatedRoute, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

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
        
    }
}
