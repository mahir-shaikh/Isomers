import { Component, OnInit } from '@angular/core';
import { SyncStatusService, SyncStatus } from '../syncStatus.service';
import { SyncService } from '../sync.service'
import { CalcService } from '../../calcmodule'

@Component({
    selector: 'sync-status',
    templateUrl: './sync.component.html',
    styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {
    constructor(private syncStatusService: SyncStatusService, private syncService: SyncService, private calcService: CalcService) {}
    public status: SyncStatus;
    public lastStatus: any;
    public statusLookup = {
      'InSync': 'In Sync',
      'OutOfSync': 'Out of sync',
      'SyncError': 'Synchronization error',
      'NetworkError': 'Network error (failed to connect to server)',
      'Syncing': 'Synchronizing'
    }
    public modelStateStatus: SyncStatus;

    ForceSync() {
      this.syncService.Upload();
      this.calcService.saveStateToStorage();
    }

    GetStatusMessage(status: SyncStatus) {
      // Translate first to string SyncStatus, and then get the message.
      //console.log(status, SyncStatus[status], this.statusLookup[SyncStatus[status]]);
      //return this.statusLookup[SyncStatus[status]];

      return this.statusLookup[this.GetHighestStatus()];
    }

    GetHighestStatus() {
      if(this.modelStateStatus >= this.status) {
        return SyncStatus[this.modelStateStatus];
      }
      else return SyncStatus[this.status];
    }

    ngOnInit() {
      this.syncStatusService.Status.subscribe((status: SyncStatus) => {
        this.status = status;
      });
      this.syncStatusService.ModelStateStatus.subscribe((status: SyncStatus) => {
        this.modelStateStatus = status;
      });

      this.syncStatusService.LastSyncTime.subscribe((timestamp) => {
        if(timestamp != null) {
          this.lastStatus = "Last successful sync: " + timestamp.format("HH:mm:ss");
        } else {
          this.lastStatus = "No successful syncs yet";
        }
      })
    }
}
