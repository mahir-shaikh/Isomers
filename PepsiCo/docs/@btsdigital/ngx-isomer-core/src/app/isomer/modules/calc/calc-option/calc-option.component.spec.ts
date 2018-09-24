import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SimpleChange, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CalcOptionComponent } from './calc-option.component';

import { CalcService } from '../calc.service';
import { TextService } from '../../text-engine/text.service';

import { CalcServiceStub } from '../../../test/calc-service.stub';
import { TextServiceStub } from '../../../test/text-service.stub';
import { Observable } from 'rxjs/Observable';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { Constants } from '../../../config/constants';
import { LoggerService } from '../../services/logger/logger.service';


describe('CalcOptionComponent', () => {
    let component: CalcOptionComponent;
    let fixture: ComponentFixture<CalcOptionComponent>;
    let calcService: CalcServiceStub;
    let textService: TextServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [CalcOptionComponent],
            providers: [
                CommunicatorService, LoggerService,
                { provide: CalcService, useClass: CalcServiceStub },
                { provide: TextService, useClass: TextServiceStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalcOptionComponent);

        component = fixture.componentInstance;
        // radio buttons to be displayed
        component.items = ['NavigationMainLink3SubLink1', 'NavigationMainLink3SubLink2', 'NavigationMainLink3SubLink3'];
        component.ref = 'test';

        calcService = TestBed.get(CalcService);
        calcService.setValue('test', 1);

        textService = TestBed.get(TextService);
        textService.textContent.GEN = {
            'NavigationMainLink3SubLink1': 'CRM',
            'NavigationMainLink3SubLink2': 'HCM',
            'NavigationMainLink3SubLink3': 'Futuria',
            'NavigationMainLink4SubLink1': 'Profit and Loss'
        };
        textService.isReady = true;

        // spyOn(calcService, 'getObservable').and.returnValue({ subscribe: () => { } });

        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();

        const selectedItem = calcService.getValue('test', true) as any;
        expect(selectedItem).toBe(1);
        component.items.push('tlInputTest');
        calcService.setValue('tlInputTest', 'test123');
        const itemName = calcService.getValue('tlInputTest') as any;
        expect(itemName).toBe('test123');
    });

    it('should change selectedItem on radio selection change', () => {
        // find and click a radio button
        const radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
        radios[2].triggerEventHandler('click', {});

        const change = new SimpleChange(1, 2, false);
        component.ngOnChanges({ change });

        let selectedItem = calcService.getValue('test', true) as any;
        fixture.detectChanges();
        expect(selectedItem).toBe(2);

        component.yearRef = 'testYear';
        calcService.setValue('testYear', 2018);
        fixture.detectChanges();

        radios[0].triggerEventHandler('click', {});
        component.ngOnChanges({ change });

        selectedItem = calcService.getValueForYear('test_R2018') as any;
        fixture.detectChanges();
        expect(selectedItem).toBe(0);
    });

    it('should update radio list if Inputs are changed', () => {
        // push new radio button
        component.items.push('NavigationMainLink4SubLink1');

        const change = new SimpleChange(1, 2, false);
        component.ngOnChanges({ change });

        fixture.detectChanges();

        let radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
        radios[3].triggerEventHandler('click', {});

        expect(radios.length).toBe(4);

        let selectedItem = calcService.getValue('test', true) as any;
        expect(selectedItem).toBe(3);

        fixture.detectChanges();

        // run 2 - remove two radio buttons
        component.items.splice(2, 3);
        component.ngOnChanges({ change });

        fixture.detectChanges();

        radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
        radios[0].triggerEventHandler('click', {});


        fixture.detectChanges();

        expect(radios.length).toBe(2);

        selectedItem = calcService.getValue('test', true) as any;
        expect(selectedItem).toBe(0);
    });

    it('should call processItems and processSelectedItem when calc-model is updated', fakeAsync(() => {
        const commService: CommunicatorService = TestBed.get(CommunicatorService);
        spyOn(component, 'processItems').and.callThrough();
        spyOn(component, 'processSelectedItem').and.callThrough();

        commService.trigger(Constants.MODEL_CALC_COMPLETE);
        component.ngOnInit();
        tick();
        expect(component.processItems).toHaveBeenCalledTimes(2);
        expect(component.processSelectedItem).toHaveBeenCalledTimes(2);

    }));
});
