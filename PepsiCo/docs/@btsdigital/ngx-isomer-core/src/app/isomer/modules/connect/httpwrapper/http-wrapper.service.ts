import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

/**
 * HttpWrapper service used for sending Get/ Post requests to pulse server
 *
 */
@Injectable()
export class HttpWrapperService {
  /**
   * Hostname of the remote pulse server to connect
   *
   */
  private hostname: string = window.location.protocol + '//' + window.location.hostname;

  /**
   * Unwrap function to parse response from pulse server as json data
   *
   * @return {JSON}
   */
  private static unwrapBody(response: Response) {
    try {
      return response.json();
    } catch (e) {
      return null;
    }
  }

  /**
   * Constructor for HttpWrapper service
   *
   * @param {Http} http Angular Http service instance
   */
  constructor(private http: Http) { }

  /**
   * Post json utility to send post request to pulse server. But this will not unwrap the response body
   * @param relativeUrl Relative url for the REST api to send request to
   * @param body Payload to be sent as part of post request
   */
  postJsonWithNakedResponse(relativeUrl: string, body): Observable<any> {
    return this.http.post(this.hostname + relativeUrl, body, { withCredentials: true })
      .map((data) => data)
      .catch((error: any) => error);
  }

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
  postJson(relativeUrl: string, body): Promise<any> {
    const req = this.http.post(this.hostname + relativeUrl, body, { withCredentials: true });

    return req.toPromise().then(HttpWrapperService.unwrapBody);
  }

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
  getJson(relativeUrl: string, params): Promise<any> {
    const req = this.http.get(this.hostname + relativeUrl + (params ? '?' + params : ''), { withCredentials: true });
    return req.toPromise();
  }

  /**
   * Set hostname for the remote pulse server for making requests to
   *
   * @param {string} hostname Hostname of the remote pulse server
   */
  setHostName(hostname: string) {
    this.hostname = hostname;
  }
}
