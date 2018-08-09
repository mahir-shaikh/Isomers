import { Component, Input, ElementRef, OnInit, OnDestroy, trigger, state, style, animate, transition, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd, NavigationStart } from '@angular/router';
import { MESSAGES_OUTLET, Utils, Dictionary, TUTORIALS_IMAGES, TUTORIALS_MAP } from '../../utils/utils';
// import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
    selector: 'info',
    templateUrl: './info.html',
    styleUrls: ['./info.css'],
    // animations: [
    //     trigger('routeAnimation', [
    //         state('*', style({ transform: 'translateX(100%)', opacity: 1 })),
    //         transition('void => *', [
    //             style({ transform: 'translateX(200%)', opacity: 1 }),
    //             animate(1000)
    //         ]),
    //         transition('* => void', [
    //             animate(1000, style({ transform: 'translateX(200%)', opacity: 0 }))
    //         ])
    //     ])
    // ],
    host: {
        // '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    }
})
export class InfoComponent implements OnInit, OnDestroy {
    private el: HTMLElement; 
    private title = "Info component !!!";
    private id: string;
    private message:Dictionary;
    private isClosing = false;
    private routerObserver: Subscription;
    private imageHeader = "";
    private tutorialImages: Array<string>;
    private tutorialKey: string;
    private tutorialDescription: string; 

    private chartType = "";
    @Input() rangeref = "";
    @Input() categorylabels = "";
    @Input() serieslabels = "";
    @Input() year = "";
    @Input() numberformat = "";
    @Input() charttitle = "";
    @Input() chartoptions:any = {};
    @Input() min = "";
    @Input() max = "";

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private elRef: ElementRef, private route: ActivatedRoute, private router: Router, private utils: Utils) { };

    ngOnInit() {
        this.el = this.elRef.nativeElement;
        this.isClosing = false;
        this.route.params.forEach(params => this.id = params['id']);
        this.title += " " + this.id;
        this.message = this.textengineService.getScene(this.id);
        this.imageHeader = (((this.message["image"] != undefined) && (this.message["image"] != "")) ? "assets/images/" + this.message["image"] : "");

        // check if there is tutorial present
        if (this.message["tutorial"]) {
            this.tutorialKey = 'tutorialDescription';
            this.tutorialImages = TUTORIALS_IMAGES[TUTORIALS_MAP[this.message["tutorial"]]];
        }

        this.rangeref = this.message["chartranges"];
        this.categorylabels = this.message["chartcategories"];
        this.serieslabels = this.message["chartseries"];
        this.year = this.message["chartyear"];
        this.numberformat = this.message["chartnumberformat"];
        this.charttitle = this.message["charttitle"];
        if (this.message["chartoptions"] && this.message["chartoptions"] !== "") {
            try {
                this.chartoptions = JSON.parse(this.message["chartoptions"].replace(/'/g, '"'));
            }
            catch(e) {
                this.chartoptions = {};
            }
        }
        this.min = this.message["min"];
        this.max = this.message["max"];
        this.chartType = this.message["chart"];

        _.merge(this.chartoptions, { chart: { backgroundColor: '#fff' }, xAxis: { labels: { style: { 'color': '#333' } } }, yAxis: { labels: { style: { 'color': '#333' } },
                alternateGridColor: 'rgb(240, 241, 242)' }, legend: { itemStyle: { 'color': '#333'}} });

        this.chartoptions = JSON.stringify(this.chartoptions);

        this.routerObserver = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.route.params.forEach(params => this.id = params['id']);
                this.title += " " + this.id;
                this.message = this.textengineService.getScene(this.id);
            }
        });
    }

    onClose() {
        // this.calcService.setValue("tlInput"+this.message["ID"], 1);
        this.calcService.setValue("tlInputRead"+this.message["ID"], 1);
        // this.toggleClass(true);
        // setTimeout(() => this.router.dispose(), 1000);
        this.isClosing = true;
        setTimeout(() => this.router.navigateByUrl(this.utils.stripOutletFromUrl(this.router.url, MESSAGES_OUTLET)), 1000);
        // this.router.navigateByUrl(DASHBOARD_PATH);
    }

    ngOnDestroy() {
        this.isClosing = false;
        this.routerObserver.unsubscribe();
    }
}
