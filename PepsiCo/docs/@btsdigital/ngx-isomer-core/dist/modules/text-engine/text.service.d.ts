import { Http } from '@angular/http';
import * as Collections from 'typescript-collections';
import { CalcService } from '../calc/calc.service';
import { CommunicatorService } from '../services/communicator/communicator.service';
import { LoggerService } from '../services/logger/logger.service';
import 'rxjs/add/operator/toPromise';
/**
 * TextService provides ability to fetch text content from the content json using text keys as tokens for text-data
 *
 */
export declare class TextService {
    private http;
    private calcService;
    private logger;
    private communicator;
    /**
     * Dictionary object for storing text content as key-pair value
     *
     */
    private textContent;
    /**
     * Language of currently loaded text content
     *
     */
    private _language;
    /**
     * Whether text service is ready for use
     *
     */
    private isReady;
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
    constructor(http: Http, calcService: CalcService, logger: LoggerService, communicator: CommunicatorService);
    /**
     * Getter for {@link _language}
     *
     */
    /**
     * Setter for {@link _language}
     *
     */
    language: string;
    /**
     * Getter for {@link isReady}
     *
     */
    readonly isApiReady: boolean;
    /**
     * Process content json
     *
     * @param {any} json Json content data to be processed
     *
     * @return {Promise<any>}
     */
    private processContent(json);
    /**
     * Process scene data in content json
     *
     * @param {any} scene Scene data to be parsed
     *
     */
    private processScene(scene);
    /**
     * Add scene data to data-store
     *
     * @param {any} scene Scene data to be parsed
     */
    private addScene(scene);
    /**
     * Function to initialize text service defaults
     *
     * @return {Promise<any>}
     *
     */
    init(): Promise<any>;
    /**
     * Function to load a language json
     *
     * @param {string} lang Language key for json to be loaded
     *
     * @return {Promise<any>}
     */
    loadLanguage(lang: string): Promise<any>;
    /**
     *
     * Function to load content json from server
     *
     * @return {Promise<any>}
     *
     */
    loadJson(lang?: string): Promise<any>;
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
    getText(key: string, sceneId?: string): string;
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
    getTextForYear(key: string, yearRef: string, sceneId?: string): any;
    /**
     * Function to fetch dictionary object for a scene
     *
     * @param {string} sceneId SceneId to fetch data for
     *
     * @return {Collections.Dictionary}
     *
     */
    getScene(sceneId: string): Collections.Dictionary<string, string>;
    /**
     * Function to fetch all sceneIds in content json
     *
     * @return {Array<string>}
     */
    getSceneIds(): string[];
}
