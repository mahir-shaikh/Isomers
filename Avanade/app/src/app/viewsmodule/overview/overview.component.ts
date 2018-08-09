import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.styl']
})
export class OverviewComponent implements OnInit {
    private gaugeChartOption = '{"pane":{ "background" : { "backgroundColor" : "rgba(0,0,0,0.1)" } } }';
    private pieChartOpion = '{"legend" : { "layout" : "Vertical", "align" : "right", "verticalAlign" : "middle" }}';
    private columnChartOption: string = '{"xAxis":{"labels":{"enabled": true }},"yAxis":{"labels":{"enabled": false }},"plotOptions":{ "series" : {"dataLabels" : { "enabled" : "true" }} }}';


  constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

    ngOnInit() {
    }

}