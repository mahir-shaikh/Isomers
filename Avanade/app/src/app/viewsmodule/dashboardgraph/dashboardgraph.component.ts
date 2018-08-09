import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'dashboardgraph',
  templateUrl: './dashboardgraph.component.html',
  styleUrls: ['./dashboardgraph.component.styl']
})
export class DashboardGraphComponent implements OnInit {
	private commonChartOption = '{ "chart": { "marginTop": -15,"backgroundColor" : "transparent"},"yAxis":{"minColor":"#FFCA31", "maxColor":"#FFCA31"}, "plotOptions" : {"solidgauge" : {"dataLabels" : {"style": {"color": "#FFF", "fontSize": "14px", "fontWeight": "600"}}}}}';

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

}