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
    selector: 'corporate',
    templateUrl: './corporate.html',
    styleUrls: ['./corporate.css'],
    providers: [],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({transform: 'translateX(-100%)'})),
            transition('void => in', [
                animate(500, style({transform: 'translateX(0)'}))
            ]),
            transition('in => void', [
                animate (500, style({transform: 'translateX(-100%)'}))
            ])
        ])
      ]
})

export class Corporate implements OnInit, OnDestroy {
    @Input() general: any[];
    @Input() planningToolVisible = false;
    
    @Input() animState:states;

    private el: HTMLElement;
    private observer:any = null;
    private values = '';
    private changeDetectorRef: ChangeDetectorRef;
    private subscription: Subscription;
    private initiatives = {};
    private initiativesArray = [];
    private header = "";
    private description = "";
    private impact = "";
    private maxChecks = 0;
    private currentYear = 0;
    private totalChecked = 0;
    private tlInputBrand = 0;
    private currentlyHighlighted: any; 
    private activeIndex: number = 0;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef) {
        var self = this;
        this.changeDetectorRef = changeDetectorRef;
        this.animState = "out";

        this.subscription = activatedRoute.params.subscribe(
            (param: any) => this.animState = param['state']
        );
    }

    // clicked on "checkbox" to make/unmake initiative choice for the year
    // the .isChecked attribute contains the year in which the initiative was chosen (1, 2, ...)
    onCheck($event, index, ID) {
        $event.stopPropagation();

        // check/uncheck initiative
        if (this.initiativesArray[index].isEnabled) {
            this.initiativesArray[index].isChecked = (this.initiativesArray[index].isChecked > 0 ? 0 : this.currentYear);

            // reset initiative model ranges before setting new ones
            for (let i=1; i<=this.maxChecks; i++) {
                let currentInit = "tlInputSpecProg" + i + "_R" + this.currentYear;
                this.calcService.setValue (currentInit, 0);
            }

            this.totalChecked = 0;
            for (let i=0; i<this.initiativesArray.length; i++) {

                // if initiative was checked this year
                if(this.initiativesArray[i].isChecked == this.currentYear) {
                    this.totalChecked++;
                    // set it in the next slot in the model for this year
                    let currentInit = "tlInputSpecProg" + this.totalChecked + "_R" + this.currentYear;
                    this.calcService.setValue (currentInit, (i+1));
                }
            }

            for (let i=0; i<this.initiativesArray.length; i++) {
                this.initiativesArray[i].isEnabled = (
                    (this.initiativesArray[i].isChecked == this.currentYear) ||
                    ((this.initiativesArray[i].isChecked == 0) && (this.totalChecked < this.maxChecks)));
            }
        }
    }

    // clicked on initiative name to read description
    onSelect($event, index, ID) {
        $event.stopPropagation();
        this.removeCurrentlyHighlighted();
        this.currentlyHighlighted = this.initiativesArray[index];
        this.initiativesArray[index].isSelected = !this.initiativesArray[index].isSelected;
        this.header = this.initiativesArray[index].name;
        this.description = this.initiativesArray[index].narrative;
        this.impact = this.initiativesArray[index].impact;
    }

    removeCurrentlyHighlighted() {
        // if there is any element that is highlighted - remove its highlight
        if (this.currentlyHighlighted) {
            this.currentlyHighlighted.isSelected = false;
        }
    }

    ngOnInit() {
        
        this.el = this.elRef.nativeElement;

        this.description = this.textengineService.getText("InitiativesInstructions");
        this.impact = "";

        // Research & Development - Enterprise
        this.tlInputBrand = this.calcService.getValue("tlInputBrand");

        let infoWrapper = this.el.querySelector('[data-content-wrapper]');
        if (infoWrapper) {
            let classNames = infoWrapper.className;
            classNames = classNames.replace('slideOut', 'slideIn');
            infoWrapper.className = classNames;
        }

        this.initiatives = this.textengineService.getInitiatives();

        for (let key in this.initiatives) {
            let localScene = [];
            for (let property in this.initiatives[key]) {
                if (this.initiatives[key].hasOwnProperty(property)) {
                    localScene[property] = this.initiatives[key][property];
                }
            }
            localScene["decisionRange"]="tlInput"+localScene["ID"];
            localScene["roundRange"]="tlInputRound"+localScene["ID"];
            localScene["triggerRange"]="tlOutputTrigger"+localScene["ID"];
            localScene["readRange"]="tlInputRead"+localScene["ID"];
            localScene["index"] = localScene["ID"].substr(4);
            localScene["isChecked"] = 0;
            localScene["isSelected"] = 0;
            localScene["isEnabled"] = true;

            this.initiativesArray.push(localScene);
        }

        this.currentYear = this.calcService.getValue("tlInputTeamYear");
        let loopYear = 1;

        if ((this.currentYear >= 1) && (this.currentYear<100)) {
            // assigning all model data to local structures
            for (let y=1; y<=this.currentYear; y++) {
                this.maxChecks = 0;
                let currentInit = "tlInputSpecProg" + (this.maxChecks+1) + "_R" + y;
                let initiativesAvail = (this.calcService.getValue(currentInit) != undefined);
                while (initiativesAvail && (this.maxChecks < 10)) {
                    this.maxChecks++;
                    let currentIndex = this.calcService.getValue(currentInit)-1;
                    if (currentIndex >= 0) {
                        this.initiativesArray[currentIndex].isChecked = y;
                        if (y < this.currentYear) {
                            this.initiativesArray[currentIndex].isEnabled = false;
                        }
                    }
                    currentInit = "tlInputSpecProg" + (this.maxChecks+1) + "_R" + y;
                    initiativesAvail = (this.calcService.getValue(currentInit) != undefined);
                }
            }
        }
        
        for (let i = 0; i < this.initiativesArray.length; i++) {
            if (this.initiativesArray[i].isChecked == this.currentYear) {
                this.totalChecked++;
                this.initiativesArray[i].isEnabled = true;
            }
        }

        for (let i = 0; i < this.initiativesArray.length; i++) {
            if (this.initiativesArray[i].isChecked != this.currentYear) {
                if (this.totalChecked == this.maxChecks) {
                    this.initiativesArray[i].isEnabled = false;
                }
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onEnter($event, tlInputRange, boxValue) {
        $event.stopPropagation();

        let self:any = this;
        if (typeof boxValue == 'string') {
            boxValue = boxValue.replace(/\,/g,'');
        }
        self.calcService.setValue(tlInputRange, boxValue);
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
    }
}
