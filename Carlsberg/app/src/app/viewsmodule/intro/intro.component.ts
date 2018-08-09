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
    @ViewChild('logoutModal') public logoutModal: ModalDirective;
    private currentYear: number;
    
    constructor( private router: Router, private calcService: CalcService) { };

    ngOnInit() {
       this.currentYear = this.calcService.getValue("xxRound");
    }

    navigateToCompanyPage(){
        this.router.navigateByUrl(ROUTES.DASHBOARD);
    }

    showAlert(){
    	this.logoutModal.show();
    }

    hideAlert(confirmed:boolean = false) {
        this.logoutModal.hide(); 
    }
}
