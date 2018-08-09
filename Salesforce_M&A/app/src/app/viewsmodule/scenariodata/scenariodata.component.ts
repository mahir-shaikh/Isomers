import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';
import { ModalDirective } from 'ng2-bootstrap';


@Component({
  selector: 'scenariodata',
  templateUrl: './scenariodata.component.html',
  styleUrls: ['./scenariodata.component.styl']
})
export class ScenarioDataComponent implements OnInit {
    @Input() scenarioRef: string;
    @Input() wobblerRef: string;
    @Input() triggerRef: string = "";
    private wobblerNumber: number;
    private isRunComplete: boolean;
    private subscriber: EventEmitter<any>;
    private showDisruption: boolean = true;
    private showEmployeeEngagement: boolean = true;
    private showTrust: boolean = true;
    private showCSat: boolean = true;
    private showACV: boolean = true;
    private showBudgetDelta: boolean = true;
    private isOpen: boolean = true;
    private isDisabled: boolean = false;

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        let self=this;
        this.onModelChange();
        this.subscriber = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });

    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    onModelChange(){
        let status = this.calcService.getValue(this.scenarioRef);
        if(this.isRunComplete != (status)){
            this.isOpen = true;
        }
        this.isRunComplete = (status) ? status : false;

        this.wobblerNumber = parseInt(this.wobblerRef.replace("tlInputWobbler",""));
        this.updateBooleans();

        if(this.triggerRef != ""){
            let val = this.calcService.getValue(this.triggerRef);
            this.isDisabled = (val) ? !val : true;
        }else{
            this.isDisabled = false;
        }
    }

    runScenario(){
        this.calcService.setValue(this.scenarioRef,"TRUE");
        this.calcService.setValue(this.wobblerRef,this.wobblerNumber);
    }

    updateBooleans(){
        this.showDisruption = this.calcService.getValue("tlOutputDisruptionScen"+this.wobblerNumber) == "" ? false : true;
        this.showEmployeeEngagement = this.calcService.getValue("tlOutputESATScen"+this.wobblerNumber) == "" ? false : true;
        this.showTrust = this.calcService.getValue("tlOutputTrustScen"+this.wobblerNumber) == "" ? false : true;
        this.showCSat = this.calcService.getValue("tlOutputCSATScen"+this.wobblerNumber) == "" ? false : true;
        this.showACV = this.calcService.getValue("tlOutputACVScen"+this.wobblerNumber) == "" ? false : true;
        this.showBudgetDelta = this.calcService.getValue("tlOutputBudgetScen"+this.wobblerNumber) == "" ? false : true;
    }

    toggleTab(){
        this.isOpen = this.isOpen? false : true;
    }

}