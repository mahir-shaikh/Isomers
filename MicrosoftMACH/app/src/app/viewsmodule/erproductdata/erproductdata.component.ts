import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';


@Component({
	selector: 'erproduct-data',
	templateUrl: './erproductdata.component.html',
	styleUrls: ['./erproductdata.component.styl']
})

export class ERProductDataComponent implements OnInit, OnDestroy{
	@Input() prodNo: number;
	private itemsArray = ["0","1","2","3","4","5"];
	private chartRangeRef: string;
	private subscription: Subscription;
	private shouldAnimate: boolean = false;
	
	constructor( private calcService: CalcService, private textEngineService : TextEngineService, private router:Router, private route:ActivatedRoute) { };

	ngOnInit() {
		let self = this;
		this.Initialize();
		this.subscription = this.route.params.subscribe(() => {
		 self.Initialize();
		});
	}

	ngOnDestroy() {
	}

	Initialize(){
		this.prodNo = this.route.snapshot.params['prod'];
		this.shouldAnimate = true;
		// this.chartRangeRef = '[[tlOutputGraphsProd' + this.prodNo + 'Offering1Opening,tlOutputGraphsProd' + this.prodNo + 'Offering1Closing,tlOutputGraphsProd' + this.prodNo + 'Offering1IndAvg],[tlOutputGraphsProd' + this.prodNo + 'Offering2Opening,tlOutputGraphsProd' + this.prodNo + 'Offering2Closing,tlOutputGraphsProd' + this.prodNo + 'Offering2IndAvg]]';
		this.chartRangeRef = 'tlOutputGraphsProd' + this.prodNo + 'Offering1Closing, tlOutputGraphsProd' + this.prodNo + 'Offering2Closing, tlOutputGraphsProd' + this.prodNo + 'Offering1Opening, tlOutputGraphsProd' + this.prodNo + 'Offering2Opening, tlOutputGraphsProd' + this.prodNo + 'Offering1IndAvg, tlOutputGraphsProd' + this.prodNo + 'Offering2IndAvg';
		
		setTimeout(()=>{
			this.shouldAnimate = false;
		},1000)
	}
}
