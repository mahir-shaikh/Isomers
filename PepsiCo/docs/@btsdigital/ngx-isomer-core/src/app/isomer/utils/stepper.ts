/**
 * Stepper utility adds event listeners for mouse/touch and returns the new value to CalcStepper component to display
 *
 */
export class Stepper {
    /**
     * Value to be added/subtracted to the CalcStepper value
     *
     */
    amount: number = 0;
    /**
     * Minimum value that the CalcStepper can have
     *
     */
    min: number;
    /**
     * Maximum value that the CalcStepper can have
     *
     */
    max: number;
    /**
     * Object which has the reference to CalcStepper buttons, input fields and validator
     *
     */
    stepper: any;
    /**
     * Reference to setTimeout function
     *
     */
    timeout: any;

    /**
     * bindStepper function binds the event listeners to CalcStepper buttons and input field
     *
     * @param {any} stepper stepper Object
     *
     * @param {number} [opts] optional options for stepper object
     */
    bindStepper(stepper: any, opts?: any) {
        const onchange = (opts) ? opts.onchange : function () { };
        // Bind field
        stepper.field.addEventListener('input', this.checkValidity.bind(this, stepper));

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

    /**
     * addEventListener function binds the custom event listener to HTML elements
     *
     * @param {HTMLElement} el HTMLElement to bind event listener
     *
     * @param {string} event listener event
     *
     * @param {Function} listener Function to call when an event is fired
     *
     * @param {Array<any>} [parameters] optional parameters to apply to the event listener
     *
     * @param {boolean} [allowDefault] optional parameter to allow/prevent the default action when an event fires
     *
     */
    addEventListener(el: HTMLElement, event: string, listener: Function, parameters?: Array<any>, allowDefault?: boolean) {
        const boundListener = function (e) {
            if (!e) {
                e = window.event;
            }

            listener.apply(this, [e].concat(parameters));

            // prevent default action if necessary
            if (!allowDefault) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        };

        if (el.addEventListener) {
            el.addEventListener(event, boundListener, false);
        }
    }

    /**
     * start function keeps the event alive until the user input is done
     *
     * @param {Event} e Event that is fired
     *
     * @param {boolean} increment Increments/Decrements the CalcStepper value by the defined step amount
     *
     */
    start(e: Event, increment: boolean) {
        // if the field is disabled or we are already updating, return immediately
        if (this.stepper.field.disabled || this.timeout !== undefined) { return; }

        // set the update step
        const step = (increment ? (this.getNum(this.stepper.field.step)) : -(this.getNum(this.stepper.field.step)));

        // update value
        this.updateStepperCount(step, this.stepper);
    }

    /**
     * stop function clears the timeout if any
     *
     */
    stop() {
        // clear the timeout if it exists
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }

    /**
     * bindAll function initializes the stepper object and then binds event listeners to the HTML elements
     *
     * @param {any} [opts] Optional options that applies to the stepper object
     *
     */
    bindAll(opts?: any) {
        opts = opts || {};
        opts.classes = opts.classes || {};
        opts.context = opts.context || document;
        opts.onchange = opts.onchange || function () { };
        opts.validator = opts.validator || function () { return true; }; // do no validation
        this.min = opts.min;
        this.max = opts.max;

        const $steppers = opts.context.getElementsByClassName(opts.stepper || 'stepper');

        for (let i = 0; i < $steppers.length; i++) {
            const stepper = {
                buttons: {
                    pos: $steppers[i].getElementsByClassName(opts.classes.add || 'add')[0],
                    neg: $steppers[i].getElementsByClassName(opts.classes.subtract || 'subtract')[0]
                },
                field: $steppers[i].getElementsByClassName(opts.classes.field || 'field')[0],
                validator: opts.validator
            };

            if (stepper.field && stepper.field['disabled']) { return; } // Don't bind on disabled fields.
            this.bindStepper(stepper, opts);

            // Don't forget to Enable/Disable buttons based on the inital value
            this.checkValidity(stepper);
        }
        return this;
    }

    /**
     * getNum function converts string to number
     *
     * @param {string} str String to be converted to number
     *
     */
    private getNum(str: string) {
        return Number(str);
    }

    /**
     * updateStepperCount function adds/subtracts the step amount and then calls onClick function
     *
     * @param {number} amount step amount to be added/subtracted
     *
     * @param {any} stepper stepper object
     *
     */
    private updateStepperCount(amount: number, stepper: any) {
        this.amount += Number(amount);
        this.onClick(this.amount, stepper);
        this.timeout = setTimeout(() => { this.updateStepperCount(amount, stepper); }, 500);
    }

    /**
     * onClick function validates the input value againstmin/max and returns the correct value to CalcStepper component
     *
     * @param {number} amount step amount to be added/subtracted
     *
     * @param {any} stepper stepper object
     *
     * @param {Function} [onChange] Function that returns the updated value
     *
     */
    private onClick(amount: number, stepper: any, onChange?: Function) {
        if (typeof onChange === 'undefined') { onChange = stepper.onchange; }
        if (amount === 0) { return; }
        if (!stepper.validator(amount)) {
            if (amount < 0) {
                amount = this.min;
            } else {
                amount = this.max;
            }
            stepper.field.value = '' + amount;
            this.amount = 0;
            onChange(stepper.field.value);
            return;
        }
        if (!stepper.field.validity.valid || stepper.field.value === '') { stepper.field.value = 0; }

        if (amount < 0 && this.getNum(stepper.field.value) <= this.getNum(stepper.field.min) || amount > 0 && this.getNum(stepper.field.value) >= this.getNum(stepper.field.max)) {

            if (amount < 0) {
                amount = this.min;
            } else {
                amount = this.max;
            }
            stepper.field.value = '' + amount;
            this.amount = 0;
            onChange(stepper.field.value);
            return;
        }

        stepper.field.value = this.getNum(stepper.field.value) + amount;
        this.amount = 0;
        this.checkValidity(stepper);
        onChange(stepper.field.value);
    }

    /**
     * checkValidity function enables/disables the stepper buttons based on min/max values
     *
     * @param {any} stepper stepper object
     *
     */
    private checkValidity(stepper: any) {
        const VALUE = this.getNum(stepper.field.value);

        stepper.buttons.neg.disabled = (stepper.field.min === '' || stepper.field.min === 'undefined') ? false : (VALUE <= this.getNum(stepper.field.min));
        stepper.buttons.pos.disabled = (stepper.field.max === '' || stepper.field.max === 'undefined') ? false : (VALUE >= this.getNum(stepper.field.max));
    }

    /**
     * updateMinMax function sets the new min/max value
     *
     * @param {any} newMin new min value to set
     *
     * @param {any} newMax new max value to set
     *
     */
    updateMinMax(newMin: any, newMax: any) {
        this.min = newMin;
        this.max = newMax;
    }
}
