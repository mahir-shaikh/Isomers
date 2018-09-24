import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../../isomer';

@Component({
  selector: 'ism-charts-test',
  templateUrl: './charts-test.component.html',
  styleUrls: ['./charts-test.component.styl']
})
export class ChartsTestComponent implements OnInit {

  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log('Component initialized --- :)');
  }

}
