import { Component, OnInit } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { CalcService } from '../../calcmodule';
import { Router,RouterModule, ActivatedRoute, Data, Params } from '@angular/router';
import { Subscription } from 'rxjs';     

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.styl']
})
export class PracticeComponent implements OnInit {
    private subscription: Subscription;
    private PracticeNumber:number;
    private PracticeName:string = "";

    constructor(private calcService: CalcService, private textEngineService : TextEngineService, private router:Router, private route:ActivatedRoute) { }

    ngOnInit() {
        let self = this;
        this.Initialize();
        this.subscription = this.route.params.subscribe(() => {
         self.Initialize();
        });
    }

    Initialize(){
        this.PracticeName = this.route.snapshot.params['practiceName'];
        switch (this.PracticeName) {
          case "CRM":
              this.PracticeNumber = 1;
          break;
          case "HCM":
              this.PracticeNumber = 2;
          break;
          case "Futuria":
              this.PracticeNumber = 3;
          break;
      }
    }

}