
export interface IStorage {
    setValue(key:string, value: string):Promise<any>;
    getValue(key:string):Promise<string>;
    clear(key:string, destroy:boolean):void;
}