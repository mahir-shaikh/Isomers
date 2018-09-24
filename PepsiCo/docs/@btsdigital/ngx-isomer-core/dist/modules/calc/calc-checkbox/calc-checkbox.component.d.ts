import { OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../calc.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
/**
 * CalcCheckbox component allows to make inputs to the calc model using a checkbox.
 *
 */
export declare class CalcCheckboxComponent implements OnInit, OnDestroy {
    private calcService;
    private communicator;
    /**
     * Value for range ref from calc-model
     */
    value: boolean;
    /**
     * Updated value on the input field that is not yet synced to model
     */
    private dirtyValue;
    /**
     * Subscription for model change events
     */
    private subscription;
    /**
     * Input binding for range ref
     */
    ref: string;
    /**
     * Input binding for year ref
     */
    yearRef: string;
    /**
     * Input binding for Type for input element
     */
    type: string;
    /**
     * Constructor for calc-input component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {CommunicatorService} communicator Instance of CommunicatorService
     */
    constructor(calcService: CalcService, communicator: CommunicatorService);
    /**
     * Initialize subscribers and component with value from calc model
     *
     */
    ngOnInit(): void;
    /**
     * Function to fetch updated value from calc model, and set it to value
     *
     */
    onModelUpdate(): void;
    /**
     * Handler function when the checkbox is clicked
     *
     */
    toggleValue(): void;
    /**
     * Saves updated value to calc model when the checkbox is clicked
     *
     */
    saveDataToModel(): void;
    /**
     * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
     *
     */
    ngOnDestroy(): void;
}
