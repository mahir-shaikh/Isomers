import { TestBed, inject } from '@angular/core/testing';
//import { AppConfig } from '../../app.config';
import { GatewayService } from './gateway.service';
import { HttpModule, Http, ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {} from 'jasmine';

class FakeHttpService {
  get(param: any) {
    var response = {
      deliveries: [],
      success: true,
      errorMessage: null,
      configuration: ''
    }

    return Observable.from([new Response(new ResponseOptions({ body: response }))]);
  };

  
}

describe('GatewayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GatewayService,
       { provide: Http, useClass: FakeHttpService },]
    });
  });

  it('should ...', inject([GatewayService], (service: GatewayService) => {
    expect(service).toBeTruthy();
  }));
});
