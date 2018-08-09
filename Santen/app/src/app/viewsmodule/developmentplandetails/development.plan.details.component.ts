import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
    selector: 'developmentplandetails',
    templateUrl: './development.plan.details.component.html',
    styleUrls: ['./development.plan.details.component.css'],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DevelopmentPlanDetailsComponent implements OnInit, OnDestroy {
    @Input() readOnly: boolean = false;
    private currDate: string;
    private loeItems:Array<Number> = [];
    private subscription: Subscription;
    private DATA_LIST_ACQUISITION = ["Research", "Phase I", "Phase II", "Phase III"];

    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private router: Router, private cdRef: ChangeDetectorRef) { };

    ngOnInit() {
        for (var i = 2017; i <= 2040; i++) {
            this.loeItems.push(i);
        }

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.cdRef.markForCheck();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}