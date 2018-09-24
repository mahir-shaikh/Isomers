import { PipeTransform } from '@angular/core';
export declare class SearchKeyPipe implements PipeTransform {
    transform(keys: any, filter: any): any;
    searchKeys(key: any, filter: any): boolean;
}
