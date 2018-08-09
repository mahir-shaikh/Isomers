import { Component, ElementRef, OnInit, OnDestroy, trigger, state, style, animate, transition, ViewChild} from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Utils, MEETINGS_OUTLET, DASHBOARD_PATH, Dictionary, DISABLE_DASH, DataStore } from '../../utils/utils';
import { Chooser } from './chooser';

@Component({
    selector: 'user-choice',
    templateUrl: './user-choice.html',
    styleUrls: ['./user-choice.css'],
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
export class ChoiceComponent implements OnInit, OnDestroy {
    private eventType: string = "";
    private isClosing: boolean = false;
    private id: string;
    private scene: Dictionary;
    private choices = [];
    private isViewed = false;
    private answer:number = -1;
    private model: string;
    private title: string;
    @ViewChild('chooser') chooser: Chooser;
    private subscription;
    private routeObserver: any;
    private disableDashEvent;

    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private route: ActivatedRoute, private router: Router, private utils: Utils, private dataStore: DataStore) { }

    ngOnInit() {
        this.isClosing = false;
        this.route.params.forEach(params => this.id = params['id']);
        this.scene = this.textEngineService.getScene(this.id);
        this.title = " " + this.id;
        this.eventType = (this.scene['PageType'] === "SingleSelect") ? 'singleselect' : 
                    ((this.scene['PageType'] === "MultiSelect") ? 'multiselect' : 'unknown');
        
        let self = this;

        this.routeObserver = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                self.route.params.forEach(params => self.id = params['id']);
                self.title += " " + self.id;
                self.scene = self.textEngineService.getScene(self.id);
                self.eventType = (self.scene['PageType'] === "SingleSelect") ? 'singleselect' : 
                    ((self.scene['PageType'] === "MultiSelect") ? 'multiselect' : 'unknown');
            }
        });

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });

        this.disableDashEvent = this.dataStore.getObservableFor(DISABLE_DASH);

        this.dataStore.setData(DISABLE_DASH, true);
        this.onModelChange();
    }

    onModelChange(){
        this.answer = this.calcService.getValue("tlInput" + this.scene["ID"]) || -1;
        if(this.calcService.getValue("tlInput" + this.scene["ID"]) != 0){
            this.calcService.setValue("tlInputRead" + this.scene["ID"], 1);
            this.router.navigateByUrl(this.utils.generateFeedbackUrl(this.id));
        }
    }

    ngOnDestroy() {
        // this.isClosing = false;
        this.subscription.unsubscribe();
        this.routeObserver.unsubscribe();
    }

    onClose() {
        this.isClosing = true;
        this.dataStore.setData(DISABLE_DASH, false);
        setTimeout(() => this.router.navigateByUrl(this.utils.stripOutletFromUrl(this.router.url, MEETINGS_OUTLET)), 1000);
    }

    isReadyToSubmit():boolean {
        return (this.chooser && this.chooser.readyToSubmit !== undefined) ? this.chooser.readyToSubmit : false;
    }

    onSubmit() {
        this.isClosing = true;
        // submit decision on the chooser component
        this.chooser.submit();
        // now navigate to feedback
    }
}