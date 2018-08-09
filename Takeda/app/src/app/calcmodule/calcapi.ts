export class CalcApi {
    private api: any;

    constructor(jsCalcApi: any) {
        this.api = jsCalcApi;
    }

    getValue(rangeRef: string, rawValue?:boolean) {
        if (rawValue) {
            return this.api.getRawValue(rangeRef);
        }
        return this.api.getValue(rangeRef);
    }

    setValue(rangeRef: string, value: any): Promise<any> {
        let self = this;
        if (self.api.getValue(rangeRef) == value) {
            return Promise.resolve(false);
        }
        return self.api.setValue(rangeRef, value);
    }

    getNames(pattern:any) {
        return this.api.getNames(pattern);
    }

    getBook() {
        return this.api.getBook();
    }

    getJSONState(): string {
        return this.api.getJSONState();
    }

    addCalculationCallback(cbFn) {
        this.api.addCalculationCallback(cbFn);
    }

    appendDataToModel(stateOb:any): Promise<any> {
        var jsonState: Object,
            arrPromises = [],
            self = this;
        if (!stateOb) {
            return Promise.resolve();
        }

        if (typeof stateOb === "string") {
            jsonState = JSON.parse(stateOb);
        }
        else {
            jsonState = stateOb;
        }

        return new Promise((resolve, reject) => {
            Object.keys(jsonState).forEach(function(key: string) {
                arrPromises.push(self.setValue(key, jsonState[key]));
            });

            Promise.all(arrPromises).then(() => {
                resolve();
            });
        });
    }
}