import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../utils';
import { CalcService } from '../../calcmodule/calc.service';


@Component({
    selector: 'performancedashboard',
    templateUrl: './performancedashboard.component.html',
    styleUrls: ['./performancedashboard.component.styl'],
})

export class PerformanceDashboardComponent {
	private area: string = "Prod";
	private subscription:any;
	
    constructor( private router: Router,private calcService: CalcService) { };

    ngOnInit() {
    	let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            this.area = "Reg";
        }

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.updateArea();
        });
    }

    updateArea(){
        let area = this.calcService.getValue("xxRDB1DBM2");
        if(area == "2"){
            this.area = "Reg";
        }else{
            this.area = "Prod";
        }
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
