import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES, LANGUAGES} from '../../utils';
import { CalcService } from '../../calcmodule';
// import { TextEngineService } from '../../textengine/textengine.service';
import { Title } from '@angular/platform-browser';
import * as SyncLoop from 'sync-loop';

@Component({
    selector: 'intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.styl'],
})

export class IntroComponent implements OnInit, OnDestroy {
    private LanguageList = ["Language1", "Language2", "Language3", "Language4", "Language5",/*"Language6",*/ "Language7","Language8","Language9","Language10","Language11"];
	private CurrencyList = ["Currency1","Currency2","Currency3","Currency4","Currency5","Currency6"];
    private languageChangeSubscriber: any;
    private modelChangeListner: any;
    isChangingLanguage: boolean = false;
    private isAnimationOver: boolean = true;
    private toBounce: boolean = true;
    
    constructor(private router: Router, private calcService: CalcService, private title: Title, private dataStore: DataStore) { };

    ngOnInit() {
        let language = this.calcService.getValue('tlInputLanguage');
        // this.textEngine.changeLanguage(LANGUAGES[language]);
        // this.languageChangeSubscriber = this.textEngine.languageChangeEmitter.subscribe((language) => {
        //     let title:string = this.textEngine.getText('Title')
        //     this.title.setTitle(title);
        // });

        this.initializeLanguageList();
        this.initializeCurrencyList();
        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            this.initializeLanguageList();
            this.initializeCurrencyList();
        });
    }

    initializeLanguageList(){
        let List = this.calcService.getValue("nmLanguages");
        this.LanguageList = List[0];
        // Remove this line when Japanese Language is included
        // this.LanguageList.splice(5,1);
    }

    initializeCurrencyList(){
        let List = this.calcService.getValue("tlOutputListCurrency");
        this.CurrencyList = [];
        for(let i=0; i< List.length;i++){
            let strValue: string = List[i][0];
            if(strValue != ""){
                this.CurrencyList.push(strValue);
            }
        }
    }

    ngOnDestroy() {

    }

    onAnimationDone(event){
        this.isAnimationOver = false;
    }

    navigateToInputs(){
        if (this.isChangingLanguage) return;
        this.router.navigateByUrl(ROUTES.INPUTS);
    }

    selectLanguage(language: string) {
        // console.log("Language selected : " + language);
        // this.isChangingLanguage = true;
        // this.textEngine.changeLanguage(LANGUAGES[language]);
        // this.calcService.runCourseAction('SetLanguage');
        let title: string = this.calcService.getValue('nmProgramTitle')
        this.title.setTitle(title);
        // run loop for each path
        SyncLoop(8, (loop) => {
            let i = loop.iteration() + 1,
                prod = this.calcService.getValue('nmSelect',true),
                mtExp = this.calcService.getValue('nmFY1',true);
            // console.log("iteration " + i);
            this.calcService.setValue('tlInputPath' + i + '_ProdMT', prod)
                .then(() => {
                    // console.log("Set prodMt to " + prod);
                    this.calcService.setValue('tlInputPath' + i + '_ProdSub', prod)
                        .then(() => {
                            // console.log('set subProd to ' + prod);
                            this.calcService.setValue('tlInputPath' + i + '_ExpMT', mtExp)
                                .then(loop.next);
                        })
                });
        }, () => {
            this.isChangingLanguage = false;
        });
    }

    showTutorial(){
        this.dataStore.triggerChange(EVENTS.START_VIDEO);
    }
}
