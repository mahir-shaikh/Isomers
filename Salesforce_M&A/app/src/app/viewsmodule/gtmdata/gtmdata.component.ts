import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-gtmdata',
  templateUrl: './gtmdata.component.html',
  styleUrls: ['./gtmdata.component.styl']
})
export class GtmDataComponent implements OnInit {
	private gtmDropdownList1 = ["Q1","Q2","Q3","Q4","Delay"];
	private gtmDropdownList2 = ["Q1","Q2","Q3","Q4","Delay"];
	private gtmDropdownList3 = ["Q1","Q2","Q3","Q4","Delay","Keep Separate"];
	private gtmDropdownList4 = ["Do Nothing","CoPrime","Hire More AEs"];
	private gtmDropdownList5 = ["Yes","No"];
  private disableLeadPass: boolean = false;
  private subscriber: any = null;

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
      let self = this;

      this.checkLeadPassState();
      this.subscriber = this.calcService.getObservable().subscribe(() => {
        self.checkLeadPassState();
      });
    }

    checkLeadPassState(){
      let checkValue = this.calcService.getValue("tlInputGTMOrg62Timeline");
      if(checkValue == "Q1"){
        this.disableLeadPass = true;
      }else{
        this.disableLeadPass = false;
      }
    }

    ngOnDestroy(){
      this.subscriber.unsubscribe();
    }

}