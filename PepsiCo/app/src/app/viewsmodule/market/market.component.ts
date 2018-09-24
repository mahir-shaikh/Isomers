import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router,RouterModule, ActivatedRoute, Data, Params } from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.styl']
})
export class MarketComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private MarketNumber:number;
    private MarketName:string = "";

    constructor(private router:Router, private route:ActivatedRoute) { }

    ngOnInit() {
        let self = this;
        this.Initialize();
        this.subscription = this.route.params.subscribe(() => {
            self.Initialize();
        });
    }

    Initialize(){
        this.MarketName = this.route.snapshot.params['regionName'];
        switch (this.MarketName) {
          case "vetera":
              this.MarketNumber = 1;
          break;
          case "escendia":
              this.MarketNumber = 2;
          break;
      }
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

}