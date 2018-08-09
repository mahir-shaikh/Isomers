import {Component, OnInit} from '@angular/core';
import { SyncStatusService, SyncStatus } from '../syncStatus.service';
import { SyncService } from '../sync.service'
import { CalcService } from '../../calcmodule/calc.service';

@Component({
    selector: 'sync-status',
    templateUrl: './sync.component.html',
    styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {
    constructor(private syncStatusService: SyncStatusService, private syncService: SyncService, private calcService: CalcService) {}

    public statusName: string;
    public statusMessage: string;
    public lastStatus: any;

    private status: SyncStatus = SyncStatus.OutOfSync;
    private statusLookup = {
      'InSync': 'In Sync',
      'OutOfSync': 'Out of sync',
      'SyncError': 'Synchronization error',
      'NetworkError': 'Network error (failed to connect to server)',
      'Syncing': 'Synchronizing'
    };

    ForceSync() {
        this.syncService.Download();
        this.syncService.Upload();
        this.calcService.saveStateToStorage();
    }

    ngOnInit() {
        this.syncStatusService.AggregatedStatus.subscribe((status: SyncStatus) => {
            this.status = status;
            this.statusName = SyncStatus[status]; //Lookup the text value from the enum.
            this.statusMessage = this.statusLookup[this.statusName];
        });

        this.syncStatusService.LastSyncTime.subscribe((timestamp) => {
            if(timestamp != null) {
                this.lastStatus = "Last successful sync: " + timestamp.format("HH:mm:ss");
            } else {
                this.lastStatus = "No successful syncs yet";
            }
        });
    }
}
