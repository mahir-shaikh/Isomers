import { Component, Input, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';
import { TextEngineService } from '../../textengine/textengine.service';
import { MEETINGS_OUTLET, Utils, Dictionary, DataStore, DISABLE_DASH } from '../../utils/utils';


@Component({
    selector: 'my-accordion',
    templateUrl: './accordion.html',
    styleUrls: ['./accordion.css'],
    providers: [],
    encapsulation: ViewEncapsulation.None
})

export class MyAccordionComponent implements OnInit {
    @Input() closeOthers: boolean = false;
    @Input() narrative: string = '';
    @Input() id: string;
    private choices = [];
    // @Input() index;
    


    constructor(private textengineService: TextEngineService, private calcService: CalcService, private elRef: ElementRef, private router: Router, private utils: Utils) { };

    ngOnInit() {
       var accordionChoice = [];

       accordionChoice=this.textengineService.getSingleSelectChoices(this.id);

       this.choices = accordionChoice;
        
    }

    onSelect() {
       
    }
}