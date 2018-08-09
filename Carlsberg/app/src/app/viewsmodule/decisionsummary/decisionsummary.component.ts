import { Component, ElementRef, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { ROUTES, DataStore } from '../../utils';

@Component({
    selector: 'decision-summary',
    templateUrl: './decisionsummary.component.html',
    styleUrls: ['./decisionsummary.component.styl'],
})

export class DecisionSummaryComponent {
    private activeIndex: number = 1;
    private prodNo: number;
    private prod1:string;
    private prod2:string;
    private prod3:string;
    private prod4:string;
    private doAnimation : boolean = false;
    private firstTime:boolean = true;
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private dataStore : DataStore, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef){};

    ngOnInit() {
        this.prod1 = this.textengineService.getText("Prod1");
        this.prod2 = this.textengineService.getText("Prod2");
        this.prod3 = this.textengineService.getText("Prod3");
        this.prod4 = this.textengineService.getText("Prod4");
    }

    ngOnDestroy(){
    } 

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {
            case 0:
                this.prodNo = 1;
                break;            
            case 1:
                this.prodNo = 2;
                break;
            case 2:
                this.prodNo = 3;
                break;
            case 2:
                this.prodNo = 4;
                break;
            default:
                this.prodNo = 1;
                break;
        }
        if(!this.firstTime){
            this.doAnimation = true;
        }else{
            this.firstTime = false;
        }
    }
}