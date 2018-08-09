import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { ROUTES } from '../../utils';
import { CalcService } from '../../calcmodule';

@Component({
    selector: 'intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent {
    private hideNavigation: boolean = true;
    @ViewChild('logoutModal') public logoutModalRef: ModalDirective;
    constructor( private router: Router, private calcService: CalcService) { };

    ngOnInit() {
        let round = this.calcService.getValue("tlTeamRound");
        if(round == "3"){
            this.hideNavigation = false;
        }
    }

    takeToArea(){
    	this.router.navigateByUrl(ROUTES.DASHBOARD);
    }    

    showLogoutAlert(){
        this.logoutModalRef.show();
    }

    hideLogoutAlert(confirmed:boolean = false) {
        this.logoutModalRef.hide();  
    }
}
