import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'dashboard-metrics',
  templateUrl: './dashboardmetrics.component.html',
  styleUrls: ['./dashboardmetrics.component.styl']
})
export class DashboardMetricsComponent implements OnInit {
    private currentYear: number = 0;
    private prevYear: number = 0;

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        this.currentYear = this.calcService.getValue("tlInputTeamYear");
        this.prevYear = this.currentYear - 1;
    }

}