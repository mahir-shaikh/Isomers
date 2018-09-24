import { SyncStatusService } from './sync-status.service';
import { SyncStatus } from './syncstatus';
import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import * as ConnectInterface from '../interfaces';

describe('SyncStatusService', () => {
    let service: SyncStatusService;


    beforeEach(() => {
        service = new SyncStatusService();
    });

    describe('AggregatedStatus', () => {
        it('shows the highest order aggregated status', fakeAsync(() => {

            let finalStatus: SyncStatus = null;
            service.AggregatedStatus.subscribe((status) => {
                finalStatus = status;
            });

            service.SetDownloadStatus(SyncStatus.SyncError);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.SyncError);

            service.SetStatus(SyncStatus.Syncing);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.Syncing);

            service.SetModelStateStatus(SyncStatus.InSync);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.Syncing);

            service.SetStatus(SyncStatus.InSync);
            service.SetDownloadStatus(SyncStatus.InSync);
            service.SetModelStateStatus(SyncStatus.SyncError);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.SyncError);

            service.SetStatus(SyncStatus.InSync);
            service.SetDownloadStatus(SyncStatus.InSync);
            service.SetModelStateStatus(SyncStatus.OutOfSync);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.OutOfSync);

            service.SetStatus(SyncStatus.NetworkError);
            service.SetDownloadStatus(SyncStatus.InSync);
            service.SetModelStateStatus(SyncStatus.SyncError);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.NetworkError);

            service.SetStatus(SyncStatus.NetworkError);
            service.SetStatus(SyncStatus.InSync);
            service.SetModelStateStatus(SyncStatus.Syncing);
            tick(1);
            expect(finalStatus).toEqual(SyncStatus.Syncing);
        }));
    });

});
