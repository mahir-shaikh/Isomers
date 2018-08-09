import { Injectable } from '@angular/core';
import { Angular2HttpWrapper } from '../connect/angular2HttpWrapper';
import { Email } from '../utils';
const FROM_EMAIL = "santen@btspulse.com";

@Injectable()
export class EmailService {

    private emailServiceUrl = '/Wizer/CloudFront/SendEmail';


    constructor(private httpWrapper: Angular2HttpWrapper) { }

    sendEmail(email: Email): Promise<any> {
        if (!email) {
            return Promise.reject("Email parameter is empty");
        }
        if (!email.to) {
            return Promise.reject("No valid senders found in to field");
        }
        if (!email.body) {
            return Promise.reject("Email body is empty or not defined");
        }
        email.body = email.body.replace(/\n/g,"\r\n");
        return new Promise((resolve, reject) => {
            this.httpWrapper
                .postJson(this.emailServiceUrl, email).then(resolve, reject);
        });
    }
}