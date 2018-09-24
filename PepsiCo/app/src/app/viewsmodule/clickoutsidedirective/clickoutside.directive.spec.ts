import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './clickoutside.directive';


@Component({
    template: `
    <div id='outside'>
       <!-- Outer Div -->
        <div id="inside" (click)="openMenu()">
          <!-- Inner Div -->
          <div id="container" ismaClickOutside [clickOutActive]="showMenu" (clickOutside)="closeMenu()">
            <span *ngIf="showMenu;else otherContent"> Click Inside </span>
            <ng-template #otherContent> Click Outside </ng-template>
          </div>
        </div>
     </div>
    `
})
class TestClickOutSideComponent {
    showMenu: boolean = false;
    closeMenu() {
        this.showMenu = false;
    }

    openMenu() {
        this.showMenu = true;
    }

}

describe('Directive: ClickOutSide & ClickInSide', () => {

    let component: TestClickOutSideComponent;
    let fixture: ComponentFixture<TestClickOutSideComponent>;
    let el: HTMLElement;
    let insideDiv: HTMLElement;
    let outsideDiv: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestClickOutSideComponent, ClickOutsideDirective]
        });

        fixture = TestBed.createComponent(TestClickOutSideComponent);
        component = fixture.componentInstance;

        outsideDiv = fixture.debugElement.query(By.css('#outside')).nativeElement;

        insideDiv = fixture.debugElement.query(By.css('#inside')).nativeElement;

        el = fixture.debugElement.query(By.css('#container')).nativeElement;
    });

    it('Click OutSide', () => {
        // Page initialize
        fixture.detectChanges();
        expect(el.textContent).toContain('Click Outside');

        // Click inside div
        insideDiv.click();
        fixture.detectChanges();
        expect(el.textContent).toContain('Click Inside');

        // Click Outside div
        outsideDiv.click();
        fixture.detectChanges();
        expect(el.textContent).toContain('Click Outside');

    });
});
