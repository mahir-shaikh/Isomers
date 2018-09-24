import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalcServiceStub } from '../test/calc-service.stub';
import { CalcService } from '../modules/calc/calc.service';
import { CommunicatorService } from '../modules/services/communicator/communicator.service';
import { LoggerService } from '../modules/services/logger/logger.service';
import { StorageService } from '../modules/services/storage/storage.service';
import { NumberFormattingPipe } from '../modules/services/number-formatting/number-formatting.pipe';
import { HttpWrapperService } from '../modules/connect/httpwrapper/http-wrapper.service';

import { Stepper } from './stepper';
import { CalcStepperComponent } from '../modules/calc/calc-stepper/calc-stepper.component';

describe('Stepper', () => {

    let component: CalcStepperComponent;
    let fixture: ComponentFixture<CalcStepperComponent>;
    let calcservice: CalcServiceStub;
    let stepper: Stepper;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule, HttpModule],
            declarations: [CalcStepperComponent, NumberFormattingPipe],
            providers: [
                CommunicatorService,
                LoggerService, HttpWrapperService,
                StorageService, NumberFormattingPipe,
                { provide: CalcService, useClass: CalcServiceStub }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CalcStepperComponent);
        component = fixture.componentInstance;
        calcservice = TestBed.get(CalcService);

        calcservice.setValue('test', 123);
        component.ref = 'test';
        component.min = 10;
        component.max = 1000;
        component.outputMin = 10;
        component.outputMax = 1000;
        fixture.detectChanges();

        component.ngOnInit();
        stepper = new Stepper().bindAll({ max: 1000, min: 10, validator: component.getValidator() });
    });

    it('should be initialize with correct values', () => {
        expect(Number(stepper.stepper.field.value)).toBe(123);
        expect(stepper.min).toBe(10);
        expect(stepper.max).toBe(1000);
    });

    it('should be update min and max value on updateMinMax call', () => {
        stepper.updateMinMax(20, 500);

        expect(stepper.min).toBe(20);
        expect(stepper.max).toBe(500);
    });

    it('should assign correct min/max values if input is out of bounds', () => {
        stepper.start(new Event('keyup'), true);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('124');

        stepper.start(new Event('keyup'), false);
        stepper.stop();
        stepper.start(new Event('keyup'), false);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('122');

        // run 2
        stepper.stepper.field.value = '0';
        fixture.detectChanges();

        stepper.start(new Event('keyup'), false);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('10');

        // run 3
        stepper.stepper.field.value = '0';
        calcservice.setValue('test', 1);
        fixture.detectChanges();

        stepper.start(new Event('keyup'), false);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('10');

        // run 4
        stepper.stepper.field.value = '1500';
        fixture.detectChanges();

        stepper.start(new Event('keyup'), true);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('1000');

        // run 5
        stepper.stepper.field.value = '1200';
        calcservice.setValue('test', 1200);
        fixture.detectChanges();

        stepper.start(new Event('keyup'), true);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('1000');

        // run 6
        stepper.stepper.field.value = '-1';
        stepper.amount = -1;
        calcservice.setValue('test', 123);
        fixture.detectChanges();

        stepper.start(new Event('keyup'), true);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('-1');

        // run 7
        stepper.stepper.field.value = '';
        fixture.detectChanges();

        stepper.start(new Event('keyup'), true);
        stepper.stop();

        expect(stepper.stepper.field.value).toBe('1');
    });

    it('should initialize with empty functions if not passed', () => {
        stepper = new Stepper().bindAll({ max: 1000, min: 10 });
        fixture.detectChanges();

        expect(Number(stepper.stepper.field.value)).toBe(123);

        stepper = new Stepper().bindAll();
        fixture.detectChanges();

        expect(stepper.min).toBe(undefined);
    });

});
