import { Component, Input, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';

@Component({
    selector: 'commitmentrow',
    templateUrl: './commitmentrow.component.html',
    styleUrls: ['./commitmentrow.component.css'],
    providers: []
})

export class CommitmentRowComponent implements OnInit {
    @Input() commitmentRowNo: number = 1;
    
    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        this.commitmentRowNo++;
    }
}
