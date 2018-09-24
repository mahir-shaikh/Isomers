export class StorageServiceStub {
    private storedValue: any = {};
    private simulateError: Boolean = false;

    getValue(key: string) {
        return (this.simulateError) ? Promise.reject('Simulated error in storage') : Promise.resolve(this.storedValue[key]);
    }
    setValue(key: string, value: string): Promise < any > {
      this.storedValue[key] = value;
      return (this.simulateError) ? Promise.reject('Simulated error in storage') : Promise.resolve(true);
    }
    clear(key: string): Promise<any> {
      delete this.storedValue[key];
      return (this.simulateError) ? Promise.reject('Simulated error in storage') : Promise.resolve({});
    }

    clearAll(): Promise<any> {
      this.storedValue = {};
      return (this.simulateError) ? Promise.reject('Simulated error in storage') : Promise.resolve({});
    }

    forceSync(): Promise<any> {
      return (this.simulateError) ? Promise.reject('Simulated error in storage') : Promise.resolve({});
    }

    setMode(mode: string): void {
      return;
    }

    simulateStorageFail(simulate: Boolean = false) {
      this.simulateError = simulate;
    }
}
