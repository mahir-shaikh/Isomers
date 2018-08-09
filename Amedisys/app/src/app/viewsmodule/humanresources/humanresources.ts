import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { DASHBOARD_PATH, Dictionary } from '../../utils/utils';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import { TabsetComponent } from 'ng2-bootstrap';

type states = ( "out" | "in" | "none" );

@Component({
    selector: 'humanresources',
    templateUrl: './humanresources.html',
    styleUrls: ['./humanresources.css'],
    providers: [],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({transform: 'translateX(-100%)'})),
            transition('out => in', [
                animate(500, style({transform: 'translateX(0)'}))
            ]),
            transition('in => out', [
                animate (500, style({transform: 'translateX(-100%)'}))
            ])
        ])
      ]
})

export class HumanResources implements OnInit, OnDestroy {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    
    @Input() animState:states;

    private el: HTMLElement;
    private observer:any = null;
    private values = '';
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    private activeIndex: number = 0;

    // Human Resources
    // private tlInputSolutionArchitect=0;
    // private tlInputProcess=0;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => this.animState = param['state']
        );
    }

    onClick($event){
        $event.stopPropagation();
        this.animState = "in";
        this.changeDetectorRef.detectChanges();
    }

    ngOnInit() {
        
        this.el = this.elRef.nativeElement;

        let infoWrapper = this.el.querySelector('[data-content-wrapper]');
        if (infoWrapper) {
            let classNames = infoWrapper.className;
            classNames = classNames.replace('slideOut', 'slideIn');
            infoWrapper.className = classNames;
        }

        // get data from model to initialize local variables

        // Human Resources
        // this.tlInputSolutionArchitect = this.calcService.getValue("tlInputSolutionArchitect");
        // this.tlInputProcess = this.calcService.getValue("tlInputProcess");
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // onEnter($event, tlInputRange, boxValue) {
    //     $event.stopPropagation();

    //     let self:any = this;
    //     if (typeof boxValue == 'string') {
    //         boxValue = boxValue.replace(/\,/g,'');
    //     }
    //     self.calcService.setValue(tlInputRange, boxValue);
    // }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
    }
}
