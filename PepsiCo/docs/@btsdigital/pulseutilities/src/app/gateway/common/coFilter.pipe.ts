import { Pipe, PipeTransform } from '@angular/core';
import { ContentObject, COSection, HierarchyEmmitOptions } from '../../common/classes/contentobject';

@Pipe({ name: 'coFilter' })
export class CoFilterPipe implements PipeTransform {

    transform(allCos: ContentObject[], filter: any) {
        if (allCos) {
            if (filter.selectedLevel == '' && filter.selectedType == '' && filter.selectedStatus == '' && filter.isNew == '' && filter.favourite == '') {
                return allCos;
            }
            else {
                return allCos.filter(co => this.getLowestLevelContentObject(co, filter));
            }
        }
    }

    getLowestLevelContentObject(co: ContentObject, filter: any): boolean {
        if (co.contentObjects == null || co.contentObjects.length == 0) {
            var matchLevel: boolean = true,
                matchType: boolean = true,
                matchStatus: boolean = true,
                matchFav: boolean = true,
                matchNew: boolean = true;

            matchLevel = filter.selectedLevel == '' ? true : (co.metadata != null && co.metadata.level != null && co.metadata.level.map(function (m: string) { return m.toLowerCase(); }).indexOf(filter.selectedLevel.toLowerCase()) != -1);
            matchType = filter.selectedType == '' ? true : (co.metadata != null && co.metadata.type != null && co.metadata.type.map(function (m: string) { return m.toLowerCase(); }).indexOf(filter.selectedType.toLowerCase()) != -1);
            matchStatus = filter.selectedStatus == '' ? true : (co.status != null && co.status.toString().toLowerCase() == filter.selectedStatus.toLowerCase());
            matchFav = filter.favourite == '' ? true : (co.fav != null && co.fav.toString().toLowerCase() == filter.favourite.toString().toLowerCase());
            matchNew = filter.isNew == '' ? true : (co.metadata != null && co.metadata.isnew != null && co.metadata.isnew.map(function (m: string) { return m.toLowerCase(); }).indexOf(filter.isNew.toLowerCase()) != -1);

            return matchLevel && matchType && matchStatus && matchFav && matchNew;
        }
        else {
            var childStatus: boolean[] = [];

            if (co.contentObjects)
                for (var i = 0; i < co.contentObjects.length; i++)
                    childStatus.push(this.getLowestLevelContentObject(co.contentObjects[i], filter));

            return childStatus.indexOf(true) != -1;
        }

    }

}