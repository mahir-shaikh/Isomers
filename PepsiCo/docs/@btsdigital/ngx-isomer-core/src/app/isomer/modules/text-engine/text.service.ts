import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import * as Collections from 'typescript-collections';
import { CalcService } from '../calc/calc.service';
import { Constants } from '../../config/constants';
import { CommunicatorService } from '../services/communicator/communicator.service';
import { LoggerService } from '../services/logger/logger.service';
import 'rxjs/add/operator/toPromise';

/**
 * TextService provides ability to fetch text content from the content json using text keys as tokens for text-data
 *
 */
@Injectable()
export class TextService {
  /**
   * Dictionary object for storing text content as key-pair value
   *
   */
  private textContent: Collections.Dictionary<string, Collections.Dictionary<string, string>> =
    new Collections.Dictionary<string, Collections.Dictionary<string, string>>();
  /**
   * Language of currently loaded text content
   *
   */
  private _language: string = Constants.TEXT_ENGINE.DEFAULT_LANG;
  /**
   * Whether text service is ready for use
   *
   */
  private isReady = false;

  /**
   * Constructor for text service
   *
   * @param {Http} http Angular Http instance to load content json
   *
   * @param {LoggerService} logger LoggerService instance
   *
   * @param {CommunicatorService} communicator CommunicatorService instance
   *
   */
  constructor(private http: Http,
    private calcService: CalcService,
    private logger: LoggerService,
    private communicator: CommunicatorService) { }

  /**
   * Setter for {@link _language}
   *
   */
  public set language(lang: string) {
    this._language = lang;
  }

  /**
   * Getter for {@link _language}
   *
   */
  public get language() {
    return this._language;
  }

  /**
   * Getter for {@link isReady}
   *
   */
  public get isApiReady() {
    return this.isReady;
  }

  /**
   * Process content json
   *
   * @param {any} json Json content data to be processed
   *
   * @return {Promise<any>}
   */
  private processContent(json: any): Promise<any> {
    let scenes: any[];
    if (typeof json === 'object' && json.scenes instanceof Array) {
      scenes = json.scenes;
      scenes.forEach(scene => this.processScene(scene));
    }

    return Promise.resolve(this.textContent);
  }

  /**
   * Process scene data in content json
   *
   * @param {any} scene Scene data to be parsed
   *
   */
  private processScene(scene: any): void {
    if (typeof scene === 'object' && scene.hasOwnProperty('ID')) {
      // this.textContent.setValue(scene.ID, scene);
      this.addScene(scene);
    }/* else {
      // GENERAL keys (scene does not have an id)
      if (typeof scene === 'object') {
        Object.keys(scene)
          .forEach(key => {
            this.addGeneralKey(key, scene[key]);
          });
      }
    }*/
  }


  /**
   * Add scene data to data-store
   *
   * @param {any} scene Scene data to be parsed
   */
  private addScene(scene: any) {
    this.textContent.setValue(scene.ID, new Collections.Dictionary<string, string>());
    const sceneDict: Collections.Dictionary<string, string> = this.textContent.getValue(scene.ID);
    Object.keys(scene).forEach(key => {
      sceneDict.setValue(key, scene[key]);
    });
  }
/*
  private addGeneralKey(key: string, value: string) {
    if (typeof key !== 'undefined' && key && typeof value !== 'undefined' && value) {
      const general: Collections.Dictionary<string, string> = this.textContent.getValue(Constants.TEXT_ENGINE.GENERAL);
      general.setValue(key, value);
    }
  }*/

  /**
   * Function to initialize text service defaults
   *
   * @return {Promise<any>}
   *
   */
  init(): Promise<any> {
    // initialize GEN scene
    this.textContent.setValue(Constants.TEXT_ENGINE.GENERAL, new Collections.Dictionary<string, string>());
    this.communicator.createEmitter(Constants.TEXT_ENGINE.LANGUAGE_LOADED);
    return this.loadLanguage(this.language);
  }

  /**
   * Function to load a language json
   *
   * @param {string} lang Language key for json to be loaded
   *
   * @return {Promise<any>}
   */
  loadLanguage(lang: string): Promise<any> {
    if (!lang) {
      return Promise.reject('Lang not provided');
    }
    this.isReady = false;
    return this.loadJson(lang).then(this.processContent.bind(this)).then(() => {
      this.communicator.trigger(Constants.TEXT_ENGINE.LANGUAGE_LOADED);
      this.isReady = true;
    }).catch(err => {
      // this.logger.log('Error loading json ' + err);
      throw err;
    });
  }

  /**
   *
   * Function to load content json from server
   *
   * @return {Promise<any>}
   *
   */
  loadJson(lang?: string): Promise<any> {
    lang = (lang) ? lang : Constants.TEXT_ENGINE.DEFAULT_LANG; // if no language is passed use default lang
    const filePath = Constants.TEXT_ENGINE.FILE_PATH + Constants.TEXT_ENGINE.FILE_NAME + '_' + lang + Constants.TEXT_ENGINE.FILE_EXT;
    return this.http.get(filePath).toPromise().then((response) => {
      try {
        return Promise.resolve(response.json());
      } catch (err) {
        return Promise.reject(err);
      }
    }).catch(err => {
      throw err;
    });
  }

  /**
   *
   * Function to get text from dictionary
   *
   * @param {string} key Text content key to fetch data from store
   *
   * @param {string} [sceneId] SceneID from which data needs to be fetched. Defaults to __GEN__
   *
   * @return {any}
   */
  getText(key: string, sceneId: string = Constants.TEXT_ENGINE.GENERAL): string {
    if (!this.isApiReady) {
      return;
    }
    return this.textContent.getValue(sceneId).getValue(key);
  }

  /**
   *
   * Function to get text from dictionary where key is appended with yearref in json
   *
   * @param {string} key Text content key to fetch data from store
   *
   * @param {string} yearRef This is the named range for current year/round,
   *   if it needs to be appended to the named ranges in range ref array
   *
   * @param {string} [sceneId] SceneID from which data needs to be fetched. Defaults to __GEN__
   *
   * @return {any}
   */
  getTextForYear(key: string, yearRef: string, sceneId?: string): any {
    /* If year is specified - append range name with _R + YearNo */
    // if calcService api is not ready - ignore the year ref
    if (yearRef && this.calcService.isApiReady()) {
      const year = this.calcService.getValue(yearRef);
      if (year) {
        key += '_R' + year;
      }
    }

    return this.getText(key, sceneId);
  }

  /**
   * Function to fetch dictionary object for a scene
   *
   * @param {string} sceneId SceneId to fetch data for
   *
   * @return {Collections.Dictionary}
   *
   */
  getScene(sceneId: string): Collections.Dictionary<string, string> {
    return this.textContent.getValue(sceneId);
  }

  /**
   * Function to fetch all sceneIds in content json
   *
   * @return {Array<string>}
   */
  getSceneIds(): string[] {
    return this.textContent.keys();
  }
}
