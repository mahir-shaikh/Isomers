import { Component, OnInit, trigger, state, style, animate, transition, Input } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { Utils, RESOURCES_ROUTE, DataStore } from '../../utils/utils';

@Component({
    selector: 'resources',
    templateUrl: './resources.html',
    styleUrls: ['./resources.css'],
    providers: []
})

export class Resources implements OnInit {
    private isClosing = false;
    private isOpening = true;
    private modalShow: boolean = true;
    private expanded = false;
    private activeIndex: number;
    private planningStepsText:string = "";
    private xyz:string = "";
    private guideTabText: Array<any> = [];
    
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private router: Router, private utils: Utils) { }

    ngOnInit() {
        this.isClosing = false;
        this.isOpening = true;

        this.planningStepsText = this.textengineService.getText("PlanningStepsPage1Text");
        this.guideTabText.push(this.textengineService.getText("GuidePage1Text"));
        this.guideTabText.push(this.textengineService.getText("GuidePage3Text"));
        this.guideTabText.push(this.textengineService.getText("GuidePage4Text"));
        this.guideTabText.push(this.textengineService.getText("GuidePage5Text"));
    }

    onClose() {
        this.isClosing = true;
        this.isOpening = false;
        this.modalShow = false;
        // let regex = new RegExp("(/)?" +RESOURCES_ROUTE + "(//)?");
        // let newUrl = this.router.url.replace(regex, '');
        // setTimeout(() => this.router.navigateByUrl(newUrl), 1000);
        setTimeout(() => this.router.navigateByUrl(this.utils.stripChildRouteFromUrl(this.router.url, RESOURCES_ROUTE)), 1000);
    }
}
