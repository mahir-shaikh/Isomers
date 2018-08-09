import { Component, Input, OnInit, OnChanges , EventEmitter, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';


@Component({
    selector: 'slot-row',
    templateUrl: './slotrow.component.html',
    styleUrls: ['./slotrow.component.styl']
})

export class SlotRowComponent {
    @Input() SlotNo:number;
    @Input() ChannelNo: number;
    @Input() ProdNo: number;
    private maxLimit1: number = 0;
    private maxLimit2: number = 0;
    private PackList=[];
    private PromoList=['Promotion0','Promotion1','Promotion2','Promotion3','Promotion4','Promotion5'];
    private modelChangeListner: EventEmitter<any>;

    constructor(private dataStore: DataStore, private cdRef: ChangeDetectorRef, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
       this.setPromotionShareMaxLimit();       
       this.initializePackInnovationList();
        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            this.setPromotionShareMaxLimit();
            this.initializePackInnovationList();
        });
    }

    initializePackInnovationList(){
        let PackInnovationList = this.calcService.getValue("tlOutputPackAvailableListCh"+this.ChannelNo);
        this.PackList = [];
            // this.cdRef.markForCheck();
        //this.maxLimit1 = numberFormatting.unformat(this.calcService.getValue('tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+this.SlotNo+'Promo1ShareFrc'),100) + this.maxLimit1;
        //this.maxLimit2 = numberFormatting.unformat(this.calcService.getValue('tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+this.SlotNo+'Promo2ShareFrc'),100) + this.maxLimit2;
        for(let i=0; i< PackInnovationList.length;i++){
            let strValue = PackInnovationList[i][0];
            if(strValue != ""){
                this.PackList.push(strValue);
            }
        }
    }

    setPromotionShareMaxLimit() {
        // 'tlinputCh'+ChannelNo+'Prod'+ProdNo+'Slot'+SlotNo+'Promo1ShareFrc'
        // 'tlinputCh'+ChannelNo+'Prod'+ProdNo+'Slot'+SlotNo+'Promo2ShareFrc'
        //'tlinputCh'+'ChannelNo'+'Prod'+ProdNo+'Slot'+SlotNo+'Promo1ShareFrc'
        //'tlinputCh'+'ChannelNo'+'Prod'+ProdNo+'Slot'+SlotNo+'Promo2ShareFrc'

        //    let number = this.calcService.getValue('calcCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'SlotTotActive');
        let sum1 = 0,
            sum2 = 0;

        sum1 += numberFormatting.unformat(this.calcService.getValue('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + this.SlotNo + 'Promo1ShareFrc'), 100);
        if(this.ChannelNo == 1){
            sum2 += numberFormatting.unformat(this.calcService.getValue('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + this.SlotNo + 'Promo2ShareFrc'), 100);
        }
        if(this.ChannelNo == 1){
            this.maxLimit1 = 100 - sum2;
            this.maxLimit2 = 100 - sum1;
        }else{
            this.maxLimit1 = 100;
        }
        // this.cdRef.markForCheck();
    }

    ngOnChanges(){
        this.setPromotionShareMaxLimit();
        this.initializePackInnovationList();
    }

    ngOnDestroy() {
        this.modelChangeListner.unsubscribe();
    }
}
