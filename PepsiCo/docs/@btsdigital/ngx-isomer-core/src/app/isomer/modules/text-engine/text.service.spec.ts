import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, XHRBackend, RequestMethod, BaseRequestOptions, Response, ResponseOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { CalcService, CommunicatorService, LoggerService } from '../../index';
import { CalcServiceStub } from '../../test/calc-service.stub';
import { TextService } from './text.service';

// let service: TextService;
const mockResponse = {'scenes': [{
    'ID': 'GEN',
    'SubTitlePart1': 'Sub Title',
    'TeamName': 'Team Name',
    'TeamName_R1': 'Team Name R1',
    'TeamNumber': 'Team Number',
    'Title': 'Demo App'
  }]};

describe('TextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ { provide: XHRBackend, useClass: MockBackend},
        TextService, CommunicatorService, LoggerService,
        { provide: CalcService, useClass: CalcServiceStub}
      ]
    });
  });

  it('should be created', inject([TextService], (service: TextService) => {
    expect(service).toBeTruthy();
    // service should be not ready when loaded first
    expect(service.isApiReady).toBeFalsy();
  }));

  it('should be able to get text values from loaded json', fakeAsync(inject([TextService, XHRBackend],
    (service: TextService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    // const url;
    const calcService: CalcServiceStub = TestBed.get(CalcService);
    calcService.apiReady = true;
    calcService.setValue('xxYear', '1');

    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(
        new ResponseOptions({ body: mockResponse})));
    });
    service.language = 'en';
    service.init();
    tick();
    expect(service.isApiReady).toBe(true);

    // const title = service.getText('Title');
    expect(service.getText('Title')).toBe('Demo App');

    expect(service.getTextForYear('TeamName', undefined)).toBe('Team Name');

    expect(service.getTextForYear('TeamName', 'xxYear')).toBe('Team Name R1');

    const scene = service.getScene('GEN');
    expect(scene.getValue('ID')).toBe('GEN');

    const sceneIds = service.getSceneIds();
    expect(sceneIds.length).toBe(1);
    expect(sceneIds[0]).toBe('GEN');

  })));

  it('should be able to handle errors', fakeAsync(inject([TextService, XHRBackend],
    (service: TextService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    // const url;
    const calcService: CalcServiceStub = TestBed.get(CalcService);
    calcService.apiReady = true;
    calcService.setValue('xxYear', '1');

    let subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(
        new ResponseOptions({ body: mockResponse})));
    });
    service.init();
    tick();
    subscription.unsubscribe();

    subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockError(new Error('Cannot download'));
    });
    service.loadLanguage(null)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((err) => {
        expect(err).toBeDefined();
      });
    tick();
    service.loadLanguage('en')
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((err) => {
        expect(err).toBeDefined();
      });
    tick();
  })));


});
