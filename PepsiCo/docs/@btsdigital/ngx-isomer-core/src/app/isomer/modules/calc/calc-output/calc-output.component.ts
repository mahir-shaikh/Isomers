import { Component, OnInit, OnChanges, OnDestroy, Input,
  ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CalcService } from '../calc.service';
import { Constants } from '../../../config/constants';
import { Subscription } from 'rxjs/Subscription';
import { CommunicatorService } from '../../services/communicator/communicator.service';

/**
 * CalcOutput component displays value from calc model for a given range ref.
 *
 */
@Component({
  selector: 'ism-calc-output',
  templateUrl: './calc-output.component.html',
  styleUrls: ['./calc-output.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalcOutputComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Value for range ref from calc-model
   */
  value: string;
  /**
   * CalcModel update subscription for listening to model changes
   *
   */
  private subscriber: Subscription;
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
   * Input binding for rawValue flag
   *
   */
  @Input() rawValue: Boolean = false;

  /**
   * Constructor for calc-output component
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {CommunicatorService} communicator CommunicatorService instance
   *
   * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
   *
   */
  constructor(private calcService: CalcService, private communicator: CommunicatorService, private cdRef: ChangeDetectorRef) { }

  /**
   * OnInit function
   *
   */
  ngOnInit() {
    this.subscriber = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE)
      .subscribe(() => {
        this.update();
      });

    this.update();
  }

  /**
   * Function to fetch updated value from calc model
   *
   */
  update() {
    const value: string = this.calcService.getValueForYear(this.ref, this.yearRef, this.rawValue);

    if (this.value !== value) {
      this.value = value;
      this.cdRef.markForCheck();
    }
  }

  /**
   * Update the value when any Input binding is changed
   *
   */
  ngOnChanges() {
    this.update();
  }

  /**
   * Destroy any subscription when component instance is destroyed
   *
   */
  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}
