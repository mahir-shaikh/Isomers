import {CalcService} from '../../calcmodule/calc.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pnl-component',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.styl']
})
export class PNLComponent implements OnInit {

    constructor(private calcService: CalcService) {
        
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}