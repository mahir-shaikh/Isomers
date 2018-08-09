import {Observable} from 'rxjs/Observable';
import { OnDestroy } from '@angular/core';
export class Stepper implements OnDestroy{
    private stepperNeg:any;
    private stepperPos:any;
    private amount: number = 0;
    private min: number;
    private max: number;
    bindStepper(stepper: any, opts?:any) {
        let self = this,onchange = (opts) ? opts.onchange : function() {};
        // Bind field
        stepper.field.addEventListener('input', this.checkValidity.bind(this, stepper));
        // Bind buttons
        this.stepperNeg = Observable.fromEvent(stepper.buttons.neg, 'click').auditTime(1000).subscribe(() => {
            self.onClick(self.amount, stepper, onchange);
        });
        this.stepperPos = Observable.fromEvent(stepper.buttons.pos, 'click').auditTime(1000).subscribe(() => {
            self.onClick(self.amount, stepper, onchange);
        });
        stepper.buttons.neg.addEventListener('click', this.updateStepperCount.bind(this, -(this.getNum(stepper.field.step) || 1), stepper));
        stepper.buttons.pos.addEventListener('click', this.updateStepperCount.bind(this, this.getNum(stepper.field.step) || 1, stepper));
    }

    bindAll(opts?:any) {
        opts = opts || {};
        opts.classes = opts.classes || {};
        opts.context = opts.context || document;
        opts.onchange = opts.onchange || function() {};
        opts.validator = opts.validator || function() { return true; }; // do no validation
        this.min = opts.min;
        this.max = opts.max;

        var $steppers = opts.context.getElementsByClassName(opts.stepper || 'stepper');

        for (var i = 0; i < $steppers.length; i++) {
            var stepper = {
                buttons: {
                    pos: $steppers[i].getElementsByClassName(opts.classes.add || 'add')[0],
                    neg: $steppers[i].getElementsByClassName(opts.classes.subtract || 'subtract')[0]
                },
                field: $steppers[i].getElementsByClassName(opts.classes.field || 'field')[0],
                validator: opts.validator
            };

            if (stepper.field && stepper.field['disabled']) return; // Don't bind on disabled fields.
            this.bindStepper(stepper, opts);

            // Don't forget to Enable/Disable buttons based on the inital value
            this.checkValidity(stepper);
        }
    };

    private getNum(str:string) {
        return Number(str);
    };

    updateStepperCount(amount:number, stepper:any){
        this.amount += Number(amount); 
    }

    private onClick(amount:number, stepper:any, onChange:Function) {
        if (amount === 0) return;
        if (!stepper.validator(amount)){
            if(amount < 0){
                amount = this.min;
            }else{
                amount = this.max;
            }
            stepper.field.value = "" + amount;
            this.amount = 0;
            onChange(stepper.field.value);
            return;
        }
        if (!stepper.field.validity.valid || stepper.field.value === '') stepper.field.value = 0;

        if (amount < 0 && this.getNum(stepper.field.value) <= this.getNum(stepper.field.min) || amount > 0 && this.getNum(stepper.field.value) >= this.getNum(stepper.field.max)){
            
            if(amount < 0){
                amount = this.min;
            }else{
                amount = this.max;
            }
            stepper.field.value = "" + amount;
            this.amount = 0;
            onChange(stepper.field.value);
            return;
        }

        stepper.field.value = this.getNum(stepper.field.value) + amount;
        this.amount = 0;
        this.checkValidity(stepper);
        onChange(stepper.field.value);
    };

    private checkValidity(stepper) {
        var VALUE = this.getNum(stepper.field.value);

        stepper.buttons.neg.disabled = (stepper.field.min == "" || stepper.field.min == "undefined") ? false : (VALUE <= this.getNum(stepper.field.min));
        stepper.buttons.pos.disabled = (stepper.field.max == "" || stepper.field.max == "undefined") ? false : (VALUE >= this.getNum(stepper.field.max));
    };

    ngOnDestroy(){
        this.stepperNeg.unsubscribe();
        this.stepperPos.unsubscribe();
    }
}
