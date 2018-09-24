import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
/**
 * HttpWrapper service used for sending Get/ Post requests to pulse server
 *
 */
export declare class HttpWrapperService {
    private http;
    /**
     * Hostname of the remote pulse server to connect
     *
     */
    private hostname;
    /**
     * Unwrap function to parse response from pulse server as json data
     *
     * @return {JSON}
     */
    private static unwrapBody(response);
    /**
     * Constructor for HttpWrapper service
     *
     * @param {Http} http Angular Http service instance
     */
    constructor(http: Http);
    /**
     * Post json utility to send post request to pulse server. But this will not unwrap the response body
     * @param relativeUrl Relative url for the REST api to send request to
     * @param body Payload to be sent as part of post request
     */
    postJsonWithNakedResponse(relativeUrl: string, body: any): Observable<any>;
    /**
     * Post json utility to send post request to pulse server
     *
     * @param {string} relativeUrl Relative url for the REST api to send request to
     *
     * @param {any} body Payload to be sent as part of post request
     *
     * @return {Promise<any>}
     *
     */
    postJson(relativeUrl: string, body: any): Promise<any>;
    /**
     * Get json utility to send get request to pulse server
     *
     * @param {string} relativeUrl Relative url for the REST api to send request to
     *
     * @param {any} params Payload to be sent as params with the request
     *
     * @return {Promise<any>}
     *
     */
    getJson(relativeUrl: string, params: any): Promise<any>;
    /**
     * Set hostname for the remote pulse server for making requests to
     *
     * @param {string} hostname Hostname of the remote pulse server
     */
    setHostName(hostname: string): void;
}
