import { Component, Input, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';

@Component({
    selector: 'tips',
    templateUrl: './tips.html',
    styleUrls: ['./tips.css'],
    providers: []
})

export class Tips implements OnInit {
    private content: string = "";
    
    constructor(private textEngineService: TextEngineService,private textEngine: TextEngineService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        let year = this.calcService.getValue("tlInputTeamYear");
        this.content = this.textEngineService.getText("InstructionsText");
    }

}
