/* tslint:disable */
// Type definitions for jsCalc library
// Project: jsCalc
// Definitions by: Devendra Shangari

export = jsCalc;
/**
    This is the jsCalc Api class. This is used to initialize and make updates to the model.
*/
declare class jsCalc {
    /**
    * jsCalc constructor
    * @constructor
    * @name jsCalc
    * @param {CalcOptions} options Constructor parameter object        
    */
    constructor(options?: jsCalc.CalcOptions);
    /**
        Deprecated version number of jsCalc
        @type {number}
        @deprecated - Using the package json version no instead of internal version no.
    */
    versionNumber: number;
    /**
    * Period name - used for historical data
    * @type {string}
    */
    periodName: string;
    /**
    * curPeriod - used internally to store current period
    * @type {string}
    */
    curPeriod: number;
    /**
    * Callback to call once model is done loading
    * @type {Function}
    */
    loadCallback: Function;
    /**
    *
    * Callback to call during build, passes progress information
    * @type {Function}
    */
    buildProgressCallback: Function;
    /**
    * URL to model JSON.  Mutually exclusive with model
    * @type {string}
    */
    modelURL: string
    /**
    * URL to model JSON.  Mutually exclusive with model
    * @type {string}
    */
    model: JSON | null
    /**
    * Build model asynchronously (defaults to true)
    * @type {boolean}
    */
    buildAsync: boolean
    /**
    * jsCalc workbook object
    * @type {any}
    */
    workbook: any
    /**
    * internal flag to check if model is ready or not 
    * @type {boolean}
    */
    private ready: boolean
    /**
    * Array to store calculation callback functions
    * @type {Array<Function>}
    */
    private calculationCallbacks: Array<Function>
    /**
    * Array to store singleton calculation callback functions
    * @type {Array<Function>}
    */
    singletonCalculationCallbacks: Array<Function>
    /**
    * Custom actions defined for this model
    * @type {Function}
    */
    courseActions: Function
    private stateVariables: any
    private historicalData: any
    /**
    * Sets a callback that will fire after the next recalculate and then will be removed.
    * @param {Function} nextRecalcFunc The function to call on next recalculate.
    */
    onNextRecalculate(nextRecalcFunc: Function): void
    /**
    * Sets a callback that will fire after the calculation stack completes.
    * @return {Promise<any>} Promise ref for the calculate operation
    */
    completeCalculation(): Promise<any>
    buildFromJSON(json: any): void
    /**
    * Resets the model by rebuilding it. Check for completeCalculation promise for reset complete status
    * @param {ResetParams} params Reset parameter object
    */
    reset(params: jsCalc.ResetParams)
    /**
    * Sets the value of cells specified by rangeID
    * @param {string} ref Excel compatible range specifier (valid rangename or address)
    * @param {string|Array<Array<string>>} value Value to set range to (if rangeID is a single cell) or a 2-dimensional array of values (of form [[r0c0, r0c1, ..., r0cn], [r1c0, r1c1, ..., r1cn], ..., [rnc0, rnc1, ..., rncn]]).  Array should only be used if the rangeID describes a multi-cell range
    * @return {Promise<any>} returns a complete calculation promise ref
    */
    setValue(ref: string, value: string | Array<Array<string>>): Promise<any>
    /**
    * Gets the raw unformatted value of cell[s] specified by rangeID.   Returns either a single value (as a numeric value, if numeric) or an array depending on whether rangeID describes a single cell or a multi-cell range
    * @param {string} ref Excel compatible range specifier (valid rangename or address)
    * @return {any} value Value from excel ref
    */
    getRawValue(ref: string): any
    /**
    * Gets the value of cell[s] specified by rangeID.   Returns either a single value as a formatted string or an array depending on whether rangeID describes a single cell or a multi-cell range
    * @param {string} ref Excel compatible range specifier (valid rangename or address)
    * @param {string} period Optional period to retrieve historical data
    * @return {any} value Value from excel ref
    */
    getValue(ref: string, period?: string): any
    /**
    * Gets the value of cell[s] specified by rangeID for the selected period.   Returns either a single value as a formatted string or an array depending on whether rangeID describes a single cell or a multi-cell range
    * @param {string} ref Excel compatible range specifier (valid rangename or address)
    * @param {string} period period from which data neds to be provided
    * @return {any} value Value from excel ref 
    */
    getHistoricalValue(ref: string, period: string): any
    /**
    * Gets the value of cells specified by rangeID for use as a data series. This will force the values to return as a one-dimensional array (adding the data row by row to the output)
    * @param {string} ref Excel compatible range specifier (valid rangename or address)
    * @param {string} period period from which data neds to be provided
    * @return {Array<any>} value Value from excel ref
    */
    getSeriesValue(ref: string, period?: string): Array<any>
    /**
    * Adds a callback to fire when calculation is complete.  Will fire after the completion of every calculation.  Multiple callbacks can be added.
    * @param {Function} cbFunc to call
    */
    addCalculationCallback(cbFunc: Function): void
    /**
    * Removes a previously set recurring calculation callback
    * @param {Function} cbFunc Callback function to remove
    */
    removeCalculationCallback(cbFunc: Function): void
    /**
    * Runs the named course action (which was defined in a custom action passed to the constructor)
    * @param {Function} cbFunc Callback to remove
    * @return Promise indicating completion of course action (and any recalculations if necessary)
    */
    runCourseAction(actionName: string): Promise<any>
    /**
    * Gets an object describing all cells that have been changed from the base state of the simulation as well as all historical data
    * @return {any} outOb Object representation of model state
    */
    getFullState(): any
    /**
    * Gets an object describing all cells that have been changed from the base state of the simulation
    * @return {any} outOb Object representation of model state
    */
    getState(): any
    /**
    * Gets an object describing all cells that have been changed from the base state of the simulation
    * @return {any} outOb Object representation of model state
    */
    getHistoricalState(): any
    /**
    * Gets a JSON string representing an object describing all cells that have been changed from the base state of the simulation
    * @return {string} outOb Stringified JSON representation of model state
    */
    getJSONState(): string
    /**
    * Sets the simulation state to the state described by stateObject.  This will reset and rebuild the model as part of the process.
    * @param {any} stateObject An object describing all cells that have been changed from the base state of the simulation
    * @param {any} historicalState An optional object describing historical state of the simulation
    * @param {Function} callback Optional callback function to call once rebuild is complete and state has been set
    */
    setState(state: any, historicalState?: any, callback?: Function): void
    /**
    * Sets the simulation state to the state described by stateObject.  This will reset and rebuild the model as part of the process.
    * @param {string|JSON} stateJSON A JSON string representing an object describing all cells that have been changed from the base state of the simulation
    * @param {Function} callback to call once rebuild is complete and state has been set
    */
    setJSONState(stateJSON: string, callback: Function)
    /**
    * Copies the values from sourceDataRange into the equivalent cells offset from the top-left of destination range.  Currently will not paste over formulas.  This function is intended to enable implementing custom course actions - If you are using it in a different context then you should consider implementing what you are doing as a course action instead.  While this can be called with exactly the same source and destination, avoid calling it for overlapping but nonidentical ranges as behavior may be unpredictable.
    * @param {string} sourceDataRange Excel compatible range specifier (valid rangename or address) specifying which cells to copy data from
    * @param {string} destinationRange Excel compatible range specifier (valid rangename or address) specifying where to paste the values from the source range.  Only the top left cell of this range is relevant, as the cells will paste according to the size and shape of sourceDataRange
    */
    copyAndPasteByValue(sourceDataRange: string, destinationRange: string)
    /**
    * If name is a defined named range for the current model returns true, otherwise returns false
    * @param {string} name The name to test
    */
    isNamedRange(name: string): boolean
    onCalculationDone(): void
    getRangeRef(ref: string): any
    setBuildProgressCallback(cbFunc: Function): void
    onBuildProgress(progress: any): void
    saveCurrentPeriodHistoricalData(periodRange: string): void
    getBook(): any
    getFriendlyRangeName(address: string): string
    getNames(regExp): Array<string>
    addCourseActionBlock(actionObject: any): void
    addCourseAction(name: string, actionFunction: Function): void
}

/** 
* jsCalc namespace, all other exported types to be declared here
*/
declare namespace jsCalc {
    /** 
    * CalcOptions interface for jsCalc constructor
    */
    export interface CalcOptions {
        /**
        * Model JSON object.Mutually exclusive with modelURL
        * @type {JSON}
        */
        model?: JSON | null
        /**
        * URL to model JSON.  Mutually exclusive with model
        * @type {string}
        */
        modelURL?: string
        /**
        * Custom actions defined for this model
        * @type {Function}
        */
        courseActions: Function
        /**
        * Callback to call once model is done loading
        * @type {Function}
        */
        loadCallback?: Function
        /**
        *
        * Callback to call during build, passes progress information
        * @type {Function}
        */
        buildProgressCallback?: Function
    }

    /** 
    * ResetParams interface for jsCalc reset function
    */
    export interface ResetParams {
        /**
        *
        * Callback to call during build, passes progress information
        * @type {Function}
        */
        buildProgressCallback: Function
        /**
        * Callback to call once model is done loading
        * @type {Function}
        */
        loadCallback: Function
    }
}