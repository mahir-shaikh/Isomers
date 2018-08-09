import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../utils';
import { Observable } from 'rxjs';

@Component({
    selector: 'im-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.css'],
})

export class LandingPageComponent {
    private isLoading = true;

    constructor( private router: Router) { };

    ngOnInit() {
        let subscription = Observable.interval(3000).subscribe(() => {
            this.isLoading = false;
            subscription.unsubscribe();
        });
    }

    onClick(){
        this.router.navigateByUrl(ROUTES.DEVELOPMENT_PLAN);
    }

}
