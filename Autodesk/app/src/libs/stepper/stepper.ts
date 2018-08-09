import {Observable} from 'rxjs/Observable';
import { OnDestroy } from '@angular/core';
export class Stepper implements OnDestroy{
    private stepperNeg:any;
    private stepperPos:any;
    private amount: number = 0;
    private min: number;
    private max: number;
    private stepper:any;
    private timeoutDelay: number;
    private timeout: any;

    bindStepper(stepper: any, opts?:any) {
        let self = this,onchange = (opts) ? opts.onchange : function() {};
        // Bind field
        stepper.field.addEventListener('input', this.checkValidity.bind(this, stepper));
        // Bind buttons
        // this.stepperNeg = Observable.fromEvent(stepper.buttons.neg, 'click').subscribe(() => {
        //     self.onClick(self.amount, stepper, onchange);
        // });
        // this.stepperPos = Observable.fromEvent(stepper.buttons.pos, 'click').subscribe(() => {
        //     self.onClick(self.amount, stepper, onchange);
        // });
        // stepper.buttons.neg.addEventListener('click', this.updateStepperCount.bind(this, -(this.getNum(stepper.field.step) || 1), stepper));
        // stepper.buttons.pos.addEventListener('click', this.updateStepperCount.bind(this, this.getNum(stepper.field.step) || 1, stepper));
        this.stepper = stepper;
        this.stepper.onchange = onchange;
        this.addEventListener(stepper.buttons.neg, 'mousedown', this.start.bind(this), [false]);
        this.addEventListener(stepper.buttons.neg, 'touchstart', this.start.bind(this), [false]);
        this.addEventListener(stepper.buttons.neg, 'mouseup', this.stop.bind(this));
        this.addEventListener(stepper.buttons.neg, 'touchend', this.stop.bind(this));
        this.addEventListener(stepper.buttons.neg, 'mouseout', this.stop.bind(this));
        this.addEventListener(stepper.buttons.neg, 'touchleave', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'mousedown', this.start.bind(this), [true]);
        this.addEventListener(stepper.buttons.pos, 'touchstart', this.start.bind(this), [true]);
        this.addEventListener(stepper.buttons.pos, 'mouseup', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'touchend', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'mouseout', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'touchleave', this.stop.bind(this));
    }

    addEventListener(el:HTMLElement, event:string, listener:Function, parameters?:Array<any>, allowDefault?:boolean) {
        let boundListener = function(e) {
            if (!e) e = window.event;

            listener.apply(this, [e].concat(parameters));

            // prevent default action if necessary
            if (!allowDefault) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            }
        };

        if (el.addEventListener) {
            el.addEventListener(event, boundListener, false)
        }
    }

    handleKeyDown(e:KeyboardEvent): void {
        // if the up or down keys were pressed, start updating
        if (e.keyCode == 38) this.start(e, true);
        if (e.keyCode == 40) this.start(e, false);
    }

    handleKeyPress(e:KeyboardEvent) {

        // determine the character code
        var charCode = ('charCode' in e ? e.charCode : e.keyCode);

        // allow special key presses
        if (charCode == 0 || e.altKey || e.ctrlKey || e.metaKey) return;

        // allow a minus sign if the value can be negative
        if (charCode == 45 && (!(typeof this.min !== 'undefined') || this.min < 0)) {
            return;
        }

        // allow a decimal point if the value may contain decimals
        // if (charCode == 46 && this.options.decimals > 0) return;

        // allow digits
        if (charCode >= 48 && charCode <= 57) return;

        // prevent the default action
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    start(e: Event, up: boolean) {
        // if the field is disabled or we are already updating, return immediately
        if (this.stepper.field.disabled || 'timeout' in this) return;

        // set the update step
        let step = (up ? (this.getNum(this.stepper.field.step)) : -(this.getNum(this.stepper.field.step)));

        // initialise the timeout delay
        this.timeoutDelay = 500;

        // update value
        this.updateStepperCount(step, this.stepper);
    }

    stop() {
        // clear the timeout if it exists
        if ('timeout' in this) {
            window.clearTimeout(this.timeout);
            delete this.timeout;
        }
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

    private updateStepperCount(amount:number, stepper:any) {
        this.amount += Number(amount);
        this.onClick(this.amount, stepper);
        // reduce the delay
        this.timeoutDelay = Math.max(20, Math.floor(this.timeoutDelay * 0.9));

        // call this function again

        this.timeout =
            window.setTimeout(() => { this.updateStepperCount(amount, stepper); }, this.timeoutDelay); 
    }

    private onClick(amount:number, stepper:any, onChange?:Function) {
        if (typeof onChange == 'undefined') onChange = stepper.onchange;
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
