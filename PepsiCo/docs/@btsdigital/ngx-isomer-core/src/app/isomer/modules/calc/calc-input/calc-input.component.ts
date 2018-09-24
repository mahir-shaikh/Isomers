import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../../config/constants';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService } from '../../services/communicator/communicator.service';

/**
 * CalcInput component let's user set/update values in calc model
 *
 */
@Component({
  selector: 'ism-calc-input',
  templateUrl: './calc-input.component.html',
  styleUrls: ['./calc-input.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalcInputComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Value for range ref from calc-model
   */
  value: string|number;
  /**
   * Is input field read only
   */
  isReadOnly: Boolean;
  /**
   * Updated value on the input field that is not yet synced to model
   *
   */
  private dirtyValue: string|number;
  /**
   * Subscription for model change events.
   *
   */
  private subscription: Subscription;
  /**
   * Is input field dirty i.e. initial value is changed by user
   *
   */
  private isDirty: Boolean = false;
  /**
   * Input binding for range ref
   *
   */
  @Input() ref: string;
  /**
   * Input binding for year ref
   *
   */
  @Input() yearRef: string;
  /**
   * Input binding for number format
   *
   */
  @Input() format: string;
  /**
   * Input binding for scaler
   *
   */
  @Input() scaler: number;
  /**
   * Input binding for Type for input element
   */
  @Input() type = 'number';
  /**
   * Input binding for Step value for input element
   */
  @Input() step: number;
  /**
   * Input binding for Min value for input element
   *
   */
  @Input() min: number | string;
  /**
   * Input binding for Max value for input element
   *
   */
  @Input() max: number | string;
  /**
   * Input binding for rawValue flag
   *
   */
  @Input() rawValue: Boolean;
  /**
   * Input binding for readonly flag
   *
   */
  @Input() readOnly: Boolean;

  /**
   * Constructor for calc-input component
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {CommunicatorService} communicator CommunicatorService instance
   *
   * @param {NumberFormattingPipe} numberFormatter NumberFormattingPipe instance
   *
   * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
   *
   */
  constructor(private calcService: CalcService, private communicator: CommunicatorService,
    private numberFormatter: NumberFormattingPipe, private cdRef: ChangeDetectorRef) { }

  /**
   * Initialize subscribers and component with value from calc model
   *
   */
  ngOnInit() {
    this.subscription = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE)
      .subscribe(() => {
        this.update();
        this.cdRef.markForCheck();
      });
    this.update();
  }

  /**
   * Update comonent when any input bindings are changed
   *
   */
  ngOnChanges() {
    this.update();
  }

  /**
   * Removes any subscribers when component instance is destroyed
   *
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Fetch updated value from calc model and set formatted value to component
   *
   */
  private update() {
    this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this
      .calcService.getValueForYear(this.min + '', this.yearRef, this.rawValue));
    this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this
      .calcService.getValueForYear(this.max + '', this.yearRef, this.rawValue));
    this.value = this.numberFormatter.transform(this.calcService.getValueForYear(this.ref, this.yearRef, this.rawValue), this.format);
  }

  /**
   * Saves updated value to calc model once onBlur event is triggered on input field
   *
   * @param {any} $event Blur event
   */
  saveDataToModel($event?: any) {
    if (typeof this.dirtyValue === 'undefined') {
      return;
    }

    if (Number(this.dirtyValue) < this.min) {
      this.dirtyValue = this.min;
    } else if (Number(this.dirtyValue) > this.max) {
      this.dirtyValue = this.max;
    }

    this.value = this.numberFormatter.transform(this.dirtyValue, this.format, this.scaler);

    // update model now that we have processed the input value
    let val: string|number;
    if (!this.format) {
      val = this.value;
    } else {
      val = this.numberFormatter.parse(this.numberFormatter.transform(this.dirtyValue, this.format, this.scaler));
    }
    if (this.isDirty) {
      this.calcService.setValueForYear(this.ref, val, this.yearRef);
    }
    this.isDirty = false;
  }

  /**
   * Change event listener when user changes the input value
   *
   */
  onModelChange(val: any) {
    if (val === '') {
      return;
    }
    if (this.value !== this.numberFormatter.transform(val, this.format, this.scaler)) {
      this.isDirty = true;
      this.dirtyValue = val;
    }
  }
}
