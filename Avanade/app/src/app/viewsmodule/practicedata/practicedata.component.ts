import { Component, OnInit, Input } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'practicedata',
  templateUrl: './practicedata.component.html',
  styleUrls: ['./practicedata.component.styl']
})
export class PracticedataComponent implements OnInit {
    @Input() practiceNumber:number = 0;
    private arrRangeSuffix = ["","V2","V3"]

    constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

    ngOnInit() {
    }

}