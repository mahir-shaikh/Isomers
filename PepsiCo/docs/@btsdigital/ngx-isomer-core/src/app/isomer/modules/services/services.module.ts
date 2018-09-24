import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { CommunicatorService } from './communicator/communicator.service';
import { LoggerService } from './logger/logger.service';
import { StorageService } from './storage/storage.service';
import { ConnectModule } from '../connect/connect.module';
import { SignalRWrapperService } from './signalrwrapper/signalr-wrapper.service';
import { ManifestService } from './manifest/manifest.service';
import { NumberFormattingPipe } from './number-formatting/number-formatting.pipe';
import { SignalRModule } from '@btsdigital/pulsesignalr';

export * from '../connect/index';

/**
 * The module that provides shared services like {@link CommunicatorService}, {@link StorageService}, ...
 *
 */
@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    ConnectModule,
    SignalRModule
  ],
  declarations: [NumberFormattingPipe],
  exports: [NumberFormattingPipe],
  providers: [CommunicatorService, LoggerService, StorageService, NumberFormattingPipe, SignalRWrapperService, ManifestService]
})
export class ServicesModule { }

