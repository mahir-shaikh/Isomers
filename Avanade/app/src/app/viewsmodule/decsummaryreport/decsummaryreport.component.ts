import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-decsummaryreport',
  templateUrl: './decsummaryreport.component.html',
  styleUrls: ['./decsummaryreport.component.styl']
})
export class DecsummaryreportComponent implements OnInit {

  constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

  ngOnInit() {
  }

}