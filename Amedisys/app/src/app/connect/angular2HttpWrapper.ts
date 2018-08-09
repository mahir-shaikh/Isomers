import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { ManifestService } from './manifest.service'
import 'rxjs/add/operator/toPromise';

/// <reference path="./definitions.d.ts"/>

@Injectable()
export class Angular2HttpWrapper implements Connect.HttpWrapper{

  private hostname: string;
  constructor(private http: Http, private manifestService: ManifestService) {
    this.hostname = manifestService.Get().config.hostName
  }

  postJson(relativeUrl: string, body): Promise<any> {
    let req = this.http.post(this.hostname + relativeUrl, body, { withCredentials: true});

    return req.toPromise().then(Angular2HttpWrapper.unwrapBody)
  }

  getJson(relativeUrl: string, params): Promise<any> {
    let req = this.http.get(this.hostname + relativeUrl + (params ? '?' + params : ''), { withCredentials: true});

    return req.toPromise()
  }

  private static unwrapBody(response: Response) {
    try {
      return response.json()
    }
    catch(e) {
      return null;
    }
  }
}