import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ViewsModule } from '../viewsmodule/views.module';
// import { ConnectModule } from '../connect/connect.module';
import { Utils, APP_READY } from '../utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { ExternalModule } from '../shared/external-module/external-module.module';
// import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';
import { SharedModule } from '../shared/shared.module';
import { ConnectModule } from '@btsdigital/ngx-isomer-core';
import { DataStore } from '../utils/datastore';
import { Observable } from 'rxjs/Observable';

describe('App', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let dataStoreServie: DataStore;
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [AppComponent],
                imports: [CommonModule, FormsModule, HttpModule, RouterModule, ConnectModule, ViewsModule, routing, ExternalModule, SharedModule],
                providers: [DataStore, Utils]
            }
        ).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        dataStoreServie = TestBed.get(DataStore);
    });
    it('should work', () => {
        expect(component).toBeTruthy();
    });


});
