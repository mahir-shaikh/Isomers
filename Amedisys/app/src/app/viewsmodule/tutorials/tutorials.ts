import { Component, OnInit, trigger, state, style, animate, transition, Input } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';
import { Utils } from '../../utils/utils';
import { TUTORIALS_ROUTE, DataStore, TUTORIALS_IMAGES } from '../../utils/utils';
// import * as _ from 'lodash';

@Component({
    selector: 'tutorials',
    templateUrl: './tutorials.html',
    styleUrls: ['./tutorials.css'],
    providers: []
})

export class Tutorials implements OnInit {
    private isClosing = false;
    private isOpening = true;
    private modalShow: boolean = true;
    private expanded = false;
    private activeIndex:number;
    // private pnvImages = [];
    // private fvcImages = [];
    // private aswotImages = [];
    // private lvocImages = [];
    // private cedImages = [];
    // private roaImages = [];
    // private hiqroaImages = [];
    private tutorialImages = TUTORIALS_IMAGES;
    
    constructor(private calcService: CalcService, private router: Router, private utils: Utils) { }

    ngOnInit() {
        this.isClosing = false;
        this.isOpening = true;
        // this.tutorialImages = _.merge({}, TUTORIALS_IMAGES);
        // this.pnvImages = ['/assets/images/PriceAndVolume_01.jpg', '/assets/images/PriceAndVolume_02.jpg', '/assets/images/PriceAndVolume_03.jpg', '/assets/images/PriceAndVolume_04.jpg', '/assets/images/PriceAndVolume_05.jpg', '/assets/images/PriceAndVolume_06.jpg', '/assets/images/PriceAndVolume_07.jpg'];
        // this.fvcImages = ['/assets/images/FixedVsVariableCosts_01.jpg', '/assets/images/FixedVsVariableCosts_02.jpg', '/assets/images/FixedVsVariableCosts_03.jpg', '/assets/images/FixedVsVariableCosts_04.jpg', '/assets/images/FixedVsVariableCosts_05.jpg', '/assets/images/FixedVsVariableCosts_06.jpg', '/assets/images/FixedVsVariableCosts_07.jpg', '/assets/images/FixedVsVariableCosts_08.jpg', '/assets/images/FixedVsVariableCosts_09.jpg', '/assets/images/FixedVsVariableCosts_10.jpg', '/assets/images/FixedVsVariableCosts_11.jpg', '/assets/images/FixedVsVariableCosts_12.jpg'];
        // this.aswotImages = ['/assets/images/AdvancedSWOT_01.jpg', '/assets/images/AdvancedSWOT_02.jpg', '/assets/images/AdvancedSWOT_03.jpg', '/assets/images/AdvancedSWOT_04.jpg', '/assets/images/AdvancedSWOT_05.jpg', '/assets/images/AdvancedSWOT_06.jpg', '/assets/images/AdvancedSWOT_07.jpg', '/assets/images/AdvancedSWOT_08.jpg', '/assets/images/AdvancedSWOT_09.jpg', '/assets/images/AdvancedSWOT_10.jpg'];
        // this.lvocImages = ['/assets/images/CustomerLifetimeValue_01.jpg', '/assets/images/CustomerLifetimeValue_02.jpg', '/assets/images/CustomerLifetimeValue_03.jpg', '/assets/images/CustomerLifetimeValue_04.jpg', '/assets/images/CustomerLifetimeValue_05.jpg', '/assets/images/CustomerLifetimeValue_06.jpg', '/assets/images/CustomerLifetimeValue_07.jpg', '/assets/images/CustomerLifetimeValue_08.jpg'];
        // this.cedImages = ['/assets/images/EnablersVsDifferentiators_01.jpg', '/assets/images/EnablersVsDifferentiators_02.jpg', '/assets/images/EnablersVsDifferentiators_03.jpg', '/assets/images/EnablersVsDifferentiators_04.jpg', '/assets/images/EnablersVsDifferentiators_05.jpg', '/assets/images/EnablersVsDifferentiators_06.jpg', '/assets/images/EnablersVsDifferentiators_07.jpg', '/assets/images/EnablersVsDifferentiators_08.jpg'];
        // this.roaImages = ['/assets/images/ReturnOnAssets_01.jpg', '/assets/images/ReturnOnAssets_02.jpg', '/assets/images/ReturnOnAssets_03.jpg', '/assets/images/ReturnOnAssets_04.jpg', '/assets/images/ReturnOnAssets_05.jpg', '/assets/images/ReturnOnAssets_06.jpg'];
        // this.hiqroaImages = ['/assets/images/HighImpactQuestionsROA_01.jpg', '/assets/images/HighImpactQuestionsROA_02.jpg', '/assets/images/HighImpactQuestionsROA_03.jpg', '/assets/images/HighImpactQuestionsROA_04.jpg', '/assets/images/HighImpactQuestionsROA_05.jpg', '/assets/images/HighImpactQuestionsROA_06.jpg'];
    }

    onClose() {
        this.isClosing = true;
        this.isOpening = false;
        this.modalShow = false;
        // let regex = new RegExp("(/)?" + TUTORIALS_ROUTE + "(//)?");
        // let newUrl = this.router.url.replace(regex, '');
        setTimeout(() => this.router.navigateByUrl(this.utils.stripChildRouteFromUrl(this.router.url, TUTORIALS_ROUTE)), 1000);
    }
}
