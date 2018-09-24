import { OnInit, OnDestroy, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { CalcService } from '../calc.service';
import { TextService } from '../../text-engine/text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
/**
 * Calcdropdown component allows to make inputs to the calc model using a dropdown box.
 * Dropdown box is rendered using dropdown directive provided by ngx-bootstrap & bootstrap v4
 *
 */
export declare class CalcDropdownComponent implements OnInit, OnDestroy, OnChanges {
    private calcService;
    private textService;
    private numberFormatting;
    private communicator;
    /**
     * To enable disable the dropdown
     */
    disabled: boolean;
    /**
     * Internal flag to check if dropdown component is initialized
     *
     */
    private initFinished;
    /**
     * Currently selected item string for the dropdown box
     *
     */
    private selectedItem;
    /**
     * Subscription object for listening to calc model updates
     *
     */
    private observer;
    /**
     * Items to be populated in the droplist
     *
     */
    private _items;
    /**
     * Items array to be added to the droplist after checking if they are tokens for text service.
     *
     */
    items: Array<string>;
    /**
     * Input binding for range ref
     *
     */
    ref: string;
    /**
     * Input binding for year ref
     *
     */
    yearRef: string;
    /**
     * Input binding for placeholder text
     *
     */
    placeHolder: string;
    /**
     * Input binding for number format
     *
     */
    format: string;
    /**
     * Input binding for scaler
     *
     */
    scaler: number;
    /**
     * Input binding to set a recheck flag. If set to true, the items list will be checked
     * to validate if the currently selected item is still a part of (updated) items list.
     *
     */
    recheck: boolean;
    /**
     * Event emitter to emit droplist change event
     *
     */
    onChange: EventEmitter<any>;
    /**
     * Event emitter to emit droplist select event
     *
     */
    onSelect: EventEmitter<any>;
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
    constructor(calcService: CalcService, textService: TextService, numberFormatting: NumberFormattingPipe, communicator: CommunicatorService);
    /**
     * Initialize subscribers and component with value from calc model
     *
     */
    ngOnInit(): void;
    /**
     * Function to fetch updated value from calc model, and set it as selected item
     *
     */
    onModelUpdate(): void;
    /**
     * Get currently selected item on the dropdown
     *
     */
    getSelectedItem(): string;
    /**
     * Handler function when a new item is selected on the droplist
     *
     * @param {string} $item New item selected on the droplist
     */
    dropdownChanged($item: string): void;
    /**
     * Function to check if the currently selected item is still a part of the items array.
     * If not, then select the first item on the droplist instead.
     *
     */
    recheckItems(): void;
    /**
     * Process items and check if they are a token for the textService. After processing populate the items array to add to droplist.
     *
     */
    processItems(): void;
    /**
     * OnChange lifecycle function for component. This checks if the items array is updated and updates component accordingly
     *
     * @param {SimpleChanges} changes SimpleChanges object that contains any Input properties that were updated
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
     *
     */
    ngOnDestroy(): void;
}
