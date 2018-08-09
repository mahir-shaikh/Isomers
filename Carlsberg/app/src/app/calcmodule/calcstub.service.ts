import { Injectable, EventEmitter, ErrorHandler } from '@angular/core';
import { CalcApi } from './calcapi';


@Injectable()
export class CalcServiceStub {
    private api: CalcApi = new CalcApi(this);
    private modelChangeEvent: EventEmitter < any > = null;
    private externallySetValue: any;


    getApi(loadingProgressCb: Function = null) {
        if (this.api) {
            return Promise.resolve(this);
        }
    }

    getObservable(): EventEmitter < any > {
        if (this.modelChangeEvent == null) {
            this.modelChangeEvent = new EventEmitter()
        }
        return this.modelChangeEvent;
    }

    getValueForYear(rangeRef: string, yearRef: string, rawValue ? : boolean, logRangeRef ? : boolean): any {
        if (this.externallySetValue != undefined) {
            return this.externallySetValue;
        } else {
            if (rangeRef && rangeRef != undefined && rangeRef != null && rangeRef != "") {
                return rangeRef;
            } else {
                return undefined;
            }
        }
    }

    getValue(rangeRef: string, rawValue ? : boolean): any {
        if (this.externallySetValue != undefined) {
            return this.externallySetValue;
        } else {
            if (rangeRef && rangeRef != undefined && rangeRef != null && rangeRef != "") {
                return rangeRef;
            } else {
                return undefined;
            }


        }
    }

    setValueForYear(rangeRef: string, value: any, yearRef: string) {
        return this.setValue(rangeRef, value);
    }

    setValue(rangeRef: string, value: any) {
        let _now = window.performance.now();

        let self = this;
        this.externallySetValue = value;
        return;
    }

}
