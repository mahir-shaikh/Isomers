import { Injectable } from '@angular/core';
const GENERAL: string = 'GEN';

@Injectable()
export class TextEngineServiceStub {
    constructor() {}


    getText(key: string = null, sceneId: string = GENERAL): string {
        if(key && key != undefined && key != null && key != ""){
            return key;
        }else{
            return undefined;
        }
    }

}
