import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router,RouterModule, ActivatedRoute, Data, Params } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';     


@Component({
    selector: 'sku-decisions',
    templateUrl: './skudecisions.component.html',
    styleUrls: ['./skudecisions.component.styl'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SkuDecisionsComponent {
    @ViewChild('reportModal') public reportModalRef: ModalDirective;
    @ViewChild('assortementModal') public assortementModalRef: ModalDirective;
    @ViewChild('promotionModal') public promotionModalRef: ModalDirective;
    @Input() ChannelName : string;
    private ChannelNo:number
    private subscription: Subscription;
    private roundNumber: number;
    private reportName: string ="";
    private assortementReportNumber: number;
    private promotionReportNumber: number;
    private assortementReportBought:boolean;
    private promotionReportBought:boolean;
    private VTList=[];
    private waterfallChartOptions = '{ }';
    private modelChangeListner: EventEmitter<any>;
    private showAssortmentReport: boolean = false;
    private showPromotionReport: boolean = false;
    private animationBool: boolean = false;

    constructor(private dataStore: DataStore, private utils: Utils, private router:Router, private route:ActivatedRoute, private calcService: CalcService, private textEngineService : TextEngineService, private cdRef: ChangeDetectorRef) { };

    ngOnInit() {
        let self = this;
        this.Initialize();
        this.subscription = this.route.params.subscribe(() => {
         self.Initialize();
         this.cdRef.markForCheck();
        });

        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            this.initializeVTList();
            this.cdRef.markForCheck();
        });

      
    }

    Initialize(){
      this.animationBool = true;
        this.ChannelName = this.route.snapshot.params['ChannelName'];
        switch (this.ChannelName) {
          case "Hypermarket":
              this.ChannelNo = 1;
          break;
          case "Discounters":
              this.ChannelNo = 2;
          break;
          case "Convenience":
              this.ChannelNo = 3;
          break;
          case "OnTrade":
              this.ChannelNo = 4;
          break;
      }

      this.roundNumber = this.calcService.getValue("tlOutputRound");  
      this.assortementReportNumber = 2*this.roundNumber - 1;
      this.promotionReportNumber = 2*this.roundNumber;
      this.assortementReportBought = this.calcService.getValue("tlInputCh"+this.ChannelNo+"R"+this.roundNumber+"Report" + this.assortementReportNumber) == "1" ? true : false;
      this.promotionReportBought = this.calcService.getValue("tlInputCh"+this.ChannelNo+"R"+this.roundNumber+"Report" + this.promotionReportNumber) == "1" ? true : false;

      this.initializeVTList();
      
    }

    initializeVTList(){
      let WaterfallList = this.calcService.getValue("tlOutputWaterfallListCh"+this.ChannelNo);

      this.VTList = [];
      for(let i=0; i< WaterfallList.length;i++){
          let strValue = WaterfallList[i][0];
          if(strValue != ""){
              this.VTList.push(strValue);
          }
      }
    }

    onReportBtnClick(reportType : string){
      let strReportName = "tlInputCh"+this.ChannelNo+"R"+this.roundNumber+"Report";

      //make appropriate RangeRef
      if(reportType == 'Assortement'){
        this.reportName = strReportName + this.assortementReportNumber;        
      }else if(reportType == 'Promotion'){
        this.reportName = strReportName + this.promotionReportNumber;  
      }
      //get Value for RangeRef
      let reportBought : boolean;
      reportBought = this.calcService.getValue(this.reportName) == "1" ? true : false;
      //if value is 0 showReportConfirmationMsg
      if(reportBought){
        if(reportType == 'Assortement'){
          this.showAssortmentReport = true;
          this.assortementModalRef.show();
          //this.assortementModalRef.onShowCalled();     
        }else if(reportType == 'Promotion'){
          this.showPromotionReport = true;
          this.promotionModalRef.show();  
        }
        setTimeout(()=>{
          window.dispatchEvent(new Event('resize')); 
        },150)
      }else{
        this.showReportConfirmationMsg();
      }
    }

    showReportConfirmationMsg(){
      this.reportModalRef.show();
    }

    hideReportConfirmtionMsg(){
      this.reportModalRef.hide();
    }

    buyReport(){
      //ChangeRangeRef for that report
      this.calcService.setValue(this.reportName, "1");
      this.Initialize();
      this.hideReportConfirmtionMsg();
    }

    hideAssortementReport(){
      this.assortementModalRef.hide();
      this.showAssortmentReport = false;
    }
    hidePromotionReport(){
      this.promotionModalRef.hide();
      this.showPromotionReport = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.modelChangeListner.unsubscribe();
    }

    animationDone(event){
        this.animationBool = false;
    }
}
