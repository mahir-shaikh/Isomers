export class CalcApiStub {
    private api: any;
    private storedValue;

    constructor(jsCalcApi: any) {
        this.api = jsCalcApi;
    }

    getValue(rangeRef: string, rawValue ? : boolean) {
        if (this.storedValue) {
            return this.storedValue;
        } else {
            return rangeRef;
        }
    }

    setValue(rangeRef: string, value: any): Promise < any > {
        let self = this;
        this.storedValue = rangeRef;
        return Promise.resolve(true);
    }
    

    getJSONState(): string {
        return ;
    }

    appendDataToModel(stateOb:any):Promise<any>{
    	return Promise.resolve();
    }

}
