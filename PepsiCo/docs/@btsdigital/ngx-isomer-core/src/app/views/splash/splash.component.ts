import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Constants, CommunicatorService, LoggerService, StorageService, CalcService, TextService } from '../../isomer';
import { ModelLoaderService } from '../../model/model-loader.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ism-splash',
  templateUrl: './splash.component.html'
})
export class SplashComponent implements OnInit, OnDestroy {
  private modelLoadProgressSub: Subscription;
  private modelLoadCompletePromise: Promise<any>;
  private textServiceInitPromise: Promise<any>;

  constructor(private modelLoader: ModelLoaderService, private calcService: CalcService, private textService: TextService,
    private communicator: CommunicatorService, private logger: LoggerService,
    private storage: StorageService, private router: Router) { }

  ngOnInit() {
    const model: any = this.modelLoader.getModel();

    this.modelLoadProgressSub = this.communicator
      .getEmitter(Constants.MODEL_LOAD_PROGRESS)
      .subscribe((progress) => this.onProgress.apply(this, [progress]));

    this.textServiceInitPromise = this.textService.init();
    // try and load the calc model
    this.modelLoadCompletePromise = this.calcService
      .getApi(model)
      .catch((err) => {
        this.logger.log('Error when loading model ', err);
      });

    Promise.all([this.textServiceInitPromise, this.modelLoadCompletePromise])
      .then(() => {
        this.appReady();
    });
  }

  onProgress(progressOb: any) {
      this.logger.log('OnProgress called ' + progressOb);
  }

  appReady() {
      this.logger.log('Model loaded');
      let returnUrl: string;
      this.storage.getValue(Constants.RETURN_URL)
        .then(val => {
          returnUrl = val + '';
          this.router
            .navigateByUrl(returnUrl);
        })
        .catch(err => {
          this.router.navigateByUrl('');
        });
  }

  ngOnDestroy() { }

}
