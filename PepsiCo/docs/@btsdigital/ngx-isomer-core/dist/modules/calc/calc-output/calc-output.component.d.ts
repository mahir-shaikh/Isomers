import { OnInit, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../calc.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
/**
 * CalcOutput component displays value from calc model for a given range ref.
 *
 */
export declare class CalcOutputComponent implements OnInit, OnChanges, OnDestroy {
    private calcService;
    private communicator;
    private cdRef;
    /**
     * Value for range ref from calc-model
     */
    value: string;
    /**
     * CalcModel update subscription for listening to model changes
     *
     */
    private subscriber;
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
     * Input binding for rawValue flag
     *
     */
    rawValue: Boolean;
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
    constructor(calcService: CalcService, communicator: CommunicatorService, cdRef: ChangeDetectorRef);
    /**
     * OnInit function
     *
     */
    ngOnInit(): void;
    /**
     * Function to fetch updated value from calc model
     *
     */
    update(): void;
    /**
     * Update the value when any Input binding is changed
     *
     */
    ngOnChanges(): void;
    /**
     * Destroy any subscription when component instance is destroyed
     *
     */
    ngOnDestroy(): void;
}
