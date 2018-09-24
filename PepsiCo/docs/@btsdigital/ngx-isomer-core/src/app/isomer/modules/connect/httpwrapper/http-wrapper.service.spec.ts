import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, XHRBackend, BaseRequestOptions, Response, ResponseOptions, Http, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { HttpWrapperService } from './http-wrapper.service';
import { HttpWrapperServiceStub } from '../../../test/http-wrapper-service.stub';

describe('HttpWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ HttpWrapperService, { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  it('should be created', inject([HttpWrapperService], (service: HttpWrapperService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to postJson',
    fakeAsync(inject([HttpWrapperService, XHRBackend], (service: HttpWrapperService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    const requestBody = {
        votesJson: JSON.stringify({
          votes: [
            { questionId: 1, responseText: 'Mock response'}
          ]
        })
      },
      relativeUrl = '/Wizer/CloudFront/VoteManyQuestionsFromJson',
      hostName = 'http://local.bts.com';
    service.setHostName(hostName);

    mockBackend.connections.subscribe((connection: MockConnection) => {
      const response = connection.mockRespond(new Response(new ResponseOptions({body: {success: true}})));
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.withCredentials).toBe(true);
      expect(connection.request.getBody()).toBeDefined();
      expect(connection.request.url).toBe(hostName + relativeUrl);
    });

    service.postJson(relativeUrl, requestBody);
    tick();

  })));

  it('should be able to postJson but without unwraped body in response',
  fakeAsync(inject([HttpWrapperService, XHRBackend], (service: HttpWrapperService, mockBackend: MockBackend) => {
  // expect(service).toBeTruthy();
  const requestBody = {
      votesJson: JSON.stringify({
        votes: [
          { questionId: 1, responseText: 'Mock response'}
        ]
      })
    },
    relativeUrl = '/Wizer/CloudFront/GetMyModel',
    hostName = 'http://local.bts.com';
  service.setHostName(hostName);

  mockBackend.connections.subscribe((connection: MockConnection) => {
    // var byteArray = new Uint8Array(8);
    // var blob = new Blob([byteArray], { type: 'application/json' });
    const response = connection.mockRespond(new Response(new ResponseOptions({body: {success: true}})));
    expect(connection.request.method).toBe(RequestMethod.Post);
    expect(connection.request.withCredentials).toBe(true);
    expect(connection.request.getBody()).toBeDefined();
    expect(connection.request.url).toBe(hostName + relativeUrl);
  });

  service.postJsonWithNakedResponse(relativeUrl, requestBody);
  tick();

})));

  it('should be able to getJson', fakeAsync(
    inject([HttpWrapperService, XHRBackend], (service: HttpWrapperService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    const responseBody = 'true',
      relativeUrl = '/Wizer/CloudFront/GetCacheValue',
      hostName = 'http://local.bts.com',
      requestOptions = 'key=test';
    service.setHostName(hostName);


    mockBackend.connections.subscribe((connection: MockConnection) => {
      const response = connection.mockRespond(new Response(new ResponseOptions({body: responseBody})));
      const params = '?key=test';
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.withCredentials).toBe(true);
      expect(connection.request.url).toBe(hostName + relativeUrl + params);
    });

    service.getJson(relativeUrl, requestOptions)
      .then((response) => {
        const responseJson = response.json();
        expect(responseJson).toBeDefined();
        expect(responseJson + '').toBe(responseBody);
      });
    tick();

  })));
});
