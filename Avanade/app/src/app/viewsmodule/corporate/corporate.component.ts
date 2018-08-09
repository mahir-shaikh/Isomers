import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.styl']
})
export class CorporateComponent implements OnInit {
	private AttritionList = ["Very Low","Low","Average","High","Very High"];
    private SalaryList = ["Below Market","Slightly Below Market","At Market","Above Market","Best in Class"];

	constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

	ngOnInit() {
	}

}