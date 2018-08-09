import { Component, ElementRef, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { MEETINGS_OUTLET } from '../../utils/utils';
import { Utils, Dictionary, TUTORIALS_IMAGES, TUTORIALS_MAP } from '../../utils/utils';
import { Chooser } from './chooser';

@Component({
    selector: 'single-select',
    templateUrl: './single-select.html',
    styleUrls: ['./single-select.css']
})

export class SingleSelect implements OnInit, OnDestroy, Chooser {
    private el: HTMLElement;
    private title = "Info component !!!";
    private choices = [];
    private isViewed = false;
    private answer:number = -1;
    public radioModel: number = -1;
    private isClosing: boolean = false;
    private uncheckable: boolean = false;
    @Input() id: string;
    @Input() scene: Dictionary;
    public readyToSubmit = false;
    private image: string = "";
    private tutorialImages: Array<string>;
    private tutorialKey: string;
    private tutorialDescription: string; 
    
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private elRef: ElementRef, private route: ActivatedRoute, private router: Router, private utils: Utils) { };

    ngOnInit() {
        // this.el = this.elRef.nativeElement;
        // this.isClosing = false;
        // //this.id = +this.route.params['id'];
        // //debugger;
        // this.route.params.forEach(params => this.id = params['id']);
        // console.log("loading Message / meeting id: " + this.id);
        // this.id = (this.id) ? this.id : 1;
        // this.scene = this.textengineService.getScene(this.id);
        var curVal = this.calcService.getValue("tlInput" + this.scene["ID"]);

        if  (curVal) {
            this.answer = curVal;
        }

        this.title += " " + this.id;

        // set choices array
        //var localObj = this.scene;
        var localChoices = [];

        localChoices = this.textengineService.getSingleSelectChoices(this.id);
        // loop while we still have an 'alt' value
        
        this.choices = localChoices;
        this.image = "assets/images/" + this.scene["image"];
        // console.log ("choices");
        // console.log (this.choices);
        // check if there is tutorial present
        if (this.scene['tutorial']) {
            this.tutorialKey = 'tutorialDescription';
            this.tutorialImages = TUTORIALS_IMAGES[TUTORIALS_MAP[this.scene['tutorial']]];
        }
    }

    onSelect($event) {
        // console.log("ngModel Changed", this.answer);
        this.readyToSubmit = true;
    }

    submit() {
        this.calcService.setValue("tlInput" + this.scene["ID"], this.answer);
        this.calcService.setValue("tlInputRead" + this.scene["ID"], 1);
        // console.log("Choice made --- " + window.performance.now());
    }

    ngOnDestroy() {
        this.isClosing = false;
    }
}
