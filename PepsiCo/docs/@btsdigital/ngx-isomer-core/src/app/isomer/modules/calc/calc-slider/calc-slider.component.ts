import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, Output, ViewChild } from '@angular/core';
import { CalcService } from '../calc.service';
import * as noUiSlider from 'nouislider';
import { NumberFormatting } from '../../../utils/number-formatting';

/**
 * Calc Slider component, allows the user to update inputs using a slider instead of a standard text input box
 *
 */
@Component({
  selector: 'ism-calc-slider',
  templateUrl: './calc-slider.component.html',
  styleUrls: ['./calc-slider.component.styl']
})
export class CalcSliderComponent implements OnInit {
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
   * Input binding for Step value for input element
   */
  @Input() step: number;
  /**
   * Input binding for Min value for input element
   *
   */
  @Input() min: number = 0;
  /**
   * Input binding for Max value for input element
   *
   */
  @Input() max: number = 9999999999999999;
  /**
   * Input binding flag to show / hide slider buttons
   *
   */
  @Input() showButtons: boolean = false;
  /**
   * Input binding flag to show / hide slider buttons
   *
   */
  @Input() format: string;
  /**
   * Input binding flag to show / hide slider buttons
   *
   */
  @Input() scaler: number = 1;
  /**
   * Value for range ref from calc-model
   */
  private value: string | number;
  /**
   * Updated value on the input field that is not yet synced to model
   *
   */
  private tempValue: string;
  /**
   * Year value from model
   *
   */
  private year: string;
  /**
   * Flag value to check whether slider value was changed from initial value
   *
   */
  private isDirty: boolean = false;
  /**
   * Html element where the slider needs to be rendered
   *
   */
  @ViewChild('calcSliderEl') elRef: any;

  /**
   * Constructor for calc-slider component
   *
   * @param {CalcService} calcService CalcService instance
   *
   */
  constructor(private calcService: CalcService) { }

  /**
   * OnInit lifecycle function to instantiate component
   *
   */
  ngOnInit() {
    this.value = this.calcService.getValueForYear(this.ref, this.yearRef);
    this.value = NumberFormatting.unformat(this.value);
    const slider = this.elRef.nativeElement,
      opt: noUiSlider.Options = {
        start: [Number(this.value) || Number(this.min)],
        range: {
            'min': Number(this.min),
            'max': Number(this.max)
        },
        step: (this.step) ? Number(this.step) : undefined,
        pips: {
            mode: 'steps',
            density: 1
        },
        behaviour: 'tap',
        format: {
          to: (value) => {
            return NumberFormatting.format(value, this.format, this.scaler);
          },
          from: (value) => {
            return NumberFormatting.unformat(value, this.scaler);
          }
        }
    };

    noUiSlider.create(slider, opt);
    this.bindEvents(slider);

  }

  /**
   * Function to bind events to slider
   *
   * @param {any} slider Slider element reference
   */
  private bindEvents(slider: any) {
    if (slider && slider.noUiSlider) {
      slider.noUiSlider.on('set', () => {
        const curVal = slider.noUiSlider.get();
        this.saveDataToModel(curVal);
      });
    }
  }

  /**
   * Function to save component value back to model
   *
   * @param {any} value Value to be saved to model
   */
  private saveDataToModel(val: any) {
    this.calcService.setValueForYear(this.ref, val, this.yearRef);
  }
}
