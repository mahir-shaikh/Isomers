import {
    Component, Input, OnInit, OnDestroy, OnChanges,
    EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef,
    trigger, state, animate, transition, style
} from '@angular/core';
// import { CalcService } from '../calc.service';
// import { NumberFormattingPipe } from '../number-formatting.pipe';
import { CalcService, CalcSliderComponent as IsomerCalcSliderComponent, CommunicatorService, NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'isma-calc-slider',
    templateUrl: './calcslider.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcslider.styl']
})

export class CalcSliderComponent extends IsomerCalcSliderComponent implements OnInit, OnDestroy {
    @Input() isDisabled: boolean = false;
	@Input() handleValueRef: string;
    private handleValue:string;
    private subscription:any;

    // Local declarations of CalcOutlet that are private in CalcOutputComponent
    private calcServiceA: CalcService;
    private sliderRef: any;

    constructor(calcService : CalcService){
    	super(calcService)
    	this.calcServiceA = calcService;
    }


    ngOnInit(){
    	super.ngOnInit();

    	this.updateValues();
    	this.subscription = this.calcServiceA.getObservable().subscribe(() => {
            this.updateValues();
        });
    }

    updateValues() {
        this.handleValue = this.calcServiceA.getValue(this.handleValueRef, true);
        this.updateHandleValue();
        if(this.isDisabled){
            var origins = this.elRef.nativeElement.getElementsByClassName('noUi-origin');
            origins[0].setAttribute('disabled', true);
        }else{
            var origins = this.elRef.nativeElement.getElementsByClassName('noUi-origin');
            origins[0].removeAttribute('disabled')
        }
    }

	updateHandleValue() {
        if (this.handleValueRef) {
            if (this.handleValue !== null) {
                // this.elRef.nativeElement.querySelector('.noUi-handle').innerHTML = this.handleValue + "%";
            }
        }
    }

    ngOnDestroy(){
    	this.subscription.unsubscribe();
    }


    
}
