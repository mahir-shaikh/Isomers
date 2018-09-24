import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalcService } from '@btsdigital/ngx-isomer-core';

@Component({
  selector: 'strategy-setting',
  templateUrl: './strategysetting.component.html',
  styleUrls: ['./strategysetting.component.styl']
})
export class StrategysettingComponent implements OnInit {
	@Input() isReadOnly: boolean = false;
	private whereDropdownList = ["1","2","3","4","5"];
  private whatDropdownList = ["1","2","3","4"];
  private colorListWhere = ["red", "orange", "orange", "green", "green"];
  private colorListWhat = ["green", "cyan", "orange", "red"];  
	private howDropdownList = ["Reframe Innovations","Cost Efficiency","Customer Relationships","Breakthrough Innovation","Environmentalism","Financial Strength","Forecast Accuracy","Health & Wellness","IT Investment","Marketing","Operational Flexibility","Price Discount","Price Premium","Product Availability","Product Variety","Refresh Innovations","Talent Development","Trade Spend"];
  private rankColor: Array<string>;
  @Output() ranksArranged: EventEmitter<boolean> = new EventEmitter();
  private veteraOrder: boolean;
  private escendiaOrder: boolean;  
  private observer: any = null;

  constructor(private calcService: CalcService) { }

  ngOnInit() {
    this.observer = this.calcService.getObservable().subscribe(() => {
      this.onModelChanged();
    });
    this.onModelChanged();    
  }

  onModelChanged() {
    this.rankColor = [];
    for (let count = 3; count <= 6; count++)
      this.rankColor.push(this.colorListWhat[Number(this.calcService.getValue("tlOutput_toolStrategy_K1" + count)) - 1]);

    this.veteraOrder = this.calcService.getValue("tlOutput_toolStrategy_H17") == "10";
    this.escendiaOrder = this.calcService.getValue("tlOutput_toolStrategy_I17") == "10";
    this.ranksArranged.emit(this.veteraOrder && this.escendiaOrder);

  }

}