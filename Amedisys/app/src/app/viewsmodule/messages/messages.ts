import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';

@Component({
    selector: 'messages',
    templateUrl: './messages.html',
    styleUrls: ['./messages.css'],
    providers: []
})

export class Messages implements OnInit {
    @Input() message;
    @Input() index;

    private isHidden = true;
    private isViewed = false;
    private el;


    constructor(private calcService: CalcService, private router: Router, private elRef: ElementRef) { };

    ngOnInit() {
        this.el = this.elRef.nativeElement;
        this.isHidden = (this.calcService.getValue(this.message.triggerRange) != 1);
        this.isViewed = (this.calcService.getValue("tlInput"+this.message.ID) != 0);
        this.message["icon"] = "assets/images/" + this.message["icon"];
        this.message["image"] = "assets/images/" + this.message["image"];
    }

    onSelect() {
        // [routerLink]="['/dashboard', 'messages', 'R1S1']"
        this.router.navigate(['/dashboard', {outlets: { 'messages': 'messages/' + this.message.ID}}]);
    }
}
