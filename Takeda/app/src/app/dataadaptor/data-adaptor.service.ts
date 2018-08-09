import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { PulseStorageService } from './pulse-storage.service';
import { SyncStatusService, SyncStatus } from '../connect/syncStatus.service';
import { IStorage } from './istorage';

@Injectable()
export class DataAdaptorService implements IStorage {
    private storageService: IStorage;
    private isConnectedToPulse: boolean = (process.env.CONNECT_TO_PULSE === 'true') ? true : false;
    constructor(localStorageService: LocalStorageService, pulseStorageService: PulseStorageService, private syncStatusService: SyncStatusService) {
        // console.log('storage ' + (this.isConnectedToPulse ? 'pulse' : 'local'));
        if (this.isConnectedToPulse) {
            // do nothing
            this.storageService = pulseStorageService;
        }
        else {
            this.storageService = localStorageService;
        }
        // this.storageService = localStorageService;
    }

    getValue(key:string): Promise<string> {
        return this.storageService.getValue(key);
    }

    setValue(key:string, value:string): Promise<any> {
        this.syncStatusService.SetModelStateStatus(SyncStatus.Syncing)

        return this.storageService.setValue(key, value)
        .then((response) => {
          this.syncStatusService.SetModelStateStatus(SyncStatus.InSync)
          return response
        })
        .catch((err) => {
          if(err.status === 0) {
            this.syncStatusService.SetModelStateStatus(SyncStatus.NetworkError)
          }
          else {
            this.syncStatusService.SetModelStateStatus(SyncStatus.SyncError)
          }

          return Promise.reject(err)
        });
    }

    clear(key:string, destroy:boolean): void {
        this.storageService.clear(key, destroy);
    }
}
