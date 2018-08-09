import { Component, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';

@Component({
  selector: 'dashboard-metrics',
  templateUrl: './dashboardmetrics.component.html',
  styleUrls: ['./dashboardmetrics.component.styl']
})
export class DashboardmetricsComponent implements OnInit {
    private commonChartOption = '{ "chart": { "marginTop": -15,"backgroundColor" : "transparent"},"yAxis":{"minColor":"#21A8DB", "maxColor":"#21A8DB"}}';

  constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

  ngOnInit() {
  }

}