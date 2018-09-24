import { Observable } from 'rxjs/Observable';


export class HttpWrapperServiceStub {
  postJsonWithNakedResponse(relativeUrl: string, body: any): Observable<any> {
    return Observable.empty<Response>();
  }
  postJson(relativeUrl: string, body: any): Promise<any> {
    return Promise.resolve({});
  }

  getJson(relativeUrl: string, params): Promise<any> {
    return Promise.resolve({});
  }

  setHostName(hostname: string) {
    // do nothing
  }
}
