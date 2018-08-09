import { Injectable, EventEmitter } from '@angular/core';
import { Angular2HttpWrapper } from '../connect/angular2HttpWrapper';
import { ManifestService } from '../connect/manifest.service';


/// <reference path="./definitions.d.ts"/>
import PulseConnector = require('../connect/lib/connect')
const EMAIL_KEY = "useremail";
const EMAIL_QUESTION = "USER_EMAIL";

@Injectable()
export class EmailCaptureService {

    constructor(private httpWrapper: Angular2HttpWrapper) { }
    private connect;
    private state = {
        config: {
            questionsToSend: [{"questionName": EMAIL_QUESTION}],
            questionsToReceive: []
        }
    }

    saveEmail() {
            return new Promise((resolve, reject) => {
                if (this.isEmailAvailable()) {
                    this.connect = PulseConnector(this.httpWrapper, Promise);
                    this.connect.getQuestionIds(this.state).then((response) => {
                        let questionIds = response.questionIds,
                            emailQuestionId = questionIds[EMAIL_QUESTION],
                            userEmail = window.localStorage.getItem(EMAIL_KEY);

                        let payload = this.getPostDataPayload(emailQuestionId, userEmail);

                        this.postEmailToServer(payload).then(() => {
                            this.clearEmailFromStorage();
                            resolve();
                        }, reject);
                    })
                }
                else {
                    resolve();
                }
            });
    }

    clearEmailFromStorage() {
        window.localStorage.removeItem(EMAIL_KEY);
    }

    isEmailAvailable(): boolean {
        let email = window.localStorage.getItem(EMAIL_KEY);
        return (email) ? true : false;
    }

    getPostDataPayload(emailQuestionId, userEmail) {
        let state = {
            questionIds: [{"questionId": emailQuestionId, "responseText": userEmail }],
            config: {
                questionsToSend: [{"questionName": EMAIL_QUESTION, "responseText": userEmail, "questionId": emailQuestionId }]
            }
        };

        return state;
    }

    postEmailToServer(payload) {
        return this.connect.voteManyQuestionsFromJson(payload)
    }
}