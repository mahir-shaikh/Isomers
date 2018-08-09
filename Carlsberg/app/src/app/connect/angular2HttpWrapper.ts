import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { ManifestService } from './manifest.service'
import 'rxjs/add/operator/toPromise';

/// <reference path="./definitions.d.ts"/>

@Injectable()
export class Angular2HttpWrapper implements Connect.HttpWrapper{

  private hostname: string
  constructor(private http: Http, private manifestService: ManifestService) {
    this.hostname = manifestService.Get().config.hostName
  }

  postJson(relativeUrl: String, body): Promise<any> {
    let req = this.http.post(this.hostname + relativeUrl, body, { withCredentials: true})

    return req.toPromise().then(this.unwrapBody)
  }

  getJson(relativeUrl: String, params): Promise<any> {
    let req = this.http.get(this.hostname + relativeUrl + (params ? '?' + params : ''), { withCredentials: true})

    return req.toPromise()
  }

  unwrapBody(response: Response) {
    return response.json()
  }
}