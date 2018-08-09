import { Component, Input, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';

@Component({
    selector: 'feedbacktextandimage',
    templateUrl: './feedbacktextandimage.html',
    styleUrls: ['./feedbacktextandimage.css'],
    providers: []
})

export class FeedbackTextAndImage implements OnInit {
    @Input() index;
    @Input() feedback = {};
    
    private title = "";
    private narrative = "";
    private narrativeArray = [];
    private image = "";

    private isHidden = true;
    private isViewed = false;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        let narrativeChunk:string = "";

        this.title = this.feedback["name"];
        if ((this.feedback["image"] != undefined) && (this.feedback["image"] != "")) {
            this.image = "assets/images/" + this.feedback["image"];
        }

        let index:number = 1;
        narrativeChunk = this.feedback["narrative"+index];

        while ((narrativeChunk != undefined) && (index < 100)) {
            let conditional = true;
            let conditionalChunk = this.feedback["condition"+index];

            if (conditionalChunk != undefined) {
                conditional = this.calcService.getValue(conditionalChunk);
            }
            if (conditional) {
                this.narrative += narrativeChunk;
            }

            index++;
            narrativeChunk = this.feedback["narrative"+index];
        }

        if (this.narrative != undefined) {
            let startLoc = this.narrative.indexOf("{{");
            index = 0;

            while ((startLoc != -1) && (index < 100)) {
                let endLoc = this.narrative.indexOf("}}");
                if (endLoc != -1) {
                    let lookupVal = this.narrative.substr(startLoc+2, ((endLoc-1)-startLoc-1)).trim();
                    this.narrative = this.narrative.substr(0, startLoc) + this.calcService.getValue(lookupVal) + this.narrative.substr(endLoc+2);
                }
                startLoc = this.narrative.indexOf("{{");
                index++;
            }
        }
    }
}
