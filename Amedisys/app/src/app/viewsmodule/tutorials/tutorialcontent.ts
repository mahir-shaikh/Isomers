import { Component, OnInit, Input } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
// import { Router } from '@angular/router';

@Component({
    selector: 'tutorial-content',
    templateUrl: './tutorialcontent.html',
    providers: []
})

export class TutorialContent {
    @Input() contentClass:string;
    @Input() titleKey:string;
    @Input() images:Array<string>;
    @Input() sceneId:string;
    
    constructor(private calcService: CalcService) { }

}
