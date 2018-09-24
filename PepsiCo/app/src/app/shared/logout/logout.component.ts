import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Angular2HttpWrapper } from '../../connect/angular2HttpWrapper'
import { HttpWrapperService } from '@btsdigital/ngx-isomer-core';
import { Router } from '@angular/router';

@Component({
    template: `<ng-content></ng-content>`
})
export class LogoutComponent implements OnInit, OnDestroy {

    constructor(private httpWrapper: HttpWrapperService, private router: Router) {
    }

    ngOnInit() {
        // pulse logout
        this.httpWrapper.postJson('/Wizer/CloudFront/Logout', null)
            .then(result => {
                // console.log('logged out from pulse ' + JSON.stringify(result))
                // clear all cookies
                // console.log('cookies before:'+ document.cookie)
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].split('=')[0].trim();
                    if (cookie.length > 0) {
                        // console.log(cookie)
                        document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                    }
                }
                // console.log('cookies after:'+ document.cookie)
                window.location.href = window.location.protocol + '//' + window.location.hostname + '/';
            });
    }

    ngOnDestroy() {
    }
}
