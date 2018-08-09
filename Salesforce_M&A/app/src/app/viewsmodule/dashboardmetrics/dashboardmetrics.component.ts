import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'dashboard-metrics',
  templateUrl: './dashboardmetrics.component.html',
  styleUrls: ['./dashboardmetrics.component.styl']
})
export class DashboardMetricsComponent implements OnInit {

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

}