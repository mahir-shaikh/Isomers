import { Component, Input, OnInit, OnChanges, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import * as SyncLoop from 'sync-loop';


@Component({
    selector: 'input-data',
    templateUrl: './inputdata.component.html',
    styleUrls: ['./inputdata.component.styl']
})

export class InputDataComponent {
    @Input() PathNo: number;
    private arrInputRefs: Array<string>;
    private ProductList = [""];
    private MEList = [""];
    private SwitchingList = [""];
    private changeMode : boolean = false;
    private modelChangeListner: EventEmitter<any>;
    private legendToolTipText: string = "";
    private languageIsEnglish: boolean = true;
   
   
    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        this.initializeProductList();
        this.initializeSwitchList();
        this.initializeMEList();
        this.initializeToolTipText();
        
        this.languageIsEnglish = this.calcService.getValue('tlInputLanguage') == "English" ? true : false;
        this.changeMode = this.calcService.getValue("tlInputPath" + this.PathNo + "_Access") == 2 ? true : false;
        this.arrInputRefs = [
            // 'tlInputPath' + this.PathNo + '_ProdMT',
            'tlInputPath' + this.PathNo + '_Access',
            'tlInputPath' + this.PathNo +'_PriceMT_Adj',
            // 'tlInputPath' + this.PathNo + '_ExpMT',
            // 'tlInputPath' + this.PathNo + '_ProdSub',
            'tlInputPath' + this.PathNo + '_Qty'
        ];

        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            this.initializeProductList();
            this.initializeSwitchList();
            this.initializeMEList();
            this.changeMode = this.calcService.getValue("tlInputPath" + this.PathNo + "_Access") == 2 ? true : false;
        });
    }

    initializeProductList(){
        let List = this.calcService.getValue("tlOutput_List_ProdMT", true);
        this.ProductList = [];
        for(let i=0; i< List.length;i++){
            let strValue: string = List[i][0];
            this.ProductList.push(strValue);
            // if(strValue != ""){
            //     strValue = this.decodeHtmlEntities(strValue);
            // }
        }
    }

    initializeSwitchList(){
        let List = this.calcService.getValue("tlOutput_List_Path" + this.PathNo + "_ProdSub");
        this.SwitchingList = [];
        for(let i=0; i< List.length;i++){
            let strValue: string = List[i][0];
            this.SwitchingList.push(strValue);
            // if(strValue != ""){
            //     strValue = this.decodeHtmlEntities(strValue);
            // }
        }
    }

    initializeMEList(){
        let List = this.calcService.getValue("tlOutputListGlossary");
        this.MEList = [];
        for(let i=0; i< List.length;i++){
            let strValue: string = List[i][0];
            if(strValue != ""){
                strValue = this.decodeHtmlEntities(strValue);
                this.MEList.push(strValue);
            }
        }
    }

    resetValues(){
        this.utils.resetInputs(this.arrInputRefs,this.calcService);
        // run loop for each path
        // SyncLoop(4, (loop) => {
        let i = this.PathNo,
            prod = this.calcService.getValue('nmSelect',true),
            mtExp = this.calcService.getValue('nmFY1',true);
        this.calcService.setValue('tlInputPath' + i + '_ProdMT', prod)
            .then(() => {
                this.calcService.setValue('tlInputPath' + i + '_ProdSub', prod)
                    .then(() => {
                        this.calcService.setValue('tlInputPath' + i + '_ExpMT', mtExp)
                });
        });
    }

    onModeChange(event){
        //need to confirm this.
        if(event){
            this.calcService.setValue("tlInputPath" + this.PathNo + "_Access","2");
        }else{
            this.calcService.setValue("tlInputPath" + this.PathNo + "_Access","1");
        }
    }

    ngOnDestroy() {
        this.modelChangeListner.unsubscribe();
    }

    ngOnChanges(){
    }

    decodeHtmlEntities(str) : string {
        return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    }

    initializeToolTipText(){
        let yr1,yr2,yr3,yr1Definition,yr2Definition,yr3Definition;
        yr1 = this.calcService.getValue("nmYr1",true);
        yr2 = this.calcService.getValue("nmYr2",true);
        yr3 = this.calcService.getValue("nmYr3",true);
        yr1Definition = this.calcService.getValue("nmFY1_Def",true);
        yr2Definition = this.calcService.getValue("nmFY2_Def",true);
        yr3Definition = this.calcService.getValue("nmFY3_Def",true);

        this.legendToolTipText = yr1 + " = " + yr1Definition + "<br>" + yr2 + " = " + yr2Definition + "<br>" + yr3 + " = " + yr3Definition;
    }
}
