import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CalcService } from '../calc.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { Constants } from '../../../config/constants';

/**
 * CalcCheckbox component allows to make inputs to the calc model using a checkbox.
 *
 */
@Component({
  selector: 'ism-calc-checkbox',
  templateUrl: './calc-checkbox.component.html',
  styleUrls: ['./calc-checkbox.component.styl']
})
export class CalcCheckboxComponent implements OnInit, OnDestroy {
  /**
   * Value for range ref from calc-model
   */
  value: boolean;
  /**
   * Updated value on the input field that is not yet synced to model
   */
  private dirtyValue: boolean = false;
  /**
   * Subscription for model change events
   */
  private subscription: Subscription;
  /**
   * Input binding for range ref
   */
  @Input() ref: string;
  /**
   * Input binding for year ref
   */
  @Input() yearRef: string;
  /**
   * Input binding for Type for input element
   */
  @Input() type = 'checkbox';

  /**
   * Constructor for calc-input component
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {CommunicatorService} communicator Instance of CommunicatorService
   */
  constructor(private calcService: CalcService, private communicator: CommunicatorService) { }

  /**
   * Initialize subscribers and component with value from calc model
   *
   */
  ngOnInit() {
    this.subscription = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(() => {
      this.onModelUpdate();
    });
    this.onModelUpdate();
  }

  /**
   * Function to fetch updated value from calc model, and set it to value
   *
   */
  onModelUpdate() {
    this.value = this.calcService.getValueForYear(this.ref, this.yearRef) as any;
  }

  /**
   * Handler function when the checkbox is clicked
   *
   */
  toggleValue() {
    this.dirtyValue = !this.value;
    this.saveDataToModel();
  }

  /**
   * Saves updated value to calc model when the checkbox is clicked
   *
   */
  saveDataToModel() {
    let value: boolean;
    value = this.dirtyValue;
    this.calcService.setValueForYear(this.ref, value, this.yearRef);

    this.value = this.calcService.getValueForYear(this.ref, this.yearRef) as any;
  }

  /**
   * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
   *
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
