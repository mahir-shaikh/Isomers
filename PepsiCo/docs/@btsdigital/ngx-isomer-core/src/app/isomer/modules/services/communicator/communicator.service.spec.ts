import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { CommunicatorService } from './communicator.service';
import { LoggerService } from '../logger/logger.service';

let emitterKey: string;

describe('CommunicatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunicatorService, LoggerService]
    });

    emitterKey = 'my_emitter';
  });

  it('should be created', inject([CommunicatorService], (service: CommunicatorService) => {
    expect(service).toBeTruthy();
  }));

  it('should create emitters', fakeAsync(inject([CommunicatorService], (service: CommunicatorService) => {
    // expect(service).toBeTruthy();
    const emitterExistsSpy = spyOn(service, 'emitterExists').and.callThrough();
    const createSpy = spyOn(service, 'createEmitter').and.callThrough();
    const emitter = service.getEmitter(emitterKey);
    const emitterNextSpy = spyOn(emitter, 'next').and.callThrough();
    expect(createSpy.calls.count()).toBe(1);
    expect(emitterExistsSpy.calls.count()).toBe(2);
    service.trigger(emitterKey, 123);
    tick();
    expect(emitterNextSpy.calls.count()).toBe(1);
    emitter.subscribe((data) => {
      expect(true).toBe(true);
      expect(data).toBe(123);
    });
    service.trigger('non_existent_emitter_key', 'value');
    tick();
    expect(emitterExistsSpy.calls.count()).toBe(4);
    expect(emitterExistsSpy.calls.mostRecent().returnValue).toBe(false);

    service.createEmitter(emitterKey);
    expect(emitterExistsSpy.calls.count()).toBe(5);
    expect(emitterExistsSpy.calls.mostRecent().returnValue).toBe(true);
  })));
});
