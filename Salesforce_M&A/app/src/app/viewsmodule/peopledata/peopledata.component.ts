import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-peopledata',
  templateUrl: './peopledata.component.html',
  styleUrls: ['./peopledata.component.styl']
})
export class PeopleDataComponent implements OnInit {
    private customChartOption = '{"xAxis":{"tickWidth":0,"lineWidth":0},"yAxis":{"visible":false},"legend":{"enabled" : false}}';
    private peopleDropdownList1 = ["Q1","Q2","Q3","Q4","Delay"];
    private peopleDropdownList2 = ["20%","15%","10%","5%","0%","-5%","-10%"];
    private peopleDropdownList3 = ["20%","15%","10%","5%","0%","-5%","-10%"];

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
    }

}