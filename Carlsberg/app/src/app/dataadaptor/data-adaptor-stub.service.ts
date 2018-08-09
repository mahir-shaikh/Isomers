export class DataAdaptorStubService {
    private storedValue: any;

    getValue(key: string) {
        return key;
    }
    setValue(key: string, value: string): Promise < any > {
    	this.storedValue=value;
    	return Promise.resolve(true);
    }

}
