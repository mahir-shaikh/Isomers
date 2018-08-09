import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'categories',
    templateUrl: './categories.html',
    styleUrls: ['./categories.css'],
    providers: []
})

export class Categories implements OnInit {
    // @ViewChild("categoryPasswordModal") categoryPasswordModalRef : ModalDirective;

    constructor(private calcService: CalcService, private router: Router, private elRef: ElementRef) { };

    ngOnInit() {
    }

    onSelect() {
        // [routerLink]="['/dashboard', 'messages', 'R1S1']"
        // this.router.navigate(['/dashboard', {outlets: { 'messages': 'messages/' + this.message.ID}}]);
    }

    // hideAlert(confirm?:boolean){
    //     if(confirm){
    //     }
    //     this.categoryPasswordModalRef.hide();
    // }
}
