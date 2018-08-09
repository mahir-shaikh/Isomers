import { Router, ActivatedRoute } from '@angular/router';
import { CalcService } from './../../calcmodule/calc.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';     
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';

@Component({
  selector: 'app-partnerdata',
  templateUrl: './partnerdata.component.html',
  styleUrls: ['./partnerdata.component.styl']
})
export class PartnerDataComponent implements OnInit {
	@Input() type : number = 0; // 0 = Consumer; 1 = Commercial
  	private subscription: Subscription;
    private buttonItem:string[] = ["0","1","2","3","4","5"];
    private cloudMigrationIsVisible:boolean = false;
    private maxLimitOEM: number = 100;
    private maxLimitRetailer: number = 100;
    private maxLimitISV: number = 100;
    private maxLimitSI: number = 100;
    private maxLimitMS: number = 100;
    private modelChangeListner: any;

  constructor(private calcService: CalcService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() { 
  	let self = this;
    this.Initialize();
    this.subscription = this.route.params.subscribe(() => {
     self.Initialize();
    });

    if(this.type){
      this.setChannelMaxLimit();
    }else{
      this.setDeveloperMaxLimit();
    }         
    this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
        if(self.type){
          this.setChannelMaxLimit();
        }else{
          this.setDeveloperMaxLimit();
        }        
    });

    this.cloudMigrationIsVisible = false;//this.isVisibleCloudMigration();
  }

  ngOnDestroy(){
      this.subscription.unsubscribe();
      this.modelChangeListner.unsubscribe();
  }

  Initialize(){
	this.type = this.route.snapshot.params['type'] == "1" ? 1 : 0;
  }

  isVisibleCloudMigration() {
    return this.calcService.getValue('tlTeamRound') === 1 ? false : true;
  }

  setDeveloperMaxLimit(){
    let developerValue = this.calcService.getValue("tlInputConsumerPartner6Pct");

    if(developerValue <= 0){
      this.maxLimitOEM = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputConsumerPartner4Pct"),100));
      this.maxLimitRetailer = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputConsumerPartner5Pct"),100));
    }else{
      this.maxLimitOEM = 100;
      this.maxLimitRetailer = 100
    }
  }

  setChannelMaxLimit(){
    let channelValue = this.calcService.getValue("tlInputCommercialPartner4Pct");

    if(channelValue <= 0){
      this.maxLimitISV = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputCommercialPartner1Pct"),100));
      this.maxLimitSI = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputCommercialPartner2Pct"),100));
      this.maxLimitMS = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputCommercialPartner3Pct"),100));
    }else{
      this.maxLimitISV = 100;
      this.maxLimitSI = 100;
      this.maxLimitMS = 100
    }
  }
}