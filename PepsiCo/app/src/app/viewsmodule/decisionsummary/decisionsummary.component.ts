import { Component, OnInit } from '@angular/core';
import { CalcService } from '@btsdigital/ngx-isomer-core';

@Component({
  selector: 'decisionsummary-report',
  templateUrl: './decisionsummary.component.html',
  styleUrls: ['./decisionsummary.styl']
})
export class DecisionsummaryComponent implements OnInit {
	private currentYear: number;

  constructor(private calcService: CalcService) { }

  ngOnInit() {
  	this.currentYear = +this.calcService.getValue("tlInputTeamYear");
  }

}
