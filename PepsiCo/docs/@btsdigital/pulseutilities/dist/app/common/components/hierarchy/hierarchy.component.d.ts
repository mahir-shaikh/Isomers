import { OnInit, EventEmitter } from '@angular/core';
import { GatewayService } from '../../../services/gateway/gateway.service';
import { ContentObject, HierarchyEmmitOptions } from '../../classes/contentobject';
export declare class HierarchyComponent implements OnInit {
    private gws;
    hdata: ContentObject;
    level: number;
    controls: boolean;
    filter: any;
    rootMetadata: any;
    contentChange: EventEmitter<any>;
    favouriteChange: EventEmitter<any>;
    constructor(gws: GatewayService);
    opt: HierarchyEmmitOptions;
    iconsPath: string;
    lvlNo: any;
    showControls: boolean;
    currentDate: string;
    clsName1: any;
    clsName2: any;
    rescheduleStatus: boolean;
    ngOnInit(): void;
    onCoChange(heo: HierarchyEmmitOptions): void;
    schedule(event: any, items: ContentObject): void;
    showReschedule(items: ContentObject): boolean;
    toggleExpand(co: any): void;
    onFavChange($event: any, items: any): void;
    jumpToCO(co: ContentObject, i: any): void;
    editMe(levelNo: any, curNode: any, curIdx: any): void;
    addTopic(mNode: any, mIdx: any): void;
    addSection(pNode: any): void;
    moveUp(event: any, curNode: any, index: any): void;
    moveDown(event: any, curNode: any, index: any): void;
    hierarchyEmmit(curAct: any, curNode: any, curIdx: any): void;
    enrollModule(event: any, items: any): void;
}
