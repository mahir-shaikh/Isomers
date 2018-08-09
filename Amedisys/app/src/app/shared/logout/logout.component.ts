import { Component, OnInit, OnDestroy } from '@angular/core'
import { Angular2HttpWrapper } from '../../connect/angular2HttpWrapper'
import { Router } from '@angular/router';

@Component({
    template:`<ng-content></ng-content>`
})
export class LogoutComponent implements OnInit, OnDestroy {

    constructor(private httpWrapper: Angular2HttpWrapper, private router: Router) {
    }

    ngOnInit() {
        // pulse logout
        let logoutUrl = (process.env.CDN0LOCAL1LOCALHOST2 == 0) ? '/Wizer/CloudFront/Logout' : '/Wizer/Wizer/Logout';
        this.httpWrapper.postJson(logoutUrl, null)
        .then(result => {
            // console.log('logged out from pulse ' + JSON.stringify(result))
            // clear all cookies
            // console.log('cookies before:'+ document.cookie)
            var cookies = document.cookie.split(';')
            for(var i = 0; i<cookies.length; i++) {
                var cookie = cookies[i].split('=')[0].trim()
                if (cookie.length > 0) {
                    // console.log(cookie)
                    document.cookie = cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
                }
            }
            // console.log('cookies after:'+ document.cookie)
            if (process.env.CDN0LOCAL1LOCALHOST2 == 1) {
                window.location.href = window.location.protocol + "//" + window.location.hostname + "/Amedisys/login/";
            }
            else {
                window.location.href = window.location.protocol + "//" + window.location.hostname + ((window.location.port) ? ":" + window.location.port : "") + "/";
            }
        })
    }

    ngOnDestroy() {
    }
}
