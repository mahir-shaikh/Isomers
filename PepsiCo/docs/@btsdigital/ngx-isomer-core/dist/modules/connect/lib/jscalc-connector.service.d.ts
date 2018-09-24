import { Connect } from '../interfaces';
import { CalcService } from '../../calc/calc.service';
/**
 * This is a wrapper class for the JScalc module
 * This will give us an easy access to directly call the jsCalc functions for reading and writing in typescript
 */
export declare class JsCalcConnectorService {
    private jsCalcApi;
    /**
    * Constructor connect-throttler service
    *
    * @param {CalcService} jsCalcApi CalcService instance
    *
    */
    constructor(jsCalcApi: CalcService);
    /**
    * Read a value from jsCalcApi which would in turn read it from model
    */
    readValues: (state: Connect.Manifest) => Promise<Connect.Manifest>;
    /**
   * Write a value to jsCalcApi which would in turn write it to model
   */
    writeValues: (state: Connect.Manifest) => Promise<Connect.Manifest>;
}
