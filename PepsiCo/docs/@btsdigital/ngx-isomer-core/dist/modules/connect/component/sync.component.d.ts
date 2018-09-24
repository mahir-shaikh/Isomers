import { OnInit } from '@angular/core';
import { SyncStatusService } from '../sync/sync-status.service';
import { SyncStatus } from '../sync/syncstatus';
import { SyncService } from '../sync/sync.service';
import { CalcService } from '../../calc/calc.service';
/**
 * SyncComponent component let's user see the sync stus with backend in the top right corner
 * It lets the user know if his calc model decisions are syncronised with backedn at any given time
 *
 */
export declare class SyncComponent implements OnInit {
    private syncStatusService;
    private syncService;
    private calcService;
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
    constructor(syncStatusService: SyncStatusService, syncService: SyncService, calcService: CalcService);
    /**
    * current status in the memory
    */
    status: SyncStatus;
    /**
    * last status in memory
    */
    lastStatus: any;
    /**
    * enum of the status texts
    */
    statusLookup: {
        'InSync': string;
        'OutOfSync': string;
        'SyncError': string;
        'NetworkError': string;
        'Syncing': string;
    };
    /**
    * current status of model in memory
    */
    modelStateStatus: SyncStatus;
    /**
    * force sync with backend by downloading and uploading stuff and save it to lo9cal storage
    */
    ForceSync(): void;
    /**
    * Get status message of the current sttaus in memory
  */
    GetStatusMessage(status: SyncStatus): string;
    /**
    * Get message last status in memory
    */
    GetHighestStatus(): string;
    /**
    * Initialise the sync service module by subscribing to the sync status setrvice
    * Listen for changes in model state status
    * listen for changes in last sync time
    */
    ngOnInit(): void;
}
