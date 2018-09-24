import { Component, OnInit } from '@angular/core';
import { SyncStatusService } from '../sync/sync-status.service';
import { SyncStatus } from '../sync/syncstatus';
import { SyncService } from '../sync/sync.service';
import { CalcService } from '../../calc/calc.service';

/**
 * SyncComponent component let's user see the sync stus with backend in the top right corner
 * It lets the user know if his calc model decisions are syncronised with backedn at any given time
 *
 */
@Component({
  selector: 'ism-sync-status',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {

  /**
  * Constructor sync component
  *
  * @param {SyncStatusService} syncStatusService SyncStatusService instance
  *
  * @param {SyncService} syncService SyncService instance
  *
  * @param {CalcService} calcService CalcService instance
  *
  */
  constructor(private syncStatusService: SyncStatusService, private syncService: SyncService, private calcService: CalcService) { }
  /**
  * current status in the memory
  */
  public status: SyncStatus;
  /**
  * last status in memory
  */
  public lastStatus: any;
  /**
  * enum of the status texts
  */
  public statusLookup = {
    'InSync': 'In Sync',
    'OutOfSync': 'Out of sync',
    'SyncError': 'Synchronization error',
    'NetworkError': 'Network error (failed to connect to server)',
    'Syncing': 'Synchronizing'
  };
  /**
  * current status of model in memory
  */
  public modelStateStatus: SyncStatus;

  /**
  * force sync with backend by downloading and uploading stuff and save it to lo9cal storage
  */
  ForceSync(): void {
    this.syncService.Download();
    this.syncService.Upload();
    this.calcService.saveStateToStorage();
  }

  /**
  * Get status message of the current sttaus in memory
*/
  GetStatusMessage(status: SyncStatus): string {
    // Translate first to string SyncStatus, and then get the message.
    // console.log(status, SyncStatus[status], this.statusLookup[SyncStatus[status]]);
    // return this.statusLookup[SyncStatus[status]];

    return this.statusLookup[this.GetHighestStatus()];
  }

  /**
  * Get message last status in memory
  */
  GetHighestStatus(): string {
    if (this.modelStateStatus >= this.status) {
      return SyncStatus[this.modelStateStatus];
    } else {
      return SyncStatus[this.status];
    }
  }

  /**
  * Initialise the sync service module by subscribing to the sync status setrvice
  * Listen for changes in model state status
  * listen for changes in last sync time
  */
  ngOnInit() {
    this.syncStatusService.Status.subscribe((status: SyncStatus) => {
      this.status = status;
    });
    this.syncStatusService.ModelStateStatus.subscribe((status: SyncStatus) => {
      this.modelStateStatus = status;
    });

    this.syncStatusService.LastSyncTime.subscribe((timestamp) => {
      if (timestamp != null) {
        this.lastStatus = 'Last successful sync: ' + timestamp.format('HH:mm:ss');
      } else {
        this.lastStatus = 'No successful syncs yet';
      }
    });
  }
}
