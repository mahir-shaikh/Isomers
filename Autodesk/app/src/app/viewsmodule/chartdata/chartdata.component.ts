import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { ROUTES } from '../../utils';
import { CalcService } from '../../calcmodule';

@Component({
    selector: 'chart-data',
    templateUrl: './chartdata.component.html',
    styleUrls: ['./chartdata.component.styl'],
})

export class ChartDataComponent {
    private NoOfVisiblePaths = [];
    private productSelected = [0,0,0,0,0,0,0,0];
    private isLoaded : boolean = false;

    constructor( private router: Router, private calcService: CalcService) { };

    ngOnInit() {
        let totalActivePath = this.calcService.getValue("calcTotalActivePaths");
        this.NoOfVisiblePaths = [];
        if(totalActivePath == 0){
            this.NoOfVisiblePaths.push(1);
        }else{
            for(let i = 0; i < totalActivePath; i++){
                this.NoOfVisiblePaths.push(1);
            }
        }

        for(let i=0, len = this.NoOfVisiblePaths.length; i<len ;i++){
            let ProductName = this.calcService.getValue("tlInputPath"+(i+1)+"_ProdMT",true);
            let SwitchName = this.calcService.getValue("tlInputPath"+(i+1)+"_ProdSub",true);
            let PleaseSelect = this.calcService.getValue("nmSelect");
            if(ProductName != PleaseSelect && SwitchName != PleaseSelect){
                this.productSelected[i] = 1;
            }
        }
        this.isLoaded = true;
    }
}
