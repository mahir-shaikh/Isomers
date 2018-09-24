import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'swot',
  templateUrl: './swot.component.html',
  styleUrls: ['./swot.component.styl']
})
export class SwotComponent implements OnInit {
	@Input() isReadOnly : boolean = false;

  constructor() { }

  ngOnInit() {
  }

}