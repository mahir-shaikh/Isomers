import * as ConnectInterface from '../interfaces';
import { HttpWrapperService } from '../httpwrapper/http-wrapper.service';
/**
* This is the service which calls the api functions and returns values needed
*/
export declare class ConnectService {
    private httpWrapperService;
    /**
    * Constructor Connect service
    *
    * @param {HttpWrapperService} httpWrapperService HttpWrapperService instance
    *
    */
    constructor(httpWrapperService: HttpWrapperService);
    /**
 * loop throug the maniges and fetch all used question names from the questionsToReceive and questionsToSend nodes
 */
    private static getAllQuestionNames(state);
    /**
    * We recieve a list of questions ids from the api get questionIds
    * This function would substitute the correct id again the correct name in manifest
    */
    private static mapAndValidateQuestionIds(state, questionIds);
    /**
    * loop through the manifest and find the question ids of all the questionToRecieve
    */
    private static getQuestionIdsToReceive(state);
    /**
   * loop through the manifest and find the question ids of all the foremanquestionToRecieve
   */
    private static getForemanQuestionIdsToReceive(state);
    /**
   * loop through the manifest and find the track question id
   */
    private static getTrackQuestionId(state);
    /**
    * Handles authentication errors while api calls
    */
    private static handleAuthenticationError(response);
    /**
    * Check if the error thron by api call is an authentication error
    */
    private static isAuthenticationMessage(message);
    /**
   * Get questions ids of the shornames mentioned in manifest configuration
   */
    getQuestionIds: (state: ConnectInterface.Connect.Manifest) => Promise<ConnectInterface.Connect.Manifest>;
    /**
   * Save the votes to the backed in bulk.
   * This is used by UploadQueue in connect throttler
   */
    voteManyQuestionsFromJson: (state: any) => Promise<ConnectInterface.Connect.Manifest>;
    /**
   * Fetch my votes from backend.
   * This is used by downloadQueue in connect throttler
   */
    getMyVotes: (state: ConnectInterface.Connect.Manifest) => Promise<ConnectInterface.Connect.Manifest>;
    /**
 * Fetch my foreman votes from backend.
 * This is used by downloadQueue in connect throttler
 */
    getMyForemanVotes: (state: ConnectInterface.Connect.Manifest) => Promise<ConnectInterface.Connect.Manifest>;
}
