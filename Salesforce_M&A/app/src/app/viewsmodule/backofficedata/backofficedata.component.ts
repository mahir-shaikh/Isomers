import { Component, OnInit, EventEmitter } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-backofficedata',
  templateUrl: './backofficedata.component.html',
  styleUrls: ['./backofficedata.component.styl']
})
export class BackOfficeDataComponent implements OnInit {
    private backofficeDropdownList1 = ["Q1","Q2","Q3","Q4","Delay"];
    private backofficeDropdownList2 = ["0","1","2","3","4"];
    private backofficeDropdownList3 = ["Move to Cloud","Keep Existing"];
    private securityDropdownList1 = ["Q1","Q2","Q3","Q4","Delay"];
    private securityDropdownList2 = ["Yes","No"];
    private securityDropdownList3 = ["Yes","No"];
    private securityDropdownListRiskMitigation = ["Choose","0%","25%","50%","75%","100%"];
    private intLevel: number = 0;
    private disableBuildInfra: boolean = false;
    private subscriber: EventEmitter<any>;

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        let self = this;

        this.subscriber = this.calcService.getObservable().subscribe(() => {
            self.updateLevel();
            self.checkBuildInfraState();
        });

        this.updateLevel();
        this.checkBuildInfraState();
    }

    updateLevel() {
        let level = this.calcService.getValue("tlInputITIntegrationLevel");
        this.intLevel = level;
    }

    checkBuildInfraState(){
      let checkValue = this.calcService.getValue("tlInputITOfficePlan");
      if(checkValue == "Move to Cloud"){
        this.disableBuildInfra = true;
      }else{
        this.disableBuildInfra = false;
      }
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

}