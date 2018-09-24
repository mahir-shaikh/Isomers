import { PipeTransform } from '@angular/core';
import { ContentObject } from '../../common/classes/contentobject';
export declare class CoFilterPipe implements PipeTransform {
    transform(allCos: ContentObject[], filter: any): ContentObject[];
    getLowestLevelContentObject(co: ContentObject, filter: any): boolean;
}
