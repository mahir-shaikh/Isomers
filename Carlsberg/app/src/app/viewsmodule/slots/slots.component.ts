import { Component, Input, OnInit, OnChanges, EventEmitter, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import {  Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import { Subscription } from 'rxjs';


@Component({
    selector: 'slots',
    templateUrl: './slots.component.html',
    styleUrls: ['./slots.component.styl']
})

export class SlotsComponent {
    @Input() ChannelNo: number;
    @Input() ProdNo: number;
    @Input() isMain: boolean = false;
    private sum1: number;
    private sum2: number;
    private modelChangeListner: EventEmitter < any > ;
    private NoOfVisibleSlots = [1];
    private ImagePath: string = "";
    private canAddSlot:boolean =  false;
    private canRemoveSlot:boolean = false;
    constructor(private cdRef: ChangeDetectorRef, private utils: Utils, private router: Router, private calcService: CalcService, private textEngineService: TextEngineService) {};

    ngOnInit() {
        if(this.calcService.getValue("tlOutputCh"+this.ChannelNo+"Prod"+this.ProdNo+"Open") == "0"){
            this.canAddSlot =  true;
        }
        if(this.calcService.getValue("tlOutputCh"+this.ChannelNo+"Prod"+this.ProdNo+"Close") == "0"){
            this.canRemoveSlot =  true;
        }
        this.UpdateNumberOfSlots();
        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            this.UpdateNumberOfSlots();
            this.updateButtons();
        });

    }

    updateButtons(){
        if(this.calcService.getValue("tlOutputCh"+this.ChannelNo+"Prod"+this.ProdNo+"Open") == "0"){
            this.canAddSlot = true;
        }else{
            this.canAddSlot = false;
        }
        if(this.calcService.getValue("tlOutputCh"+this.ChannelNo+"Prod"+this.ProdNo+"Close") == "0"){
            this.canRemoveSlot = true;
        }else{
            this.canRemoveSlot = false;
        }
    }

    // setPromotionShareMaxLimit() {
    //     // 'tlinputCh'+ChannelNo+'Prod'+ProdNo+'Slot'+SlotNo+'Promo1ShareFrc'
    //     // 'tlinputCh'+ChannelNo+'Prod'+ProdNo+'Slot'+SlotNo+'Promo2ShareFrc'

    //     let number = this.calcService.getValue('calcCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'SlotTotActive');
    //     let sum1 = 0,
    //         sum2 = 0;
    //     for (let i = 0; i < number; i++) {
    //         sum1 += numberFormatting.unformat(this.calcService.getValue('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + (i + 1) + 'Promo1ShareFrc'), 100);
    //         sum2 += numberFormatting.unformat(this.calcService.getValue('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + (i + 1) + 'Promo2ShareFrc'), 100);
    //     }
    //     this.sum1 = 100 - sum1;
    //     this.sum2 = 100 - sum2;
    //     // this.cdRef.markForCheck();
    // }

    ngOnChanges() {
        this.updateButtons();
        this.UpdateNumberOfSlots();
    }

    ngOnDestroy() {
        if (this.modelChangeListner) {
            this.modelChangeListner.unsubscribe();

        }
    }

    UpdateNumberOfSlots() {
        this.ImagePath = "../../../../assets/images/Prod" + this.ProdNo + ".png";
        let number = this.calcService.getValue('calcCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'SlotTotActive');
        this.NoOfVisibleSlots = [];
        for (let i = 0; i < number; i++) {
            this.NoOfVisibleSlots.push(1);
        }
        //this.setPromotionShareMaxLimit();
    }

    AddSlot() {
        if(this.calcService.getValue("tlOutputCh"+this.ChannelNo+"Prod"+this.ProdNo+"Open") != "0"){
            let SlotNo = this.NoOfVisibleSlots.length + 1;
            this.calcService.setValue('tlInputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + SlotNo + 'Active', "1");
            // this.cantAddSlot = false;
            // this.canRemoveSlot = false;
        }
        this.UpdateNumberOfSlots();
    }

    RemoveSlot() {
        if (this.calcService.getValue("tlOutputCh"+this.ChannelNo+"Prod"+this.ProdNo+"Close") != "0"){
            let SlotNo = this.NoOfVisibleSlots.length;            
            this.calcService.setValue('tlInputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'Active', "0");
            
            let arr= ['tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'Forecast', 'tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'Pack', 'tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'CustPrice'];
            if(this.ChannelNo == 1 || this.ChannelNo == 3 || this.ChannelNo == 4){
                arr.push('tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'Promo1');
                arr.push('tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'Promo1Weeks');
                arr.push('tlinputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'Promo1ShareFrc');
                arr.push('tloutputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'AvgPromoPrice');
                arr.push('tloutputCh'+this.ChannelNo+'Prod'+this.ProdNo+'Slot'+SlotNo+'AvgSellPrice');
            }
            if (this.ChannelNo == 1) {
                arr.push('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + SlotNo + 'Promo2');
                arr.push('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + SlotNo + 'Promo2Weeks');
                arr.push('tlinputCh' + this.ChannelNo + 'Prod' + this.ProdNo + 'Slot' + SlotNo + 'Promo2ShareFrc');
            }
            this.utils.resetInputs(arr, this.calcService);
            
            // this.cantRemoveSlot = false;
            // this.canAddSlot = false;
        }
        this.UpdateNumberOfSlots();
    }
    getObervable(){
        return this.modelChangeListner;
    }
}
