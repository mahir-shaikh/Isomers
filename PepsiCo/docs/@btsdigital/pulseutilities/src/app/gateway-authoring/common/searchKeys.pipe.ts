import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchKeys' })
export class SearchKeyPipe implements PipeTransform {

    transform(keys: any, filter: any) {
        if (keys) {
            return keys.filter(key => this.searchKeys(key, filter));
        }
    }

    searchKeys(key, filter) {
        return key.Key.toLowerCase().indexOf(filter.toLowerCase()) != -1;
    }
}