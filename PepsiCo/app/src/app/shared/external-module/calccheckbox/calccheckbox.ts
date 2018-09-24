import { Component, Input, OnInit, OnDestroy } from '@angular/core';
// import { CalcService } from '../calc.service';
import { CalcService } from '@btsdigital/ngx-isomer-core';


@Component({
    selector: 'isma-calc-checkbox',
    templateUrl: './calccheckbox.html',
    styleUrls: ['./calccheckbox.styl'],
    providers: []
})

export class CalcCheckboxComponent implements OnInit, OnDestroy {
    @Input() ref: string = '';
    @Input() type: string = 'checkbox';
    value: boolean;
    private tempValue: boolean = false;
    private isDirty: boolean = false;
    private subscription: any;

    constructor(private calcService: CalcService) { }

    ngOnInit() {
        // this.value = this.calcService.getValueForYear(this.ref, this.yearRef);
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });
        this.onModelChange();
    }

    saveDataToModel() {
        let value: boolean;
        value = this.tempValue;
        this.calcService.setValue(this.ref, value);
        this.value = this.calcService.getValue(this.ref) as any;
    }

    toggleValue() {
        this.tempValue = !this.value;
        this.saveDataToModel();
    }

    onModelChange() {
        this.value = this.calcService.getValue(this.ref) as any;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
