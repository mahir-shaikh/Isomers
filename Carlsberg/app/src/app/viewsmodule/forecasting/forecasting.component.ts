import { Component, OnInit, OnDestroy, Input, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, RouterModule, ActivatedRoute, Data, Params } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';

@Component({
    selector: 'forecasting',
    templateUrl: './forecasting.component.html',
    styleUrls: ['./forecasting.component.styl'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ForecastingComponent {

    @Input() ChannelName: string;
    private ChannelNo: number;
    private LEVELS = ["Level1", "Level2", "Level3", "Level4", "Level5"];
    private PLANS = ["Plan1", "Plan2", "Plan3", "Plan4", "Plan5", "Plan6", "Plan7", "Plan8"];
   //  private gbcRangeRefX: string;
   //  private gbcRangeRefY: string;
   // private gbcRangeRefZ: string;
    private gcbChartOptions = '{"yAxis": { "title": { "text": "(M)" }, "stackLabels" : { "enabled" : "true"} } }';
    private gbcRangeRef: string;
    private gbcTotalRef: string;

    private tradeTermsRangeRef: string;
    private subscription: Subscription;
    private modelChangeListener: Subscription;
    private animationBool: boolean = false;

    constructor(private router: Router, private route: ActivatedRoute, private calcService: CalcService, private textEngineService: TextEngineService, private cdRef: ChangeDetectorRef) {};

    ngOnInit() {
        let self = this;
        self.animationBool = true;
        this.Initialize();
        this.subscription = this.route.params.subscribe(() => {
            self.Initialize();
            this.cdRef.markForCheck();
        });

        this.modelChangeListener = this.calcService.getObservable().subscribe(() => {
            this.cdRef.markForCheck();
        });
    }

    Initialize() {
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

        // this.gbcRangeRefX = "[tlOutputCh1Analytic1Chart1XValue1,tlOutputCh1Analytic1Chart1XValue2,tlOutputCh1Analytic1Chart1XValue3,tlOutputCh1Analytic1Chart1XValue4,tlOutputCh1Analytic1Chart1XValue5,tlOutputCh1Analytic1Chart1XValue6,tlOutputCh1Analytic1Chart1XValue7,tlOutputCh1Analytic1Chart1XValue8,tlOutputCh1Analytic1Chart1XValue9,tlOutputCh1Analytic1Chart1XValue10,tlOutputCh1Analytic1Chart1XValue11,tlOutputCh1Analytic1Chart1XValue12]";
        // this.gbcRangeRefY = "[tlOutputCh1Analytic1Chart1YValue1,tlOutputCh1Analytic1Chart1YValue2,tlOutputCh1Analytic1Chart1YValue3,tlOutputCh1Analytic1Chart1YValue4,tlOutputCh1Analytic1Chart1YValue5,tlOutputCh1Analytic1Chart1YValue6,tlOutputCh1Analytic1Chart1YValue7,tlOutputCh1Analytic1Chart1YValue8,tlOutputCh1Analytic1Chart1YValue9,tlOutputCh1Analytic1Chart1YValue10,tlOutputCh1Analytic1Chart1YValue11,tlOutputCh1Analytic1Chart1YValue12]";
        // this.gbcRangeRefZ = "[tlOutputCh1Analytic1Chart1BubbleSize1,tlOutputCh1Analytic1Chart1BubbleSize2,tlOutputCh1Analytic1Chart1BubbleSize3,tlOutputCh1Analytic1Chart1BubbleSize4,tlOutputCh1Analytic1Chart1BubbleSize5,tlOutputCh1Analytic1Chart1BubbleSize6,tlOutputCh1Analytic1Chart1BubbleSize7,tlOutputCh1Analytic1Chart1BubbleSize8,tlOutputCh1Analytic1Chart1BubbleSize9,tlOutputCh1Analytic1Chart1BubbleSize10,tlOutputCh1Analytic1Chart1BubbleSize11,tlOutputCh1Analytic1Chart1BubbleSize12]";

        this.gbcRangeRef = "[tlOutputCh"+this.ChannelNo+"Prod2GPaLpGPaL, tlOutputCh"+this.ChannelNo+"Prod3GPaLpGPaL, tlOutputCh"+this.ChannelNo+"Prod1GPaLpGPaL, tlOutputCh"+this.ChannelNo+"Prod4GPaLpGPaL,tlOutputCh"+this.ChannelNo+"Prod2GPaLpLog, tlOutputCh"+this.ChannelNo+"Prod3GPaLpLog, tlOutputCh"+this.ChannelNo+"Prod1GPaLpLog, tlOutputCh"+this.ChannelNo+"Prod4GPaLpLog, tlOutputCh"+this.ChannelNo+"Prod2GPaLpBrandCogs, tlOutputCh"+this.ChannelNo+"Prod3GPaLpBrandCogs, tlOutputCh"+this.ChannelNo+"Prod1GPaLpBrandCogs, tlOutputCh"+this.ChannelNo+"Prod4GPaLpBrandCogs]";
        this.gbcTotalRef = "[tlOutputCh"+this.ChannelNo+"Prod2GPaLpGPaLmar, tlOutputCh"+this.ChannelNo+"Prod3GPaLpGPaLmar, tlOutputCh"+this.ChannelNo+"Prod1GPaLpGPaLmar, tlOutputCh"+this.ChannelNo+"Prod4GPaLpGPaLmar]";
        this.tradeTermsRangeRef = "[tlOutputCh" + this.ChannelNo + "TTUnCondition, tlOutputCh" + this.ChannelNo + "TTCondition ]";
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.modelChangeListener.unsubscribe();
    }

    ngOnChanges(){
        this.Initialize();
    }

    animationDone(event){
        this.animationBool = false;
    }
}
