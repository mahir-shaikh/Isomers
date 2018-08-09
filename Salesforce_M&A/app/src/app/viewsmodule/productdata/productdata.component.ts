import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-productdata',
  templateUrl: './productdata.component.html',
  styleUrls: ['./productdata.component.styl']
})
export class ProductDataComponent implements OnInit {
    private productDropdownList = ["Q1","Q2","Q3","Q4","Delay"];
    private productOptionList = ["1","0.75","0.5","0.25","0.1"];
    // private productOptionList = ["100%","75%","50%","25%","10%"];

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

}