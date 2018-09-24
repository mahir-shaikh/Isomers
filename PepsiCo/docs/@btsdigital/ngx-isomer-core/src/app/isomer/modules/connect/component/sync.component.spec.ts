import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SyncStatusService } from '../sync/sync-status.service';
import { SyncStatus } from '../sync/syncstatus';
import { SyncService } from '../sync/sync.service';
import { CalcService } from '../../calc/calc.service';
import { ManifestService } from '../../services/manifest/manifest.service';
import { ConnectThrottlerService } from '../lib/connect-throttler.service';
import { SyncComponent } from './sync.component';
import * as ConnectInterface from '../interfaces';
import { HttpWrapperService } from '../httpwrapper/http-wrapper.service';
import { HttpWrapperServiceStub } from '../../../test/http-wrapper-service.stub';
import { CalcServiceStub } from '../../../test/calc-service.stub';
import { ConnectService } from '../lib/connect.service';
import { JsCalcConnectorService } from '../lib/jscalc-connector.service';
import { SignalRWrapperService } from '../../services/signalrwrapper/signalr-wrapper.service';
// import { HttpWrapperServiceStub } from '../../../test/http-wrapper-service.stub';
import { SignalRWrapperServiceStub } from '../../../test/signalr-wrapper-service.stub';

describe('SyncComponent', () => {

    let component: SyncComponent,
        syncStatusServiceStub: SyncStatusService,
        manifestService: ManifestService,
        manifest: ConnectInterface.Connect.Manifest,
        signalRWrapperServiceStub: SignalRWrapperService;
    let fixture: ComponentFixture<SyncComponent>;
    manifest = {
        config: {
            hostName: 'NotARealHostname',
            eventTitle: 'TakedaBa2',
            questionsToSend: [
                { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2', 'responseText': 'Response' },
                { 'questionName': 'xxRBD1DBM3', 'rangeName': 'xxRBD1DBM3', 'responseText': 'Response' },
            ],
            questionsToReceive: [
                { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2' },
            ],
            foremanquestionsToRecieve: null,
            trackQuestion: null
        }
    };
    beforeEach(async(() => {
        manifestService = new ManifestService();
        manifestService.setConfig(manifest);

        TestBed.configureTestingModule({
            imports: [],
            declarations: [SyncComponent],
            providers: [
                { provide: ManifestService, useValue: manifestService },
                { provide: HttpWrapperService, useClass: HttpWrapperServiceStub },
                { provide: SignalRWrapperService, useClass: SignalRWrapperServiceStub },
                ConnectService,
                SyncStatusService,
                ConnectThrottlerService,
                JsCalcConnectorService,
                SyncService,
                { provide: CalcService, useClass: CalcServiceStub }]
        }).compileComponents();
        syncStatusServiceStub = TestBed.get(SyncStatusService);
        signalRWrapperServiceStub = TestBed.get(SignalRWrapperService);
        spyOn(SyncService, 'reloadWindow');
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SyncComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('check statuses', fakeAsync(() => {
        syncStatusServiceStub.SetStatus(SyncStatus.Syncing);
        tick(1);
        let status = component.GetHighestStatus();
        expect(status).toBe('Syncing');
        syncStatusServiceStub.SetStatus(SyncStatus.OutOfSync);
        tick(1);
        status = component.GetStatusMessage(SyncStatus.OutOfSync);
        expect(status).toBe('Out of sync');
        syncStatusServiceStub.SetStatus(SyncStatus.InSync);
        tick(1);
        status = component.GetStatusMessage(SyncStatus.InSync);
        expect(status).toBe('Out of sync');
        syncStatusServiceStub.SetStatus(SyncStatus.NetworkError);
        tick(1);
        status = component.GetStatusMessage(SyncStatus.NetworkError);
        expect(status).toBe('Network error (failed to connect to server)');
        syncStatusServiceStub.SetStatus(SyncStatus.SyncError);
        tick(1);
        status = component.GetStatusMessage(SyncStatus.SyncError);
        expect(status).toBe('Synchronization error');
        syncStatusServiceStub.SetStatus(SyncStatus.Syncing);
        tick(1);
        status = component.GetStatusMessage(SyncStatus.Syncing);
        expect(status).toBe('Synchronizing');
        syncStatusServiceStub.SetStatus(SyncStatus.Syncing);
        tick(1);
    }));

    it('force sync', fakeAsync(() => {
        syncStatusServiceStub.SetStatus(SyncStatus.Syncing);
        tick(1);
        const syncService = TestBed.get(SyncService);
        spyOn(syncService, 'Download');
        spyOn(syncService, 'Upload');
        const calcService = TestBed.get(CalcService);
        spyOn(calcService, 'saveStateToStorage');
        component.ForceSync();
        expect(syncService.Download).toHaveBeenCalled();
        expect(syncService.Upload).toHaveBeenCalled();
        expect(calcService.saveStateToStorage).toHaveBeenCalled();
    }));

});
