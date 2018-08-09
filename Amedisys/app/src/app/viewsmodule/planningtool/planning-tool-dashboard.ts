import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';

@Component({
    selector: 'planning-tool-dash',
    templateUrl: './planning-tool-dashboard.html',
    styleUrls: ['./planning-tool-dashboard.css'],
    providers: []
})

export class PlanningToolDash implements OnInit, OnDestroy {

    private EnterpriseSales:string;
    private EnterpriseRandD:string;
    private activeIndex:number = 0;
    private modelSubscription:any;

    constructor(private textengineService: TextEngineService, private calcService: CalcService, private router: Router) {
        var self = this;

        self.EnterpriseSales = textengineService.getText("EnterpriseSales");
        self.EnterpriseRandD = textengineService.getText("EnterpriseRandD");
    }

    ngOnInit() {

        this.modelSubscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });

    }

    onModelChange(){
    }

    ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }

    onSelect($event) {
        let path: string = $event.srcElement.attributes['data-planning-segment'].value || "doofocus";

        this.router.navigate(['/dashboard', { outlets: { 'planning': 'planning/' + path } }]);
    }

    setActiveIndex(activeIndex:number){
        this.activeIndex = activeIndex;
    }
}
