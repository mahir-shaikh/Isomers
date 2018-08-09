import { Component, ElementRef, OnInit, OnDestroy, trigger, state, style, animate, transition } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { MEETINGS_OUTLET, Utils, Dictionary, DataStore, DISABLE_DASH } from '../../utils/utils';


@Component({
    selector: 'feedback',
    templateUrl: './feedback.html',
    styleUrls: ['./feedback.css'],
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
        '[style.display]': "'block'"
    }
})
export class FeedbackComponent implements OnInit, OnDestroy {
    private isClosing: boolean = false;
    private id: string;
    private scene: Dictionary;
    private choice:number = -1;
    private feedback:string = "";
    private imageHeader:string = "";
    private title:string = "";
    public oneAtATime:boolean = true;
    private narrative:string;
    constructor(private calcService: CalcService, private textEngineService: TextEngineService, private route: ActivatedRoute, private router: Router, private utils: Utils, private dataStore: DataStore) { }

    ngOnInit() {
        this.isClosing = false;
        this.route.params.forEach(params => this.id = params['id']);
        this.scene = this.textEngineService.getScene(this.id);

        // get choice made
        this.choice = this.calcService.getValue("tlInput"+this.id);
        // console.log ("choice: " + this.choice);
        // set feedback text
        this.title = this.scene["name"];
        this.feedback = this.scene["alt"+this.choice+"_feedback"];
        this.imageHeader = (((this.scene["feedbackimage"] != undefined) && (this.scene["feedbackimage"] != "")) ? "assets/images/" + this.scene["feedbackimage"] : "");
        this.narrative = this.scene['narrative']
    }

    ngOnDestroy() {

    }

    onClose() {
        this.isClosing = true;
        this.dataStore.setData(DISABLE_DASH, false);
        setTimeout(() => this.router.navigateByUrl(this.utils.stripOutletFromUrl(this.router.url, MEETINGS_OUTLET)), 1000);
    }
}