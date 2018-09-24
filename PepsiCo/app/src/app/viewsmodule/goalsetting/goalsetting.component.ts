import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'goal-setting',
  templateUrl: './goalsetting.component.html',
  styleUrls: ['./goalsetting.component.styl']
})
export class GoalsettingComponent implements OnInit {
	@Input() isReadOnly: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}