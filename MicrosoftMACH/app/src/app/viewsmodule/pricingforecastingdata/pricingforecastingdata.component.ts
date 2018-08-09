import { ActivatedRoute, Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';  
import { TextEngineService } from '../../textengine/textengine.service';   

@Component({
  selector: 'pricingforecastingdata',
  templateUrl: './pricingforecastingdata.component.html',
  styleUrls: ['./pricingforecastingdata.component.styl']
})
export class PricingForecastingDataComponent implements OnInit {
	@Input() type : number = 0; // 0 = Consumer; 1 = Commercial
	private subscription: Subscription;
  private consumerRangeRef: string;
  private enterpriseRangeRef: string;
  private smbRangeRef: string;
  private buttonItem = ["SignificantDecrease","Decrease","Maintain","Increase","SignificantIncrease"];

  constructor(private calcservice: CalcService, private router:Router, private route:ActivatedRoute, private textEngineService : TextEngineService) { }

  ngOnInit() {
  	let self = this;
    this.Initialize();
    this.subscription = this.route.params.subscribe(() => {
     self.Initialize();
    });

    this.updateChartProperty();
  }

  Initialize(){
	this.type = this.route.snapshot.params['type'] == "1" ? 1 : 0;
  }

  updateChartProperty() {
    this.consumerRangeRef = "[tlOutputGraphsProd1Seg3NewRev, tlOutputGraphsProd3Seg3NewRev],"
                         +"[tlOutputGraphsProd1Seg3OnPremRev, '']," 
                         +"[tlOutputGraphsProd1Seg3RenewedRev, ''],"
                         +"[tlOutputGraphsProd1Seg3DefRev, '']";
                         //+"[tlOutputGraphsProd3Seg3TotalRev, tlOutputGraphsProd2Seg1RenewedRev]";


    this.enterpriseRangeRef = "[tlOutputGraphsProd1Seg1NewRev, tlOutputGraphsProd2Seg1NewRev, tlOutputGraphsProd3Seg1NewRev],"
                             +"[tlOutputGraphsProd1Seg1OnPremRev, tlOutputGraphsProd2Seg1OnPremRev, ''],"
                             +"[tlOutputGraphsProd1Seg1RenewedRev, tlOutputGraphsProd2Seg1RenewedRev, ''],"
                             +"[tlOutputGraphsProd1Seg1ServicesRev, tlOutputGraphsProd2Seg1ServicesRev, ''],"
                             +"[tlOutputGraphsProd1Seg1DefRev, tlOutputGraphsProd2Seg1DefRev, ''],";
                             //+"[tlOutputGraphsProd1Seg1TotalRev, tlOutputGraphsProd2Seg1TotalRev, tlOutputGraphsProd3Seg1TotalRev]";

    this.smbRangeRef = "[tlOutputGraphsProd1Seg2NewRev, tlOutputGraphsProd2Seg2NewRev, tlOutputGraphsProd3Seg2NewRev],"
                      +"[tlOutputGraphsProd1Seg2OnPremRev, tlOutputGraphsProd2Seg2OnPremRev, ''],"
                      +"[tlOutputGraphsProd1Seg2RenewedRev, tlOutputGraphsProd2Seg2RenewedRev, ''],"
                      +"[tlOutputGraphsProd1Seg2ServicesRev, tlOutputGraphsProd2Seg2ServicesRev, ''],"
                      +"[tlOutputGraphsProd1Seg2DefRev, tlOutputGraphsProd2Seg2DefRev, ''],";
                      //+"[tlOutputGraphsProd1Seg2TotalRev, tlOutputGraphsProd2Seg2TotalRev, tlOutputGraphsProd3Seg2TotalRev]";
  }

}