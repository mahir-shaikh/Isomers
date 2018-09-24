import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchFilterOnObjectKey'})
export class SearchFilterOnObjectPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if (!items) { 
            return [];
        }
        
        return items.filter(item => this.searchKeys(item, field, value));
    }

    searchKeys(item, field, filter) {
        return item[field].toLowerCase().indexOf(filter.toLowerCase()) != -1;
    }
}