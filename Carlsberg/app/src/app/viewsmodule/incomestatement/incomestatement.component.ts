import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, RouterModule, ActivatedRoute, Data, Params } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';

@Component({
    selector: 'income-statement',
    templateUrl: './incomestatement.component.html',
    styleUrls: ['./incomestatement.component.styl']
})

export class IncomeStatementComponent {
    private subscription: Subscription;
    private heading: string;
    private tableIndex: Array < number > ;
    private animationBool: boolean = false;
    @Input() StatementOf: string;
    @Input() ParamValue: string;



    constructor(private router: Router, private route: ActivatedRoute, private calcService: CalcService, private textEngineService: TextEngineService) {};

    ngOnInit() {
        let self = this;
        this.Initialize();
        this.subscription = this.route.params.subscribe(() => {
            self.Initialize();
        });
    }

    Initialize() {
        this.animationBool = true;
        this.ParamValue = this.route.snapshot.params['StatementOf'];
        if (this.ParamValue === 'Brands') {
            this.heading = "IncomeStatementBrands";
            this.StatementOf = "Prod";
            this.tableIndex = [2, 3, 1, 4];

            
        } else if(this.ParamValue === 'Channels'){
            this.heading = "IncomeStatementChannels";
            this.StatementOf = "Ch";
            this.tableIndex = [1, 2, 3, 4];
        }

    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    animationDone(event){
        this.animationBool = false;
    }
}
