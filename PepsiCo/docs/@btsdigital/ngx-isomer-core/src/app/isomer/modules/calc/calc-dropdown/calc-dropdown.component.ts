import {
  Component, OnInit, OnDestroy, OnChanges, EventEmitter,
  SimpleChanges, SimpleChange, Input, Output
} from '@angular/core';
import { CalcService } from '../calc.service';
import { TextService } from '../../text-engine/text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { Constants } from '../../../config/constants';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { Subscription } from 'rxjs/Subscription';

/**
 * Calcdropdown component allows to make inputs to the calc model using a dropdown box.
 * Dropdown box is rendered using dropdown directive provided by ngx-bootstrap & bootstrap v4
 *
 */
@Component({
  selector: 'ism-calc-dropdown',
  templateUrl: './calc-dropdown.component.html',
  styleUrls: ['./calc-dropdown.component.styl']
})
export class CalcDropdownComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * To enable disable the dropdown
   */
  public disabled: boolean = false;
  // private status: { isOpen: boolean} = { isOpen : false };
  /**
   * Internal flag to check if dropdown component is initialized
   *
   */
  private initFinished: boolean = false;
  /**
   * Currently selected item string for the dropdown box
   *
   */
  private selectedItem: string;
  /**
   * Subscription object for listening to calc model updates
   *
   */
  private observer: Subscription = null;
  /**
   * Items to be populated in the droplist
   *
   */
  private _items: Array<string> = [];

  /**
   * Items array to be added to the droplist after checking if they are tokens for text service.
   *
   */
  @Input() items: Array<string>;
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
   * Input binding for placeholder text
   *
   */
  @Input() placeHolder: string;
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
   * Input binding to set a recheck flag. If set to true, the items list will be checked
   * to validate if the currently selected item is still a part of (updated) items list.
   *
   */
  @Input() recheck: boolean = false;
  /**
   * Event emitter to emit droplist change event
   *
   */
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Event emitter to emit droplist select event
   *
   */
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Constructor for component
   *
   * @param {CalcService} calcService Instance of CalcService
   *
   * @param {TextService} textService Instance of TextService
   *
   * @param {TextService} textService Instance of TextService
   *
   * @param {NumberFormattingPipe} numberFormatting Instance of NumberFormattingPipe
   *
   * @param {CommunicatorService} communicator Instance of CommunicatorService
   *
   */
  constructor(private calcService: CalcService, private textService: TextService,
    private numberFormatting: NumberFormattingPipe, private communicator: CommunicatorService) { }

  /**
   * Initialize subscribers and component with value from calc model
   *
   */
  ngOnInit() {
    this.observer = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(() => {
      this.onModelUpdate();
    });
    this.onModelUpdate();
    this.initFinished = true;
  }

  /**
   * Function to fetch updated value from calc model, and set it as selected item
   *
   */
  onModelUpdate() {
    let modelVal: string | number;
    modelVal = this.numberFormatting.transform(this.calcService.getValueForYear(this.ref, this.yearRef, true), this.format, this.scaler);
    this.processItems();
    this.selectedItem = (modelVal.toString().length > 0) ? modelVal + '' : this.placeHolder;
  }

  /**
   * Get currently selected item on the dropdown
   *
   */
  getSelectedItem(): string {
    return this.selectedItem;
  }

  /**
   * Handler function when a new item is selected on the droplist
   *
   * @param {string} $item New item selected on the droplist
   */
  dropdownChanged($item: string): void {
    // const self = this;
    let value: string | number;
    this.selectedItem = $item;

    this.onSelect.emit();
    // only parse value if num format is provided
    if (this.format) {
      value = this.numberFormatting.parse(this.numberFormatting.transform($item, this.format, this.scaler), this.scaler);
    }
    this.calcService.setValueForYear(this.ref, value, this.yearRef).then(() => {
      this.onChange.emit($item);
    });
  }

  /**
   * Function to check if the currently selected item is still a part of the items array.
   * If not, then select the first item on the droplist instead.
   *
   */
  recheckItems() {
    if (this.recheck && this.items.indexOf(this.selectedItem) === -1) {
      this.dropdownChanged(this.items[0].toString());
    }
  }

  /**
   * Process items and check if they are a token for the textService. After processing populate the items array to add to droplist.
   *
   */
  processItems() {
    const items = this.items;
    this._items = [];
    if (items && items.length) {
      items.forEach((val: string, index) => {
        const itemName: string = this.textService.getText(val) || val;
        if (itemName) {
          this._items.push(itemName);
        }
      });
    }
  }

  /**
   * OnChange lifecycle function for component. This checks if the items array is updated and updates component accordingly
   *
   * @param {SimpleChanges} changes SimpleChanges object that contains any Input properties that were updated
   */
  ngOnChanges(changes: SimpleChanges) {
    this.processItems();

    if (this.recheck && this.initFinished) {
      let flag: boolean = false;
      if (changes['items'].currentValue.length !== changes['items'].previousValue.length) {
        flag = true;
      } else {
        for (let i = 0, len = changes['items'].currentValue.length; i < len; i++) {
          if (changes['items'].currentValue[i] !== changes['items'].previousValue[i]) {
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        this.recheckItems();
      }
    }
  }

  /**
   * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
   *
   */
  ngOnDestroy() {
    this.observer.unsubscribe();
  }
}
