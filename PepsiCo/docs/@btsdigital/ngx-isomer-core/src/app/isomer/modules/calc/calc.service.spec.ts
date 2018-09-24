import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { CommunicatorService, LoggerService, StorageService } from '../services';
import { StorageServiceStub } from '../../test/storage-service.stub';
import { ModelLoaderService } from '../../../model/model-loader.service';
import { NumberFormatting } from '../../utils/number-formatting';
import { CalcService } from './calc.service';
import { Constants } from '../../config/constants';

let model: any, service: CalcService, modelLoader: ModelLoaderService, originalTimeout: number, storageService: StorageServiceStub;

describe('CalcService', () => {
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      imports: [],
      providers: [LoggerService, CommunicatorService,
        { provide: StorageService, useClass: StorageServiceStub }, CalcService, ModelLoaderService]
    });

    service = TestBed.get(CalcService);
    modelLoader = TestBed.get(ModelLoaderService);
    storageService = TestBed.get(StorageService);
    model = modelLoader.getModel();
  });

  afterEach(() => {
    service = null;
    modelLoader = null;
    model = null;
    storageService.simulateStorageFail(false);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize model using getApi', (done: DoneFn) => {
    service.getApi(model).then((api: CalcService) => {
      expect(service.isApiReady()).toBeTruthy();
      service.destroy();
      done();
    });
  });

  it('should build model only once', (done: DoneFn) => {
    const spy = spyOn(service, 'buildModel').and.callThrough();
    service.getApi(model).then((api) => {
      expect(service).toBeTruthy();
      service.getApi(model)
        .then((_api) => {
          expect(spy.calls.count()).toBe(1);
          service.destroy();
          done();
        });
    });
  });

  it('should be able to get / set / update values in model', (done: DoneFn) => {
    service.getApi(model).then((api: CalcService) => {
      // getValue
      let value: string = service.getValue('tlOutputIFERROR2'),
        numValue = NumberFormatting.format(value, '0.000');
      const saveStateSpy = spyOn(service, 'saveStateToStorage'),
        saveStateDelay = Constants.CALC_SERVICE.SAVE_STATE_TO_STORAGE_DELAY + 100;
      expect(numValue).toBe('0.000');
      // setValue
      service.setValue('xxIndexTeam', '3')
        .then(() => {
          // expect saveStateToStorage to be called once
          value = service.getValue('xxIndexTeam');
          expect(value).toBe('3');
          value = service.getValue('tlOutputIFERROR2');
          numValue = NumberFormatting.format(value, '0.000');
          expect(numValue).toBe('0.000');
          // wait for AuditTime to trigger saveStateToStorage call
          setTimeout(() => {
            expect(saveStateSpy.calls.count()).toBe(2);
            service.destroy();
            done();
          }, saveStateDelay);
        });
    });
  });

  it('should be able to set / fetch values with yearRef ', (done: DoneFn) => {
    service.getApi(model).then((api: CalcService) => {
      const xxYearRef = 'xxYear',
        sampleOutRef = 'tlOutputSample',
        sampleInRef = 'tlInputTest';
      // get value for year 1
      let value = service.getValueForYear(sampleOutRef, xxYearRef),
        inValue = service.getValueForYear(sampleInRef, xxYearRef);

      expect(NumberFormatting.format(value, '0,0')).toBe('123');
      expect(NumberFormatting.format(inValue, '0,0')).toBe('123');

      service.setValueForYear(sampleInRef, '234', xxYearRef)
        .then(() => {
          inValue = service.getValueForYear(sampleInRef, xxYearRef);
          expect(NumberFormatting.format(inValue, '0,0')).toBe('234');
          service.setValue('xxYear', '2')
            .then(() => {
              value = service.getValueForYear(sampleOutRef, xxYearRef);
              inValue = service.getValueForYear(sampleInRef, xxYearRef);
              expect(NumberFormatting.format(value, '0,0')).toBe('456');
              expect(NumberFormatting.format(inValue, '0,0')).toBe('456');
              service.destroy();
              done();
            });
        });
    });
  });

  it('should return observable for subscription', () => {
    expect(service.getObservable()).toBeDefined();
  });

  it('should be able to append data to model', (done: DoneFn) => {
    const modelState = '{"YearRefTest!R5C4":"234","dec!R14C5":"2"}';

    service
      .getApi(model)
      .then(service.appendDataToModel.bind(service, modelState))
      .then(() => {
        const xxYearRef = 'xxYear',
          sampleOutRef = 'tlOutputSample',
          sampleInRef = 'tlInputTest',
          value = service.getValueForYear(sampleOutRef, xxYearRef),
          inValue = service.getValueForYear(sampleInRef, xxYearRef);
        // test for values loaded from model
        expect(NumberFormatting.format(value, '0,0')).toBe('456');
        expect(NumberFormatting.format(inValue, '0,0')).toBe('456');
        service.destroy();
        done();
      });
  });

  it('should be able to load model with state', (done: DoneFn) => {
    const modelState = '{"YearRefTest!R5C4":"234","dec!R14C5":"2"}';

    service
      .getApi(model)
      // pass a model state
      .then(service.setModelState.bind(service, modelState))
      .then(() => {
        const xxYearRef = 'xxYear',
          sampleOutRef = 'tlOutputSample',
          sampleInRef = 'tlInputTest',
          value = service.getValueForYear(sampleOutRef, xxYearRef),
          inValue = service.getValueForYear(sampleInRef, xxYearRef);
        // test for values loaded from model
        expect(NumberFormatting.format(value, '0,0')).toBe('456');
        expect(NumberFormatting.format(inValue, '0,0')).toBe('456');
      })
      // dont pass any state == reset model
      .then(service.setModelState.bind(service))
      .then(() => {
        const xxYearRef = 'xxYear',
          sampleOutRef = 'tlOutputSample',
          sampleInRef = 'tlInputTest',
          value = service.getValueForYear(sampleOutRef, xxYearRef),
          inValue = service.getValueForYear(sampleInRef, xxYearRef);
        // test for values loaded from model
        expect(NumberFormatting.format(service.getValue(xxYearRef), '0,0')).toBe('1');
        expect(NumberFormatting.format(value, '0,0')).toBe('123');
        expect(NumberFormatting.format(inValue, '0,0')).toBe('123');
        service.destroy();
        done();
      });
  });

  it('should be able to trigger events', (done: DoneFn) => {
    service
      .getApi(model)
      .then(() => {
        let value: string = service.getValue('tlOutputIFERROR2'),
          numValue = NumberFormatting.format(value, '0.000');
        expect(numValue).toBe('0.000');
        // setValue
        service.setValue('xxIndexTeam', '3');
        service.getObservable()
          .subscribe(() => {
            expect(true).toBeTruthy();
            value = service.getValue('tlOutputIFERROR2');
            numValue = NumberFormatting.format(value, '0.000');
            expect(numValue).toBe('0.000');
            done();
          });
      });
  });

  it('should call misc helper functions', (done: DoneFn) => {
    service
      .getApi(model)
      .then(() => {
        const spy = spyOn(storageService, 'getValue');
        service.getStateFromStorage();
        expect(spy.calls.count()).toBe(1);
        const exportedData = service.exportData('^tl(In|Out)put.+$', 'i');
        expect(exportedData).toBeDefined({});
        const communicator: CommunicatorService = TestBed.get(CommunicatorService),
          subscriber = communicator.getEmitter(Constants.MODEL_CALC_COMPLETE)
            .subscribe(() => {
              // expect to be called when forceRecalculate is called;
              expect(true).toBeTruthy();
              done();
            });
        service.forceRecalculate();
      });
  });

  it('should check for storage fail', (done: DoneFn) => {
    storageService.simulateStorageFail(true);
    const getApiPromise = service
      .getApi(model)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      })
      .catch((err) => {
        expect(err).toBeDefined();
        done();
      });
  });

  it('should check for bad data merge', (done: DoneFn) => {
    const modelState = '{"YearRef!R5C4:"234","dec!R14C5":"2"}';

    service
      .getApi(model)
      .then(service.appendDataToModel.bind(service, modelState))
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch(err => {
        expect(err).toBeDefined();
        expect(service.isApiReady()).toEqual(true);
        done();
      });
  });

  it('should check for bad data merge', (done: DoneFn) => {
    const modelState = { 'WorksheetNotExist!R5C4': '234', 'dec!R14C5': '2' };

    service
      .getApi(model)
      .then(service.setModelState.bind(service, modelState))
      .then(() => {
        // fail test if then block is called!
        expect(false).toBeTruthy();
        done();
      })
      .catch(err => {
        expect(err).toBeDefined();
        expect(service.isApiReady()).toEqual(true); // since api is ready only bad data could not be loaded
        // fetch raw value
        expect(service.getValue('dec!R14C5', true) + '').toEqual('2');
        done();
      });
  });

  it('should check for bad model inputs for build', fakeAsync(() => {
    let counter = 0;
    service
      .getApi()
      .then(() => {
        // fail test if then block is called!
        expect(false).toBeTruthy();
      })
      .catch(err => {
        counter++;
        expect(err).toBeDefined();
      });
    tick();
    expect(counter).toBe(0);
  }));
});
