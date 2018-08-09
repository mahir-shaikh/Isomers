import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-salesmarketing',
  templateUrl: './salesmarketing.component.html',
  styleUrls: ['./salesmarketing.component.styl']
})
export class SalesmarketingComponent implements OnInit {
    private gaugeChartOption = '{"pane":{ "background" : { "backgroundColor" : "rgba(0,0,0,0.1)" } } }';

  constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

  ngOnInit() {
  }

}