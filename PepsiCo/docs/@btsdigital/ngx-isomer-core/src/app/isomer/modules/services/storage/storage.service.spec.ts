import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, RequestMethod, XHRBackend, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { StorageService } from './storage.service';
import { LoggerService } from '../logger/logger.service';
import { HttpWrapperService } from '../../connect/httpwrapper/http-wrapper.service';
// import { HttpWrapperServiceStub } from '../../../test/http-wrapper-service.stub';
import { Constants } from '../../../config/constants';

let httpWrapper: HttpWrapperService;
const hostName = 'http://local.bts.com';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [StorageService, LoggerService, HttpWrapperService, { provide: XHRBackend, useClass: MockBackend }]
    });

    httpWrapper = TestBed.get(HttpWrapperService);

    httpWrapper.setHostName(hostName);
  });

  it('should be created', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to set data to local storage when mode set to local', fakeAsync(inject([StorageService], (service: StorageService) => {
    // expect(service).toBeTruthy();
    service.setMode(Constants.STORAGE_MODES.LOCAL);
    const data = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
      },
      setValueSpy = spyOn(service, 'setValue').and.callThrough(),
      getValueSpy = spyOn(service, 'getValue').and.callThrough();

    Object.keys(data)
      .forEach(key => {
        service.setValue(key, data[key]);
      });
    expect(service.getMode()).toBe(Constants.STORAGE_MODES.LOCAL);
    expect(setValueSpy.calls.count()).toBe(5);
    let value;

    service.getValue('key1').then(val => value = val);
    tick();

    expect(value).toBe('value1');

    service.setValue('key1', 'modifiedValue1');

    service.getValue('key1').then(val => value = val);
    tick();

    expect(value).toBe('modifiedValue1');

    service.forceSync()
      .then(() => {
        expect(setValueSpy.calls.count()).toBe(11);
      });
    tick();

    service.clear('key1')
      .then(() => {
        service.getValue('key1').then(val => value = val);
        tick();
        expect(value).toBeNull();
      });
    tick();

    service.forceSync()
      .then(() => {
        expect(setValueSpy.calls.count()).toBe(15);
      });
    tick();

    expect(getValueSpy.calls.count()).toBe(3);

    service.clearAll()
      .then(() => {
        service.getValue('key2').then(val => value = val);
        expect(value).toBeNull();
      });
    tick();

    service.forceSync();
    tick();

    expect(setValueSpy.calls.count()).toBe(15);
  })));

  it('should be able to set data to pulse storage when mode set to Pulse',
    fakeAsync(inject([StorageService, XHRBackend], (service: StorageService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    service.setMode(Constants.STORAGE_MODES.PULSE);
    let callType: any;
    const data = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: 'value5'
    },
    setValueBackup = service.setValue,
    getValueBackup = service.getValue,
    clearKeyBackup = service.clear,
    clearAllBackup = service.clearAll,
    REQUEST_TYPE = {
      GET_VALUE: 0,
      SET_VALUE: 1,
      CLEAR_KEY: 2,
      CLEAR_ALL: 3
    },
    setValueSpy = spyOn(service, 'setValue').and.callFake((...args) => {
      callType = REQUEST_TYPE.SET_VALUE;
      return setValueBackup.apply(service, args);
    }),
    getValueSpy = spyOn(service, 'getValue').and.callFake((...args) => {
      callType = REQUEST_TYPE.GET_VALUE;
      return getValueBackup.apply(service, args);
    }),
    clearSpy = spyOn(service, 'clear').and.callFake((...args) => {
      callType = REQUEST_TYPE.CLEAR_KEY;
      return clearKeyBackup.apply(service, args);
    }),
    clearAllSpy = spyOn(service, 'clearAll').and.callFake((...args) => {
      callType = REQUEST_TYPE.CLEAR_ALL;
      return clearAllBackup.apply(service, args);
    });

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (callType === REQUEST_TYPE.SET_VALUE) {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.withCredentials).toBe(true);
        expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.SET_VALUE);
        const params = JSON.parse(connection.request.getBody()),
          keys = Object.keys(data);
        expect(keys.indexOf(params.key)).toBeGreaterThan(-1);
        data[params.key] = params.value;
        connection.mockRespond(new Response(new ResponseOptions({body: {success: true}})));
      } else if (callType === REQUEST_TYPE.GET_VALUE) {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.withCredentials).toBe(true);
        const pattern: RegExp = /^.+?key=(.+)$/,
          matches = pattern.exec(connection.request.url),
          key = matches[1];
        expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.GET_VALUE + '?key=' + key);
        connection.mockRespond(new Response(new ResponseOptions({body: '"' + data[key] + '"'})));
      } else if (callType === REQUEST_TYPE.CLEAR_KEY || callType === REQUEST_TYPE.CLEAR_ALL) {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.withCredentials).toBe(true);
        const params = JSON.parse(connection.request.getBody());
        connection.mockRespond(new Response(new ResponseOptions({body: {success: true}})));
        if (params.key) {
          expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.CLEAR_KEY);
          data[params.key] = '';
        } else {
          expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.CLEAR_CACHE);
          Object.keys(data).forEach(key => data[key] = '');
        }
      }
    });

    Object.keys(data)
      .forEach(key => {
        service.setValue(key, data[key]);
      });
    tick();
    expect(service.getMode()).toBe(Constants.STORAGE_MODES.PULSE);
    expect(setValueSpy.calls.count()).toBe(5);
    let value;

    service.getValue('key1').then(val => value = val);
    tick();

    expect(value).toBe('value1');


    service.getValue('key1', true).then(val => value = val);
    tick();

    expect(value).toBe('value1');

    service.setValue('key1', 'modifiedValue1');
    tick();
    service.getValue('key1').then(val => value = val);
    tick();

    expect(value).toBe('modifiedValue1');

    service.forceSync()
      .then(() => {
        expect(setValueSpy.calls.count()).toBe(11);
      });
    tick();

    service.clear('key1')
      .then(() => {
        service.getValue('key1').then(val => value = val);
        tick();
        expect(value).toBeNull();
      });
    tick();

    service.forceSync()
      .then(() => {
        expect(setValueSpy.calls.count()).toBe(15);
      });
    tick();

    expect(getValueSpy.calls.count()).toBe(4);

    service.clearAll()
      .then(() => {
        service.getValue('key2').then(val => value = val);
        expect(value).toBeNull();
      });
    tick();

    service.forceSync();
    tick();

    expect(setValueSpy.calls.count()).toBe(15);
  })));

  it('should be able to set data to local & pulse storage when mode set to Mixed',
    fakeAsync(inject([StorageService, XHRBackend], (service: StorageService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    service.setMode(Constants.STORAGE_MODES.MIXED);
    let callType: any;
    const data = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: 'value5'
    },
    setValueBackup = service.setValue,
    getValueBackup = service.getValue,
    clearKeyBackup = service.clear,
    clearAllBackup = service.clearAll,
    REQUEST_TYPE = {
      GET_VALUE: 0,
      SET_VALUE: 1,
      CLEAR_KEY: 2,
      CLEAR_ALL: 3
    },
    setValueSpy = spyOn(service, 'setValue').and.callFake((...args) => {
      callType = REQUEST_TYPE.SET_VALUE;
      return setValueBackup.apply(service, args);
    }),
    getValueSpy = spyOn(service, 'getValue').and.callFake((...args) => {
      callType = REQUEST_TYPE.GET_VALUE;
      return getValueBackup.apply(service, args);
    }),
    clearSpy = spyOn(service, 'clear').and.callFake((...args) => {
      callType = REQUEST_TYPE.CLEAR_KEY;
      return clearKeyBackup.apply(service, args);
    }),
    clearAllSpy = spyOn(service, 'clearAll').and.callFake((...args) => {
      callType = REQUEST_TYPE.CLEAR_ALL;
      return clearAllBackup.apply(service, args);
    });

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (callType === REQUEST_TYPE.SET_VALUE) {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.withCredentials).toBe(true);
        expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.SET_VALUE);
        const params = JSON.parse(connection.request.getBody()),
          keys = Object.keys(data);
        expect(keys.indexOf(params.key)).toBeGreaterThan(-1);
        data[params.key] = params.value;
        connection.mockRespond(new Response(new ResponseOptions({body: {success: true}})));
      } else if (callType === REQUEST_TYPE.GET_VALUE) {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.withCredentials).toBe(true);
        const pattern: RegExp = /^.+?key=(.+)$/,
          matches = pattern.exec(connection.request.url),
          key = matches[1];
        expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.GET_VALUE + '?key=' + key);
        connection.mockRespond(new Response(new ResponseOptions({body: '"' + data[key] + '"'})));
      } else if (callType === REQUEST_TYPE.CLEAR_KEY || callType === REQUEST_TYPE.CLEAR_ALL) {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.withCredentials).toBe(true);
        const params = JSON.parse(connection.request.getBody());
        connection.mockRespond(new Response(new ResponseOptions({body: {success: true}})));
        if (params.key) {
          expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.CLEAR_KEY);
          data[params.key] = '';
        } else {
          expect(connection.request.url).toBe(hostName + Constants.PULSE_API.CALCBINDER.CLEAR_CACHE);
          Object.keys(data).forEach(key => data[key] = '');
        }
      }
    });

    Object.keys(data)
      .forEach(key => {
        service.setValue(key, data[key]);
      });
    tick();
    expect(service.getMode()).toBe(Constants.STORAGE_MODES.MIXED);
    expect(setValueSpy.calls.count()).toBe(5);
    let value;

    service.getValue('key1').then(val => value = val);
    tick();

    expect(value).toBe('value1');


    service.getValue('key1', true).then(val => value = val);
    tick();

    expect(value).toBe('value1');

    service.setValue('key1', 'modifiedValue1');
    tick();
    service.getValue('key1').then(val => value = val);
    tick();

    expect(value).toBe('modifiedValue1');

    service.forceSync()
      .then(() => {
        expect(setValueSpy.calls.count()).toBe(11);
      });
    tick();

    service.clear('key1')
      .then(() => {
        service.getValue('key1').then(val => value = val);
        tick();
        expect(value).toBeNull();
      });
    tick();

    service.forceSync()
      .then(() => {
        expect(setValueSpy.calls.count()).toBe(15);
      });
    tick();

    expect(getValueSpy.calls.count()).toBe(4);

    service.clearAll()
      .then(() => {
        service.getValue('key2').then(val => value = val);
        expect(value).toBeNull();
      });
    tick();

    service.forceSync();
    tick();

    expect(setValueSpy.calls.count()).toBe(15);
  })));

  it('should handle http errors', fakeAsync(inject([StorageService, XHRBackend],
    (service: StorageService, mockBackend: MockBackend) => {
    // expect(service).toBeTruthy();
    service.setMode(Constants.STORAGE_MODES.MIXED);
    let callType: any;
    const data = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: 'value5'
    },
    setValueBackup = service.setValue,
    getValueBackup = service.getValue,
    clearKeyBackup = service.clear,
    clearAllBackup = service.clearAll,
    REQUEST_TYPE = {
      GET_VALUE: 0,
      SET_VALUE: 1,
      CLEAR_KEY: 2,
      CLEAR_ALL: 3
    },
    setValueSpy = spyOn(service, 'setValue').and.callFake((...args) => {
      callType = REQUEST_TYPE.SET_VALUE;
      return setValueBackup.apply(service, args);
    }),
    getValueSpy = spyOn(service, 'getValue').and.callFake((...args) => {
      callType = REQUEST_TYPE.GET_VALUE;
      return getValueBackup.apply(service, args);
    }),
    clearSpy = spyOn(service, 'clear').and.callFake((...args) => {
      callType = REQUEST_TYPE.CLEAR_KEY;
      return clearKeyBackup.apply(service, args);
    }),
    clearAllSpy = spyOn(service, 'clearAll').and.callFake((...args) => {
      callType = REQUEST_TYPE.CLEAR_ALL;
      return clearAllBackup.apply(service, args);
    });

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (callType === REQUEST_TYPE.SET_VALUE) {
        connection.mockError(new Error('Cannot set value on server'));
      } else if (callType === REQUEST_TYPE.GET_VALUE) {
        connection.mockError(new Error('Cannot get value from server'));
      } else if (callType === REQUEST_TYPE.CLEAR_KEY || callType === REQUEST_TYPE.CLEAR_ALL) {
        connection.mockError(new Error('Cannot clear storage'));
      }
    });

    let counter = 0;
    service.setValue('key1', 'newValue')
      .then(() => {
        expect(false).toBe(true); // fail
      })
      .catch(err => {
        counter++;
        expect(true).toBe(true);
        expect(err.message).toBe('Cannot set value on server');
      });
    tick();
    service.getValue('key1', true)
      .then(() => {
        expect(true).toBe(true); // pass - because we fallback to localStorage to get the value in MM
      })
      .catch(err => {
        counter++;
        expect(true).toBe(true); // fail
        expect(err.message).toBe('Cannot get value from server');
      });
    tick();
    service.clear('key1')
      .then(() => {
        expect(false).toBe(true); // fail
      })
      .catch(err => {
        counter++;
        expect(true).toBe(true); // pass
      });
    tick();
    service.clearAll()
      .then(() => {
        expect(false).toBe(true); // fail
      })
      .catch(err => {
        counter++;
        expect(true).toBe(true); // pass
      });
    tick();
    expect(counter).toEqual(3); // check all test went to catch block
  })));
});
