/**
 * Stepper utility adds event listeners for mouse/touch and returns the new value to CalcStepper component to display
 *
 */
export declare class Stepper {
    /**
     * Value to be added/subtracted to the CalcStepper value
     *
     */
    amount: number;
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
    bindStepper(stepper: any, opts?: any): void;
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
    addEventListener(el: HTMLElement, event: string, listener: Function, parameters?: Array<any>, allowDefault?: boolean): void;
    /**
     * start function keeps the event alive until the user input is done
     *
     * @param {Event} e Event that is fired
     *
     * @param {boolean} increment Increments/Decrements the CalcStepper value by the defined step amount
     *
     */
    start(e: Event, increment: boolean): void;
    /**
     * stop function clears the timeout if any
     *
     */
    stop(): void;
    /**
     * bindAll function initializes the stepper object and then binds event listeners to the HTML elements
     *
     * @param {any} [opts] Optional options that applies to the stepper object
     *
     */
    bindAll(opts?: any): this;
    /**
     * getNum function converts string to number
     *
     * @param {string} str String to be converted to number
     *
     */
    private getNum(str);
    /**
     * updateStepperCount function adds/subtracts the step amount and then calls onClick function
     *
     * @param {number} amount step amount to be added/subtracted
     *
     * @param {any} stepper stepper object
     *
     */
    private updateStepperCount(amount, stepper);
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
    private onClick(amount, stepper, onChange?);
    /**
     * checkValidity function enables/disables the stepper buttons based on min/max values
     *
     * @param {any} stepper stepper object
     *
     */
    private checkValidity(stepper);
    /**
     * updateMinMax function sets the new min/max value
     *
     * @param {any} newMin new min value to set
     *
     * @param {any} newMax new max value to set
     *
     */
    updateMinMax(newMin: any, newMax: any): void;
}
