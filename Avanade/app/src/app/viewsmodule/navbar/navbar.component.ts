import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, Output, OnChanges } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.styl']
})

export class NavbarComponent implements OnInit, OnDestroy, OnChanges {
    private routeObserver: any;
    private modelChangeListner: Subscription;
    @Input() eventList:any = [];
    @Output() onDisplayWobbler: EventEmitter<any> = new EventEmitter<any>();
    private isLink1Open: boolean = false;
    private isLink2Open: boolean = false;
    private isLink3Open: boolean = false;
    private isLink4Open: boolean = false;
    private isSomeMenuOpen: boolean = false;
    private isEventListEmpty: boolean = false;

    constructor(private dataStore: DataStore, private utils: Utils, private route: ActivatedRoute, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService, private dataAdaptor: DataAdaptorService) { };

    ngOnInit() {
        let self = this;
        this.onRouteChange();
        this.routeObserver = this.router.events.subscribe((val) => {
            if(val instanceof NavigationEnd){
                self.onRouteChange();
            }            
        });
        this.checkIfEventListEmpty();
    }

    ngOnDestroy() {
        this.routeObserver.unsubscribe();
    }

    ngOnChanges(){
        this.checkIfEventListEmpty();
    }

    onRouteChange(){
        this.closeAllMenu();
    }

    closeAllMenu(){
        setTimeout(()=>{
            this.isLink1Open = false;
            this.isLink2Open = false;
            this.isLink3Open = false;
            this.isLink4Open = false;
            this.isSomeMenuOpen = false;
        }, 250);
    }

    openMenu(menuNumber, $event : MouseEvent){
        // if($event.currentTarget == $event.target)
        {
            switch (menuNumber) {
                case 0:
                    this.isLink1Open = this.isLink1Open ? false : true;
                    // this.isLink1Open = false;
                    this.isLink2Open = false;
                    this.isLink3Open = false;
                    this.isLink4Open = false;
                    break;
                case 1:
                    this.isLink2Open = this.isLink2Open ? false : true;
                    this.isLink1Open = false;
                    // this.isLink2Open = false;
                    this.isLink3Open = false;
                    this.isLink4Open = false;

                    break;
                case 2:
                    this.isLink3Open = this.isLink3Open ? false : true;
                    this.isLink1Open = false;
                    this.isLink2Open = false;
                    // this.isLink3Open = false;
                    this.isLink4Open = false;
                    break;
                case 3:
                    this.isLink4Open = this.isLink4Open ? false : true;
                    this.isLink1Open = false;
                    this.isLink2Open = false;
                    this.isLink3Open = false;
                    // this.isLink4Open = false;
                    break;
            }

            if(this.isLink1Open || this.isLink2Open || this.isLink3Open || this.isLink4Open){
                this.isSomeMenuOpen = true;
            }
        }
        $event.preventDefault();
        $event.stopPropagation();
    }

    closeMenu(menuNumber){
        if (this.isSomeMenuOpen) {
            switch (menuNumber) {
                case 0:
                    this.isLink1Open = false;
                    break;
                case 1:
                    this.isLink2Open = false;
                    break;
                case 2:
                    this.isLink3Open = false;
                    break;
                case 3:
                    this.isLink4Open = false;
                    break;
            }
        }
    }

    displayWobbler(override){
        this.onDisplayWobbler.emit(override)
    }

    checkIfEventListEmpty(){
        this.isEventListEmpty = this.eventList.length === 0 ? true : false;
    }
}
