import {ActivatedRoute, Router} from '@angular/router';
import { CalcService } from './../../calcmodule/calc.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';     

@Component({
  selector: 'app-talentdevelopmentdata',
  templateUrl: './talentdevelopmentdata.component.html',
  styleUrls: ['./talentdevelopmentdata.component.styl']
})
export class TalentDevelopmentDataComponent implements OnInit {
	@Input() type : number = 0; // 0 = Consumer; 1 = Commercial
	private subscription: Subscription;
  private buttonItem:string[] = ["0","1","2","3","4","5"];

  constructor(private calcservice: CalcService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
  	let self = this;
    this.Initialize();
    this.subscription = this.route.params.subscribe(() => {
     self.Initialize();
    });
  }

  Initialize(){
	this.type = this.route.snapshot.params['type'] == "1" ? 1 : 0;
  }
}