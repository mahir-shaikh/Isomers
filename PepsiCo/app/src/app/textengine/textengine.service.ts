import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Dictionary } from '../utils';
// import { CalcService } from '../calcmodule';
import { CalcService, TextService, CommunicatorService, LoggerService } from '@btsdigital/ngx-isomer-core';
const GENERAL: string = 'GEN';
const FILE_NAME: string = './assets/content/EventContent';
const FILE_EXT: string = '.json';
const DEFAULT_LANG: string = 'en';

@Injectable()
export class TextEngineService extends TextService {
    private textContentA: Dictionary;
    private textContentPromise: Promise<any>;
    private languageA: string = DEFAULT_LANG;
    public languageChangeEmitter: EventEmitter<any> = new EventEmitter();
    private _http: Http;

    constructor(http: Http, calcService: CalcService, communicator: CommunicatorService, logger: LoggerService) {
        super(http, calcService, logger, communicator);
        this._http = http;
        this.textContentA = {};
        this.textContentA[GENERAL] = {};
    }

    init(language?: string): Promise<Dictionary> {
        return this.textContentPromise = new Promise((resolve, reject) => {
            // load the default language file first
            this.loadTextContent(language).then(json => {
                this.processContentJson(json);
                resolve(this.textContentA);
            });
        });
    }

    loadTextContent(language?: string): Promise<any> {
        language = (language) ? language : '_' + DEFAULT_LANG;
        // let languageFile = FILE_NAME + FILE_EXT;
        const languageFile = FILE_NAME + language + FILE_EXT;
        return this._http.get(languageFile)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleErrors);
    }

    handleErrors(response: any) {
        console.log(response);
    }

    changeLanguage(language: string): Promise<any> {
        if (!language) {
            return Promise.reject('No language specified');
        }
        return this.loadTextContent(language)
            .then((json) => {
                this.processContentJson(json);
                this.languageChangeEmitter.next(language); // emit event for text-outlet to update itself
            });
    }


    processContentJson(json: any) {
        let scenes: Array<any>;
        if (json.scenes instanceof Array) {
            scenes = json.scenes;
            scenes.forEach(scene => this.processSceneA(scene));
        }
    }

    processSceneA(scene: any) {
        if (scene.ID) {
            this.textContentA[scene.ID] = scene;
        } else {
            // general text content -
            Object.keys(scene).forEach(key => this.addGeneralKey(key, scene[key]));
        }
    }

    addGeneralKey(key: string, value: string) {
        if (key && value) {
            this.textContentA[GENERAL][key] = value;
        }
    }

    // getText(key: string = null, sceneId: string = GENERAL): string {
    //     return this.textContent[sceneId][key];
    // }

    // getTextForYear(rangeRef: string, yearRef: string, sceneId?: string): any {
    //     /* If year is specified - append range name with _R + YearNo */
    //     if (yearRef) {
    //         let year = this.calcService.getValue(yearRef);
    //         if (year) {
    //             rangeRef += '_R' + year;
    //         }
    //     }

    //     return this.getText(rangeRef, sceneId);
    // }

    // getScene(sceneId: string): Dictionary {
    //     return this.textContent[sceneId];
    // }

    getMeetings(): any {
        const keys = {};
        for (const key in this.textContentA) {
            if (this.textContentA[key].PageType === 'SingleSelect') {
                keys[key] = this.textContentA[key];
            }
        }
        return keys;
    }

    getMessages(): any {
        const keys = {};
        for (const key in this.textContentA) {
            if (this.textContentA[key].PageType === 'Read Update') {
                keys[key] = this.textContentA[key];
            }
        }
        return keys;
    }

    getInitiatives(initiativeKey: string = 'Initiative'): any {
        const keys = {};
        for (const key in this.textContentA) {
            if (this.textContentA[key].PageType === initiativeKey) {
                keys[key] = this.textContentA[key];
            }
        }
        return keys;
    }

    getFeedback(): any {
        const keys = {};
        for (const key in this.textContentA) {
            if (this.textContentA[key].PageType === 'Feedback') {
                keys[key] = this.textContentA[key];
            }
        }
        return keys;
    }

    getScenes(): any {
        const keys = {};
        for (const key in this.textContentA) {
            if (this.textContentA.hasOwnProperty(key)) {
                keys[key] = this.textContentA[key];
            }
        }
        return keys;
    }

    getSingleSelectChoices(id: string): Array<any> {
        const localChoices = [];

        const localObj = this.getScene(id);
        const keyArr: any[] = Object.keys(localObj);

        let i = 1;
        let moreChoices = false;
        keyArr.forEach((key: any) => {
            if (key.indexOf('alt' + i) !== -1) {
                moreChoices = true;
            }
        });

        while (moreChoices) {
            let localLabel = '';
            let localDesc = '';
            keyArr.forEach((key: any) => {
                if ((key.indexOf('alt' + i) !== -1) && (key.length < 6)) {
                    localLabel = localObj[key];
                }
            });
            keyArr.forEach((key: any) => {
                if ((key.indexOf('alt' + i) !== -1) && (key.length > 6)) {
                    localDesc = localObj[key];
                }
            });
            localChoices.push({
                'value': String.fromCharCode(64 + i),
                'label': localLabel,
                'desc': localDesc
            });
            i++;
            moreChoices = false;
            keyArr.forEach((key: any) => {
                if (key.indexOf('alt' + i) !== -1) {
                    moreChoices = true;
                }
            });
        }

        return localChoices;
    }

}
