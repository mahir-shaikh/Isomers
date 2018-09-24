import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LoggerService } from '../../isomer/modules/services/logger/logger.service';
import { CalcService } from '../../isomer/modules/calc';

@Component({
  selector: 'ism-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  constructor(private logger: LoggerService, private calcService: CalcService) {
    this.logger.log('dasboard init called');
  }

  ngOnInit() {
  }

}
