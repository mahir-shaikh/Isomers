import { Component, OnInit, Input } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-integrationplanningtable',
  templateUrl: './integrationplanningtable.component.html',
  styleUrls: ['./integrationplanningtable.component.styl']
})
export class IntegrationPlanningTableComponent implements OnInit {
    private arrRangeName = ["People","IT","GTM","Product","Timeline"];
    private isYearlyTabOpen:boolean = true;
    private isQuaterlyTabOpen:boolean = true;
    @Input() activeIndex: number = 0;

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

    toggleYearlyTab(){
        // this.isYearlyTabOpen = !this.isYearlyTabOpen;
        this.isYearlyTabOpen = this.isYearlyTabOpen? false : true;
    }
    
    toggleQuaterlyTab(){
        // this.isQuaterlyTabOpen = !this.isQuaterlyTabOpen;
        this.isQuaterlyTabOpen = this.isQuaterlyTabOpen? false : true;
    }

}