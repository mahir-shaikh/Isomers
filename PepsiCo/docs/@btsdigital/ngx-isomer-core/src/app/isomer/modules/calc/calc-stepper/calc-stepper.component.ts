import { Component, Input, OnInit, OnDestroy, OnChanges, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { Constants } from '../../../config/constants';
import { Subscription } from 'rxjs/Subscription';
import { Stepper } from '../../../utils/stepper';

/**
 * CalcStepper component allows to make inputs to the calc model using an input and buttons to increment and decrement.
 *
 */
@Component({
  selector: 'ism-calc-stepper',
  templateUrl: './calc-stepper.component.html',
  styleUrls: ['./calc-stepper.component.styl']
})
export class CalcStepperComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Input binding for range ref
   *
   */
  @Input() ref: string = '';
  /**
   * Input binding for year ref
   *
   */
  @Input() yearRef: string;
  /**
   * Input binding to Format value
   *
   */
  @Input() format: string = '';
  /**
   * Input binding for inputFormat
   *
   */
  @Input() inputFormat: string = '';
  /**
   * Input binding for Scaler
   *
   */
  @Input() scaler: number = 1;
  /**
   * Input binding for Step value for input element
   *
   */
  @Input() step: number = 1;
  /**
   * Input binding for Min value for input element
   *
   */
  @Input() min: number;
  /**
   * Input binding for Max value for input element
   *
   */
  @Input() max: number;
  /**
   * Input binding for inRef
   *
   */
  @Input() inRef: string = '';
  /**
   * Input binding for outRef
   *
   */
  @Input() outRef: string = '';
  /**
   * Input binding for inputScaler
   *
   */
  @Input() inputScaler: number;
  /**
   * Input binding for outputMin
   *
   */
  @Input() outputMin: number;
  /**
   * Input binding for outputMax
   *
   */
  @Input() outputMax: number;
  /**
   * Html element reference of the input field
   *
   */
  @ViewChild('inputValue') inputValueRef;
  /**
   * Value for range ref from calc-model
   *
   */
  value: string | number;
  /**
   * Flag to check if the input has focused
   *
   */
  isFocused: boolean = false;
  /**
   * Updated value on the input field that is not yet synced to model
   *
   */
  private dirtyValue: string;
  /**
   * Context of current HTMLElement
   *
   */
  private el: HTMLElement;
  /**
   * Subscription for model change events.
   *
   */
  private subscription: Subscription;

  /**
   *
   * Function will listen to the keyup event of enter key and update the value in model
   */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.isFocused) {
      // Enter Key
      if (ev.keyCode === 13) {
        this.saveDataToModel(this.dirtyValue);
      }
    }
  }

  /**
   * Constructor for calc-stepper component
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {numberFormatter} numberFormatter NumberFormattingPipe instance
   *
   * @param {elRef} elRef ElementRef instance
   *
   */
  constructor(private calcService: CalcService, private numberFormatter: NumberFormattingPipe, private elRef: ElementRef, private communicator: CommunicatorService) { }

  /**
   * OnInit lifecycle function to instantiate component
   *
   */
  ngOnInit() {
    this.el = this.elRef.nativeElement;
    this.outRef = (this.outRef) ? this.outRef : this.ref;
    this.inRef = (this.inRef) ? this.inRef : this.ref;
    this.inputFormat = (this.inputFormat) ? this.inputFormat : this.format;
    this.inputScaler = (this.inputScaler) ? this.inputScaler : this.scaler;
    this.min = (this.min) ? this.min : this.outputMin;
    this.max = (this.max) ? this.max : this.outputMax;
    let modelVal = null;
    if (this.outRef === this.inRef) {
      modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
    } else {
      modelVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
    }

    if (this.format === '0%') {
      this.value = '' + Math.round(this.numberFormatter.parse(modelVal, this.inputScaler) as any);
    } else if (this.format === '0.0%') {
      this.value = '' + parseFloat(this.numberFormatter.parse(modelVal, this.inputScaler) as any).toFixed(1);
    } else if (this.format === '0.00%') {
      this.value = '' + parseFloat(this.numberFormatter.parse(modelVal, this.inputScaler) as any).toFixed(2);
    } else {
      this.value = this.numberFormatter.parse(modelVal, this.inputScaler) + '';
    }

    this.subscription = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(() => {
      this.onModelChange();
    });

  }

  /**
   * AfterViewInit lifecycle function to bind the input and buttons with eventListeners
   *
   */
  ngAfterViewInit() {
    new Stepper().bindAll({ context: this.el, onchange: this.onStepperButtonClick.bind(this), validator: this.getValidator(), max: this.outputMax, min: this.outputMin });
  }

  /**
   * OnChanges lifecycle function to process and save the updated value to the model
   *
   */
  ngOnChanges() {
    this.onModelChange();
  }

  /**
   *
   * OnChanges lifecycle function to process and save the updated value to model
   *
   * @param {value} value Updated value
   *
   */
  onValueChange(value) {
    if (value === '') {
      value = '0';
    }
    this.dirtyValue = value;
  }

  /**
   *
   * Function to format the updated value and save to model
   *
   * @param {value} value Updated value
   *
   */
  onStepperButtonClick(value) {

    if (!this.isFocused) {
      this.inputValueRef.nativeElement.focus();
      this.onFocus();
      return;
    }

    if (this.format === '0%') {
      value = '' + Math.round(value);
    } else if (this.format === '0.0%') {
      value = '' + parseFloat(value).toFixed(1);
    } else if (this.format === '0.00%') {
      value = '' + parseFloat(value).toFixed(2);
    }

    if (this.value !== value) {
      this.value = value;
      let modelValue = this.numberFormatter.parse(this.numberFormatter.transform(value, this.inputFormat, this.inputScaler));
      modelValue = modelValue.toString().split('$').join('');
      this.calcService.setValueForYear(this.inRef, modelValue, this.yearRef);
    }
  }

  /**
   * Function to format and display the updated value
   *
   */
  onModelChange() {
    let modelVal = null;
    if (this.outRef === this.inRef) {
      modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
    } else {
      modelVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
    }

    if (this.format === '0%' || this.format === '0.0%' || this.format === '0.00%') {
      this.value = '' + (this.numberFormatter.parse(modelVal, this.inputScaler));
    } else {
      this.value = this.numberFormatter.parse(modelVal, this.inputScaler) + '';
    }
  }

  /**
   * Function to check if stepping down doesn't goes out of bounds
   *
   */
  validator(amount) {
    const outVal = this.calcService.getValueForYear(this.outRef, this.yearRef, true) as any;
    amount = this.numberFormatter.parse(this.numberFormatter.transform(amount, this.inputFormat, this.inputScaler));

    // check if stepping down goes out of bounds
    if (this.outputMin !== undefined && amount < 0) {
      if ((outVal + amount) < Number(this.outputMin)) {
        return false;
      }
    } else if (this.outputMax !== undefined && amount > 0) {
      if ((outVal + amount) > Number(this.outputMax)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Function to pass the amount to Stepper Class
   *
   */
  getValidator() {
    const self = this;
    return function (amount) {
      return self.validator(amount);
    };
  }

  /**
   * Function to check if the new value is not out of bounds and then call onStepperButtonClick function
   *
   * @param {enteredValue} enteredValue Value entered in input box
   *
   */
  saveDataToModel(enteredValue) {
    if (enteredValue >= Number(this.outputMin) && enteredValue <= Number(this.outputMax)) {
      this.onStepperButtonClick(enteredValue);
    } else if (enteredValue < Number(this.outputMin)) {
      this.onStepperButtonClick(Number(this.outputMin));
    } else if (enteredValue > Number(this.outputMax)) {
      this.onStepperButtonClick(Number(this.outputMax));
    } else {
      this.onStepperButtonClick(enteredValue);
    }
  }

  /**
   * Function to set isFocused flag true when input box gains focus
   *
   */
  onFocus() {
    this.isFocused = true;
  }

  /**
   * Function to save the updated value to model when the input loses focus
   *
   */
  onBlur(enteredValue) {
    if (enteredValue === '') {
      enteredValue = '0';
    }
    if (enteredValue !== this.value) {
      this.saveDataToModel(enteredValue);
    }
    this.isFocused = false;
  }

  /**
   * Function to set focus on input when the user clicks on the value
   *
   */
  setFocusOnInput() {
    this.inputValueRef.nativeElement.focus();
    this.onFocus();
  }

  /**
   * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
   *
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
