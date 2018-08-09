import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';


@Component({
    selector: 'opsmarketingdata',
    templateUrl: './opsmarketingdata.component.html',
    styleUrls: ['./opsmarketingdata.component.styl']
})

export class OpsMarketingDataComponent {
	private maxLimitPB: number = 100;
    private maxLimitIC: number = 100;
    private modelChangeListner: any;

    constructor( private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() { 
  	
	this.setMaxLimit();
    this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
    	this.setMaxLimit();
    });

  }

  ngOnDestroy(){
      this.modelChangeListner.unsubscribe();
  }

  setMaxLimit(){
    let pcValue = this.calcService.getValue("tlInputOpsCommercialProd3Marketing");

    if(pcValue <= 0){
      this.maxLimitPB = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputOpsCommercialProd1Marketing"),100));
      this.maxLimitIC = Math.round(numberFormatting.unformat(this.calcService.getValue("tlInputOpsCommercialProd2Marketing"),100));
    }else{
      this.maxLimitPB = 100;
      this.maxLimitIC = 100
    }
  }
}
