import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-dashboardgraph',
  templateUrl: './dashboardgraph.component.html',
  styleUrls: ['./dashboardgraph.component.styl']
})
export class DashboardGraphComponent implements OnInit {

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

}