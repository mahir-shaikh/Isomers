import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-timelinebudgetdata',
  templateUrl: './timelinebudgetdata.component.html',
  styleUrls: ['./timelinebudgetdata.component.styl']
})
export class TimelineBudgetDataComponent implements OnInit {
    private customChartOption = '{"legend":{"enabled" : false}}';
    private timelineChartOption = '{"yAxis":{"tickInterval" : 3, "max" : 15} ,"legend":{"enabled" : false}}';

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

}