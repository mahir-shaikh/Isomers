import { Component, Input, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as _ from 'lodash';


@Component({
    selector: 'feedbacktextandchart',
    templateUrl: './feedbacktextandchart.html',
    styleUrls: ['./feedbacktextandchart.css'],
    providers: []
})

export class FeedbackTextAndChart implements OnInit {
    @Input() index;
    @Input() feedback = {};
    @Input() rangeref = "";
    @Input() categorylabels = "";
    @Input() serieslabels = "";
    @Input() year = "";
    @Input() numberformat = "";
    @Input() charttitle = "";
    @Input() chartoptions:any = {};
    @Input() min = "";
    @Input() max = "";
    @Input() linewidth = "1";
    
    private title = "";
    private narrative = "";
    private chart;
    private chartType = "";
    private charttopper = "";

    private isHidden = true;
    private isViewed = false;
    private dataLabels="";

    constructor(private sanitizer: DomSanitizer, private textengineService: TextEngineService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        let narrativeChunk:string = "";

        this.title = this.feedback["name"];

        // this.chart = this.sanitizer.bypassSecurityTrustHtml(this.feedback["chart"]);
        this.rangeref = this.feedback["chartranges"];
        this.categorylabels = this.feedback["chartcategories"];
        this.serieslabels = this.feedback["chartseries"];
        this.year = this.feedback["chartyear"];
        this.numberformat = this.feedback["chartnumberformat"];
        this.charttitle = this.feedback["charttitle"];
        this.charttopper = this.feedback["charttopper"];
        // console.log('feedback text' + this.feedback['chartoptions']);
        if (this.feedback["chartoptions"] && this.feedback["chartoptions"] !== "") {
            try {
                this.chartoptions = JSON.parse(this.feedback["chartoptions"].replace(/'/g, '"'));
                // console.log('JSON - ', this.chartoptions);
            }
            catch(e) {
                this.chartoptions = {};
                // console.log(e);
            }
        }if (this.feedback["datalabelsranges"] && this.feedback["datalabelsranges"] !== "") {
            _.merge(this.chartoptions, {"plotOptions":{"column":{"dataLabels":{"enabled":true,"y":300}}} });
        }
        this.dataLabels = this.feedback["datalabelsranges"];
        this.min = this.feedback["min"];
        this.max = this.feedback["max"];
        this.linewidth = this.feedback["linewidth"];
        this.chartType = this.feedback["chart"];

        _.merge(this.chartoptions, { chart: { backgroundColor: '#fff' }, xAxis: { labels: { style: { 'color': '#333' } } }, yAxis: { labels: { style: { 'color': '#333' } },
                alternateGridColor: 'rgb(240, 241, 242)' }, legend: { itemStyle: { 'color': '#333'}} });

        this.chartoptions = JSON.stringify(this.chartoptions);

        let index:number = 1;
        narrativeChunk = this.feedback["narrative"+index];

        while ((narrativeChunk != undefined) && (index < 100)) {
            let conditional = true;
            let conditionalChunk = this.feedback["condition"+index];

            if (conditionalChunk != undefined) {
                if (this.year != "") {
                    conditional = this.calcService.getValueForYear(conditionalChunk, this.year);
                } else {
                    conditional = this.calcService.getValue(conditionalChunk);
                }
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

        if (this.charttopper != undefined) {
            let startLoc = this.charttopper.indexOf("{{");
            index = 0;

            while ((startLoc != -1) && (index < 100)) {
                let endLoc = this.charttopper.indexOf("}}");
                if (endLoc != -1) {
                    let lookupVal = this.charttopper.substr(startLoc+2, ((endLoc-1)-startLoc-1)).trim();
                    this.charttopper = this.charttopper.substr(0, startLoc) + this.calcService.getValue(lookupVal) + this.charttopper.substr(endLoc+2);
                }
                startLoc = this.charttopper.indexOf("{{");
                index++;
            }
        }
    }
}
