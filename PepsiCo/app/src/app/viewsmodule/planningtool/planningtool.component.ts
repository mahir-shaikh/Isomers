import { Component, OnInit, ViewChild } from '@angular/core';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';
import { DataStore, EVENTS } from '../../utils';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'planningtool',
  templateUrl: './planningtool.component.html',
  styleUrls: ['./planningtool.component.styl']
})
export class PlanningtoolComponent implements OnInit {
    private activeIndex: number = 1;
    private tabNo: number;
    private tab1:string;
    private tab2:string;
    private tab3:string;
    private planningCompleted: boolean = false;
    private planningToolValidate: boolean = false;
    @ViewChild('submitModal') public submitModalRef: ModalDirective;
    private isClosing = false;
    private isOpening = true;

    constructor(private textengineService: TextService, private calcService: CalcService, private dataStore: DataStore, private router: Router) { }

    ngOnInit() {
        this.isClosing = false;
        this.isOpening = true;

        let self = this;
        this.tab1 = this.textengineService.getText("PlanningToolTabHeading1");
        this.tab2 = this.textengineService.getText("PlanningToolTabHeading2");
        this.tab3 = this.textengineService.getText("PlanningToolTabHeading3");

        this.updateState();
        this.validateTool(this.calcService.getValue("tlOutput_toolStrategy_H17") == "10" && 
            this.calcService.getValue("tlOutput_toolStrategy_I17") == "10")
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {
            case 1:
                this.tabNo = 1;
                break;
            case 2:
                this.tabNo = 2;
                break;
            case 3:
                this.tabNo = 3;
                break;
            default:
                this.tabNo = 1;
                break;
        }
    }

    updateState(){
        // const planningData = this.dataStore.getData(EVENTS['PLANNING_COMPLETE'], true);
        // if (planningData !== null) {
        //     planningData.then((ready) => {
        //         if (ready == 'true') {
        //             this.planningCompleted = true;
        //         }else{
        //             this.planningCompleted = false;
        //         }
        //     });
        // }
        this.planningCompleted = this.calcService.getValue("tlOutputStrategyCommit") == "0" ? false : true;
    }

    onSubmit(){
        this.dataStore.setData(EVENTS.PLANNING_COMPLETE,true,true);
        this.calcService.setValue("tlOutputStrategyCommit",true);
        this.onClose();
    }

    showSubmitModal(){
        this.submitModalRef.show();
    }

    hideSubmitModal(){
        this.submitModalRef.hide();
    }

    onClose(){
        this.isClosing = true;
        this.isOpening = false;

        setTimeout(() => {
            this.router.navigate(['/region','vetera']);
        }, 1000);
    }

    validateTool($event) {
        this.planningToolValidate = $event;
    }
    
}