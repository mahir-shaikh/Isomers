import { Component, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { ProjectStateService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, UrlTree } from '@angular/router';
import { APP_READY, DataStore, EVENTS } from '../../utils';
import { EmailCaptureService } from '../emailcapture.service';

@Component({
    selector: 'splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.styl'],
    providers: [EmailCaptureService]
})

export class SplashComponent implements OnInit {
    title: string = 'Loading...';
    progress: number = 0;
    progressMessage: string = "Loading model..."
    constructor(private calcService: CalcService, private router: Router, private textEngine: TextEngineService, private dataStore: DataStore, private projectStateService: ProjectStateService, private emailCaptureService: EmailCaptureService) { };

    ngOnInit() {
        let self = this,
            stateUrl = '',
            urlTree: UrlTree = null,
            calcModelLoadedPromise = this.calcService.getApi(this.progressCb(this))
            // .then(api => api.forceRecalculate())
            , textLoadedPromise = this.textEngine.init()
            , emailSavedPromise = this.emailCaptureService.saveEmail();
            // , projectServiceLoaded = this.projectStateService.init();
            
        Promise.all([calcModelLoadedPromise, textLoadedPromise/*, projectServiceLoaded*/,emailSavedPromise]).then(() => {
                stateUrl = (this.calcService.getStateUrl() && this.calcService.getStateUrl() !== "") ? this.calcService.getStateUrl() : '/intro';
                urlTree = this.router.parseUrl(decodeURIComponent(stateUrl));
                // check if app-ready was already set as persistent
                let introData = self.dataStore.getData(EVENTS['INTRO_COMPLETE'], true);
                self.dataStore.setData(APP_READY, true);
                if (introData !== null) {
                    introData.then((ready) => {
                        if(ready == "true"){
                            self.router.navigateByUrl(stateUrl);
                        }
                        else {
                            self.router.navigateByUrl('intro');
                        }
                    });
                }
                else {
                    this.router.navigateByUrl('intro');
                }
            });
    }

    loadingProgress(progressOb:any) {
        this.progress = progressOb.numComplete / progressOb.numTotal;
    }

    progressCb(self: SplashComponent) { 
        return function(progress:any) {
            self.loadingProgress(progress); 
            if (parseInt(self.progress+"") === 1) {
                self.progressMessage = "Initializing model..."; 
            }
        }
        
    }
}