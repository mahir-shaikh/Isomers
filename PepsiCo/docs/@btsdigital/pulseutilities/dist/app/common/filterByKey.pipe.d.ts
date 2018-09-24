import { PipeTransform } from '@angular/core';
export declare class SearchFilterOnObjectPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[];
    searchKeys(item: any, field: any, filter: any): boolean;
}
