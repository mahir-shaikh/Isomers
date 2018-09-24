import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { CalcCheckboxComponent } from './calccheckbox';

import { CalcService } from '@btsdigital/ngx-isomer-core';
import { CalcServiceStub } from '../../../test/calc-service.stub';

describe('CalcCheckboxComponent', () => {
    let component: CalcCheckboxComponent;
    let fixture: ComponentFixture<CalcCheckboxComponent>;
    let calcService: CalcServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [CalcCheckboxComponent],
            providers: [
                { provide: CalcService, useClass: CalcServiceStub }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalcCheckboxComponent);

        component = fixture.componentInstance;
        component.ref = 'test';

        calcService = TestBed.get(CalcService);
        calcService.setValue('test', true);

        spyOn(calcService, 'getObservable').and.returnValue({ subscribe: () => { } });

        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
        expect(component.value).toBeTruthy();
    });

    it('should uncheck on click', () => {
        // find and click the checkbox
        const checkBox = fixture.debugElement.query(By.css('input'));
        checkBox.triggerEventHandler('click', {});

        fixture.detectChanges();

        expect(component.value).toBeFalsy();
    });
});
