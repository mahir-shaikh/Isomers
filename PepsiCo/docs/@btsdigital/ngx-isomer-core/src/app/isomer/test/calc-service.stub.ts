import { Observable } from 'rxjs/Observable';
import { CommunicatorService } from '../modules/services/communicator/communicator.service';
import { Constants } from '../config/constants';

export class CalcServiceStub {
  private _apiReady: Boolean = false;
  private _value: any = {};
  constructor() {}

  public set apiReady(v: Boolean) {
    this._apiReady = v;
  }

  createModelCalcCompleteTrigger() {
    // this.communicator.createEmitter(Constants.MODEL_CALC_COMPLETE);
  }

  // triggerModelCalcComplete() {
  //   this.communicator
  //     .getEmitter(Constants.MODEL_CALC_COMPLETE)
  //     .next();
  //   // this.communicator.trigger(Constants.MODEL_CALC_COMPLETE);
  // }

  isApiReady(): Boolean {
    return this._apiReady;
  }

  getApi(options?: any): Promise<any> {
  return Promise.resolve(this);
  }

  getValue(refName: string, rawValue?: Boolean): string {
      return this._value[refName];
  }

  getValueForYear(refName: string, yearRef?: string, rawValue?: Boolean): string {
    return this.getValue(refName, rawValue);
  }

  setValue(refName: string, value: any): Promise<any> {
    this._value[refName] = value;
    return Promise.resolve();
  }

  setValueForYear(refName: string, value: any, yearRef: string): Promise<any> {
    return this.setValue(refName, value);
  }

  /**
  * Get the emitter for calc-updates
  **/
  /** @deprecated */
  getObservable(): Observable<any> {
    return new Observable<any>();
  }


  appendDataToModel(stateOb?: string | JSON): Promise<any> {
    return Promise.resolve({});
  }

  setModelState(modelState?: string|JSON): Promise<any> {
    return Promise.resolve({});
  }

  forceRecalculate(options: any): Promise<any> {
    return Promise.resolve({});
  }

  saveStateToStorage(): Promise<any> {
    return Promise.resolve({});
  }

  getStateFromStorage(): Promise<any> {
    return Promise.resolve({});
  }

  exportData(exp: string): any {
    return null;
  }
}
