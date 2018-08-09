import { Component, OnInit, Input } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.styl']
})
export class ScenarioComponent implements OnInit {
	@Input() showBlankScenario1: boolean = false;
    @Input() showBlankScenario2: boolean = false;
    @Input() showBlankScenario3: boolean = false;
    @Input() showBlankScenario4: boolean = false;

  constructor(private calcService: CalcService, private textEngineService : TextEngineService) { }

  ngOnInit() {
  }

}