import { TestBed, inject } from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
  });

  it('should be created', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to log to console', inject([LoggerService], (service: LoggerService) => {
    const spy = spyOn(window.console, 'log').and.callThrough();
    // expect(service).toBeTruthy();
    service.log('message');

    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.mostRecent().args[0]).toBe('message');

    service.log('message', 'two', 'three');

    expect(spy.calls.count()).toBe(2);
    expect(spy.calls.mostRecent().args[0]).toBe('message');
    expect(spy.calls.mostRecent().args[1][0]).toBe('two');
    expect(spy.calls.mostRecent().args[1][1]).toBe('three');

    service.enableLogging(false);
    service.log('message');
    expect(spy.calls.count()).toBe(2);

    service.enableLogging(true);
    service.log('message');
    expect(spy.calls.count()).toBe(3);
  }));
});
