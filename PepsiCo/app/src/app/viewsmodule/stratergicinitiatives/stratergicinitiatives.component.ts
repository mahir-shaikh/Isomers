import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '@btsdigital/ngx-isomer-core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'isma-stratergicinitiatives',
    templateUrl: './stratergicinitiatives.component.html',
    styleUrls: ['./stratergicinitiatives.component.styl']
})
export class StratergicinitiativesComponent implements OnInit {

    @Input() investmentTitle = 'Initiatives';
    @Input() localChoices;
    @Input() content;
    @Input() investmentsArray = [];
    @Input() initiativeType: string; // 0 = partner actions / 1 = initiatives

    private isChecked = 0;
    private investmentsChosen = [];
    description = '';
    header = '';
    impact = '';
    investment = '';
    mtus = '';
    maxChecks = 5;
    totalChecked = 0;
    private currentYear = 0;
    private activeIndex = 0;
    private currentlyHighlighted: any = '';
    private currentSelectedIvestments: Array<any>;
    private defaultDescription: string;
    private routeAnimation: string;
    private initiativesVisible: number;
    private minMarginLeft: number;
    private selectionRemainingRef: string;
    scrollLeftDisabled: Boolean = false;
    scrollRightDisabled: Boolean = false;
    filters: Array<string> = [];
    hasCategories: Boolean = true;
    categories: Array<string> = [
        'Branding (BR)',
        'Innovation (IN)',
        'Go To Market (GT)',
        'Productivity (PR)'
    ];
    isFiltered: Boolean = false;
    el: HTMLElement;
    arrPrevValueRefs = [[], [
        'tlOutput_toolPrograms_I48', 'tlOutput_toolPrograms_I49', 'tlOutput_toolPrograms_I50', 'tlOutput_toolPrograms_I51', 'tlOutput_toolPrograms_I52'],
    ['tlOutput_toolPrograms_I48', 'tlOutput_toolPrograms_I49', 'tlOutput_toolPrograms_I50', 'tlOutput_toolPrograms_I51', 'tlOutput_toolPrograms_I52','tlOutput_toolPrograms_I58', 'tlOutput_toolPrograms_I59', 'tlOutput_toolPrograms_I60', 'tlOutput_toolPrograms_I61','tlOutput_toolPrograms_I62']];


    constructor(private textengineService: TextEngineService, public calcservice: CalcService, private elRef: ElementRef) { }

    ngOnInit() {
        this.initializeContent();
        this.updateCheckedInititiatives();
        this.updateInitiativesState();
        this.currentYear = parseInt(this.calcservice.getValue('tlInputTeamYear'));
        this.updateLockedInitiatives();
        this.currentlyHighlighted = this.investmentsArray[0];
        this.investmentsArray[0].isSelected = !this.investmentsArray[0].isSelected;
        this.header = this.investmentsArray[0].name;
        this.description = this.investmentsArray[0].narrative;
        this.impact = this.investmentsArray[0].impact;
        this.investment = this.investmentsArray[0].investment;
        this.mtus = this.investmentsArray[0].mtuRequired;
        this.currentSelectedIvestments = [];
        this.el = this.elRef.nativeElement;
        this.updateElemCount();
        this.maxChecks = 5;
    }

    updateElemCount() {
        // -1068px
        const nodes: NodeListOf<Element> = this.el.getElementsByClassName('initiative'),
            elems: Array<HTMLElement> = Array.prototype.slice.call(nodes);
        this.initiativesVisible = 0;
        elems.forEach((elem, elemIndex) => {
            if (!!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)) {
                // this.investmentsArray[0][elemIndex].isSelected = true;
                this.initiativesVisible++;
            }
        });

        // 16 is the offset by which the last initiative is cutoff
        this.minMarginLeft = (((this.initiativesVisible - 7) * 130)) * -1 - 16;
        if (this.el.getElementsByClassName('content-col initiatives').length > 0) {
            const containerSize: number = this.el.getElementsByClassName('content-col initiatives')[0]['offsetWidth'];
            const sizeOfSingleElem: number = elems[0].offsetWidth;
            const visibleCount: number = Math.floor(containerSize / sizeOfSingleElem);
            const offsetValue: number = containerSize - (sizeOfSingleElem * visibleCount);
            this.minMarginLeft = (((this.initiativesVisible - visibleCount) * sizeOfSingleElem) - offsetValue) * -1;
        }
    }

    toggleFilter(ci: string) {
        const filterIndex = this.filters.indexOf(ci);
        if (filterIndex === -1) {
            this.filters.push(ci);
        } else {
            this.filters.splice(filterIndex, 1);
            // when removing a filter
            this.updateSelection();
        }
        // if selecting the first filter
        if (filterIndex === -1 && this.filters.length === 1) {
            this.updateSelection();
        }
        this.isFiltered = (this.filters.length !== 0) ? true : false;

        // update elem count after a cd cycle
        setTimeout(() => {
            this.updateElemCount();
        }, 100);
    }

    updateSelection() {
        // added timeout to let angular run one cd check and update dom and hide unwanted elems from the filter and then update selection in cycle.
        setTimeout(() => {
            const nodes: NodeListOf<Element> = this.el.getElementsByClassName('initiative');
            const elems: Array<HTMLElement> = Array.prototype.slice.call(nodes);
            let elemFound: Boolean = false;
            const initiativesEl: any = this.el.getElementsByClassName('screen')[0];
            initiativesEl.style.marginLeft = '0px';

            elems.forEach((elem, elemIndex) => {
                if (!!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length) && !elemFound) {
                    // this.investmentsArray[0][elemIndex].isSelected = true;
                    elemFound = true;
                    this.onSelect(null, elemIndex, null);
                }
            });
        }, 100);
    }

    getFilters() {
        return this.filters.map(i => 'cat-' + i).join(' ');
    }

    scroll(direction) {
        this.updateElemCount();
        const initiativesEl: any = this.el.getElementsByClassName('screen')[0],
            initiativesLength: number = initiativesEl.querySelectorAll('.initiative').length,
            INITIATIVE_WIDTH = 130;

        let marginLeft = parseInt(window.getComputedStyle(initiativesEl)['margin-left']);
        // scroll by 3 elements with
        if (direction !== 0) {
            // scroll right
            let scrollByElems = 0;
            const nextScroll = initiativesLength - (parseInt((-marginLeft / INITIATIVE_WIDTH) + '') + 10);

            scrollByElems = (nextScroll >= 0) ? 3 : (3 + nextScroll);
            marginLeft = marginLeft - (scrollByElems * INITIATIVE_WIDTH);
            if (scrollByElems === 0) {
                marginLeft = this.minMarginLeft;
            } else if (scrollByElems < 3) {
                marginLeft -= 12;
            }
            marginLeft = (marginLeft <= this.minMarginLeft) ? this.minMarginLeft : marginLeft;
        } else {// scroll left
            marginLeft = marginLeft + (3 * INITIATIVE_WIDTH);
            marginLeft = (marginLeft >= 0) ? 0 : marginLeft;
        }

        this.scrollLeftDisabled = (marginLeft === 0) ? true : false;
        this.scrollRightDisabled = (marginLeft == this.minMarginLeft) ? true : false;

        initiativesEl.style.marginLeft = marginLeft + 'px';
    }

    submitValues() {
        this.setNullValues();
        for (let i = 0; i < this.currentSelectedIvestments.length; i++) {
            const selectedInit = this.currentSelectedIvestments[i];
            const selected = selectedInit.initiativeCode;
            const rangeName = 'tlInputSpecProg' + (i + 1) + '';
            this.calcservice.setValue(rangeName, selected);
        }
    }

    // clicked on "checkbox" to make/unmake initiative choice for the year
    // the .isChecked attribute contains the year in which the initiative was chosen (1, 2, ...)
    onCheck($event, index, ID) {
        if ($event) {
            $event.stopPropagation();
        }
        this.onSelect($event, index, ID);

        // check/uncheck initiative
        if (this.investmentsArray[index].isEnabled) {
            this.investmentsArray[index].isChecked = (this.investmentsArray[index].isChecked > 0 ? 0 : 1);

            this.totalChecked = 0;
            this.currentSelectedIvestments.length = 0;
            for (let i = 0; i < this.investmentsArray.length; i++) {
                // if initiative was checked this year
                if (this.investmentsArray[i].isChecked == 1 && this.investmentsArray[i].isEnabled) {
                    this.totalChecked++;
                    this.currentSelectedIvestments.push(this.investmentsArray[i]);
                }
            }

            for (let i = 0; i < this.investmentsArray.length; i++) {
                this.investmentsArray[i].isEnabled = (
                    (!this.investmentsArray[i].isLocked) &&
                    ((this.investmentsArray[i].isChecked == 1) ||
                        ((this.investmentsArray[i].isChecked == 0) && (this.totalChecked < this.maxChecks))));
            }
        }

        this.submitValues();
    }

    // clicked on initiative name to read description
    onSelect($event, index, ID) {
        if ($event) {
            $event.stopPropagation();
        }
        this.removeCurrentlyHighlighted();
        this.currentlyHighlighted = this.investmentsArray[index];
        this.investmentsArray[index].isSelected = !this.investmentsArray[index].isSelected;
        this.header = this.investmentsArray[index].name;
        this.description = this.investmentsArray[index].narrative;
        this.impact = this.investmentsArray[index].impact;
        this.investment = this.investmentsArray[index].investment;
        this.mtus = this.investmentsArray[index].mtuRequired;
    }


    removeCurrentlyHighlighted() {
        // if there is any element that is highlighted - remove its highlight
        if (this.currentlyHighlighted) {
            this.currentlyHighlighted.isSelected = false;
        }
    }

    initializeContent() {
        this.content = [];
        this.content = this.textengineService.getInitiatives();

        // var parsed = JSON.parse(this.content);
        const arr = [];
        for (const index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                // arr.push(this.content[x]);
                this.content[index].isSelected = 0;
                this.content[index].isChecked = 0;
                this.content[index].isEnabled = 1;

                // break apart .ID for true ID (eg - Initiative1 = 1) 
                this.content[index].initiativeID = this.content[index].ID.slice(10);
                this.investmentsArray.push(this.content[index]);
            }
        }

        for (let i = 0; i < this.investmentsArray.length; i++) {
            this.investmentsArray[i].isEnabled = (
                (!this.investmentsArray[i].isLocked) &&
                ((this.investmentsArray[i].isChecked == 1) ||
                    ((this.investmentsArray[i].isChecked == 0) && (this.totalChecked < this.maxChecks))));
        }
    }

    updateCheckedInititiatives() {
        this.totalChecked = 0;
        let currentYear = this.calcservice.getValue("tlInputTeamYear");
        for (let i = 1; i <= this.maxChecks; i++) {
            // if initiative was checked this year
            let status:any = 0;
            try{
                status = this.calcservice.getValue('tlInputSpecProg' + i);
            }catch(e){}
            if (status && status != 'N/A' && status !="0") {
                this.totalChecked++;
                for(var index in this.investmentsArray){
                    if(this.investmentsArray[index].initiativeCode == status){
                        this.investmentsArray[index].isChecked = 1;
                        break;
                    }
                }
            }
        }
    }

    setNullValues() {
        for (let i = 1; i <= this.maxChecks; i++) {
            // if initiative was checked this year
            this.calcservice.setValue('tlInputSpecProg' + i + '', '0');
        }
    }

    updateLockedInitiatives() {
        const maxLocked = this.arrPrevValueRefs[this.currentYear - 1].length;
        for (let i = 0; i < maxLocked; i++) {
            // if initiative was locked last year
            const status = this.calcservice.getValue(this.arrPrevValueRefs[this.currentYear - 1][i]);
            if (status) {
                for(var index in this.investmentsArray){
                    if(this.investmentsArray[index].initiativeCode == status){
                        this.investmentsArray[index].isLocked = 1;
                        this.investmentsArray[index].isChecked = 1;
                        this.investmentsArray[index].isEnabled = false;
                        break;
                    }
                }
            }
        }

    }

   updateInitiativesState(){
        for (let i = 0; i < this.investmentsArray.length; i++) {
            this.investmentsArray[i].isEnabled = (
                (!this.investmentsArray[i].isLocked) &&
                ((this.investmentsArray[i].isChecked == 1) ||
                    ((this.investmentsArray[i].isChecked == 0) && (this.totalChecked < this.maxChecks))));
        }
    }
}