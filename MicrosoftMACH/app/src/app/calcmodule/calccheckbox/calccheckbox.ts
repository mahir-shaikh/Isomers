import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../calc.service';


@Component({
    selector: 'calc-checkbox',
    templateUrl: './calccheckbox.html',
    styleUrls: ['./calccheckbox.styl'],
    providers: []
})

export class CalcCheckbox implements OnInit, OnDestroy {
    @Input() ref: string = "";
    @Input() type: string = "checkbox";
    private value: boolean;
    private tempValue: boolean = false;
    private isDirty: boolean = false;
    private subscription: any;

    constructor(private calcService: CalcService) { };

    ngOnInit() {
        //this.value = this.calcService.getValueForYear(this.ref, this.yearRef);
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();            
        });
        this.onModelChange();
    }

    saveDataToModel() {
        let value: boolean;
        value = this.tempValue;        
        this.calcService.setValue(this.ref, value);
        this.value = this.calcService.getValue(this.ref);        
    }

    toggleValue() {
        this.tempValue = !this.value;
        this.saveDataToModel();
    }

    onModelChange(){
        this.value = this.calcService.getValue(this.ref);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}