import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Dictionary } from '../utils/utils';
import { CalcService } from '../calcmodule/calc.service';
const GENERAL: string = 'GEN';

@Injectable()
export class TextEngineService {
    private textContent: Dictionary;
    private textContentPromise: Promise<any>;
    
    constructor(private http: Http, private calcService: CalcService) { 
        this.textContent = {};
        this.textContent[GENERAL] = {};
    }

    init(): Promise<Dictionary> {
        return this.textContentPromise = new Promise((resolve, reject) => {
            this.loadTextContent().then(json => {
                this.processContentJson(json);
                resolve(this.textContent)
            });
        });
    }

    loadTextContent(): Promise<any> {
        return this.http.get('assets/data/EventContent.json').toPromise().then(response => response.json());
    }

    processContentJson(json: any) {
        let scenes: Array<any>;
        if (json.scenes instanceof Array) {
            scenes = json.scenes;
            scenes.forEach(scene => this.processScene(scene));
        }
    }

    processScene(scene:any) {
        if (scene.ID) {
            this.textContent[scene.ID] = scene;
        }
        else {
            // general text content -
            Object.keys(scene).forEach(key => this.addGeneralKey(key, scene[key]));
        }
    }

    addGeneralKey(key: string, value: string) {
        if (key && value) {
            this.textContent[GENERAL][key] = value;
        }
    }

    getText(key:string = null, sceneId:string = GENERAL): string {
        return this.textContent[sceneId][key];
    }

    getTextForYear(rangeRef: string, yearRef: string, sceneId?:string): any {
        /* If year is specified - append range name with _R + YearNo */
        if (yearRef) {
            let year = this.calcService.getValue(yearRef);
            if (year) {
                rangeRef += "_R" + year;
            }
        }

        return this.getText(rangeRef, sceneId);
    }

    getScene(sceneId: string): Dictionary {
        return this.textContent[sceneId];
    }

    getMeetings(): any {
        var keys = {};
        for (var key in this.textContent) {
            if (this.textContent[key].PageType == "SingleSelect") {
                keys[key] = this.textContent[key];
            }
        }
        return keys;
    }

    getMessages(): any {
        var keys = {};
        for (var key in this.textContent) {
            if (this.textContent[key].PageType == "Read Update") {
                keys[key] = this.textContent[key];
            }
        }
        return keys;
    }

    getInitiatives(): any {
        var keys = {};
        for (var key in this.textContent) {
            if (this.textContent[key].PageType == "Initiative") {
                keys[key] = this.textContent[key];
            }
        }
        return keys;
    }

    getFeedback(): any {
        var keys = {};
        for (var key in this.textContent) {
            if (this.textContent[key].PageType == "Feedback") {
                keys[key] = this.textContent[key];
            }
        }
        return keys;
    }

    getScenes(): any {
        var keys = {};
        for (var key in this.textContent) {
            keys[key] = this.textContent[key];
        }
        return keys;
    }

    getSingleSelectChoices(id: string): Array<any> {
        var localChoices = [];
        
        let localObj = this.getScene(id);
        let keyArr: any[] = Object.keys(localObj);

        let i = 1;
        let moreChoices = false;
        keyArr.forEach((key: any) => {
            if (key.indexOf("alt"+i) != -1) {
                moreChoices = true;
            }
        });

        while (moreChoices) {
            let localLabel = ""
            let localDesc = "";
            keyArr.forEach((key: any) => {
                if ((key.indexOf("alt"+i) != -1) && (key.length < 6)) {
                    localLabel = localObj[key];
                }
            });
            keyArr.forEach((key: any) => {
                if ((key.indexOf("alt"+i) != -1) && (key.length > 6)) {
                    localDesc = localObj[key];
                }
            });
            localChoices.push({ 
                "value": String.fromCharCode(64 + i), 
                "label": localLabel, 
                "desc": localDesc 
            });
            i++;
            moreChoices = false;
            keyArr.forEach((key: any) => {
                if (key.indexOf("alt"+i) != -1) {
                    moreChoices = true;
                }
            });
        }

        return localChoices;
    }

    getSpecificTabScenes(keyTabScene: string){
        var keys = {};
        for (var key in this.textContent) {
            if (key.indexOf(keyTabScene) != -1) {
                keys[key] = this.textContent[key];
            }
        }
        return keys;
    }

}