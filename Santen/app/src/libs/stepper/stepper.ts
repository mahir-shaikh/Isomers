export class Stepper {
    bindStepper(stepper: any, opts?:any) {
        let onchange = (opts) ? opts.onchange : function() {};
        // Bind field
        stepper.field.addEventListener('input', this.checkValidity.bind(this, stepper));
        // Bind buttons
        stepper.buttons.neg.addEventListener('click', this.onClick.bind(this, -(this.getNum(stepper.field.step) || 1), stepper, onchange));
        stepper.buttons.pos.addEventListener('click', this.onClick.bind(this, this.getNum(stepper.field.step) || 1, stepper, onchange));
    }

    bindAll(opts?:any) {
        opts = opts || {};
        opts.classes = opts.classes || {};
        opts.context = opts.context || document;
        opts.onchange = opts.onchange || function() {};
        opts.validator = opts.validator || function() { return true; }; // do no validation

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

    private onClick(amount:number, stepper:any, onChange:Function) {
        if (amount === 0) return;
        if (!stepper.validator(amount)) return;
        if (!stepper.field.validity.valid || stepper.field.value === '') stepper.field.value = 0;

        if (amount < 0 && this.getNum(stepper.field.value) <= this.getNum(stepper.field.min) || amount > 0 && this.getNum(stepper.field.value) >= this.getNum(stepper.field.max)) return;

        stepper.field.value = this.getNum(stepper.field.value) + amount;
        this.checkValidity(stepper);
        onChange(stepper.field.value);
    };

    private checkValidity(stepper) {
        var VALUE = this.getNum(stepper.field.value);

        stepper.buttons.neg.disabled = (stepper.field.min == "" || stepper.field.min == "undefined") ? false : (VALUE <= this.getNum(stepper.field.min));
        stepper.buttons.pos.disabled = (stepper.field.max == "" || stepper.field.max == "undefined") ? false : (VALUE >= this.getNum(stepper.field.max));
    };
}
