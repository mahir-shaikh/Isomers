import { Component, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { CalcApi } from '../../calcmodule/calcapi';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, UrlTree } from '@angular/router';
import { APP_READY, INTRO_COMPLETE, DataStore, END_OF_ROUND, EOR_FEEDBACK } from '../../utils/utils';

@Component({
    selector: 'splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.css'],
    providers: []
})

export class SplashComponent implements OnInit {
    title: string = 'Loading...';
    progress: number = 0;
    progressMessage: string = "Loading model..."
    constructor(private calcService: CalcService, private router: Router, private textEngine: TextEngineService, private dataStore: DataStore) {};

    ngOnInit() {
        let self = this,
            stateUrl = '',
            urlTree: UrlTree = null,
            calcModelLoadedPromise = this.calcService.getApi(this.progressCb(this))
            .then(api => api.forceRecalculate())
            // .then(api => 
            // {
                // this.title = "Loaded!";
                // stateUrl = (this.calcService.getStateUrl() && this.calcService.getStateUrl() !== "") ? this.calcService.getStateUrl() : '/dashboard';
                // urlTree = this.router.parseUrl(decodeURIComponent(stateUrl));

                // api.getBook().recalculate();
                // self.api.addCalculationCallback(function() {
                //     resolve(self);
                //     console.log(" model recalculated successfully!");
                // });
            // })
            ,textLoadedPromise = this.textEngine.init();
            Promise.all([calcModelLoadedPromise, textLoadedPromise]).then(() => {
                stateUrl = (this.calcService.getStateUrl() && this.calcService.getStateUrl() !== "") ? this.calcService.getStateUrl() : '/dashboard';
                urlTree = this.router.parseUrl(decodeURIComponent(stateUrl));
                // check if app-ready was already set as persistent 
                let self = this, getData = this.dataStore.getData(INTRO_COMPLETE, true),
                    xxRound = this.calcService.getValue("xxRound");
                
                // if (getData !== null) {
                getData.then((result) => {
                    if (String(result) == "true") {
                        this.dataStore.setData(APP_READY, true);
                        let eofData = this.dataStore.getData(END_OF_ROUND, true);
                        eofData.then((eofResult) => {
                            if(eofResult == "true"){
                                this.router.navigate(['/dashboard', EOR_FEEDBACK, { 'outlets': { 'year': xxRound } }]);
                            }else{
                                self.router.navigateByUrl(urlTree);
                            }
                        });
                    }
                    else {
                        self.router.navigateByUrl('/intro/registration');
                    }
                });
                // }
                // else {
                //     this.router.navigateByUrl('/intro/registration');
                // }
                
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