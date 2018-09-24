import { Injectable, EventEmitter } from '@angular/core';
// import { Angular2HttpWrapper } from '../connect/angular2HttpWrapper';
import { HttpWrapperService } from '@btsdigital/ngx-isomer-core';
// import { ManifestService } from '../connect/manifest.service';


// <reference path='./definitions.d.ts'/>
const PulseConnector = require('../connect/lib/connect.js');
const EMAIL_KEY = 'useremail';
const EMAIL_QUESTION = 'USER_EMAIL';

@Injectable()
export class EmailCaptureService {

    constructor(private httpWrapper: HttpWrapperService) { }
    private connect;
    private state = {
        config: {
            questionsToSend: [{ 'questionName': EMAIL_QUESTION }],
            questionsToReceive: []
        }
    };

    saveEmail() {
        return new Promise((resolve, reject) => {
            if (this.isEmailAvailable()) {
                this.connect = PulseConnector(this.httpWrapper, Promise);
                this.connect.getQuestionIds(this.state).then((response) => {
                    const questionIds = response.questionIds,
                        emailQuestionId = questionIds[EMAIL_QUESTION],
                        userEmail = window.localStorage.getItem(EMAIL_KEY);

                    const payload = this.getPostDataPayload(emailQuestionId, userEmail);

                    this.postEmailToServer(payload).then(() => {
                        this.clearEmailFromStorage();
                        resolve();
                    }, reject);
                });
            } else {
                resolve();
            }
        });
    }

    clearEmailFromStorage() {
        window.localStorage.removeItem(EMAIL_KEY);
    }

    isEmailAvailable(): boolean {
        const email = window.localStorage.getItem(EMAIL_KEY);
        return (email) ? true : false;
    }

    getPostDataPayload(emailQuestionId, userEmail) {
        const state = {
            questionIds: [{ 'questionId': emailQuestionId, 'responseText': userEmail }],
            config: {
                questionsToSend: [{ 'questionName': EMAIL_QUESTION, 'responseText': userEmail, 'questionId': emailQuestionId }]
            }
        };

        return state;
    }

    postEmailToServer(payload) {
        return this.connect.voteManyQuestionsFromJson(payload);
    }
}
