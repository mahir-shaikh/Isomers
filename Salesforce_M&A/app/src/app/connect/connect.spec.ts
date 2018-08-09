import { SyncService } from './sync.service';
import {Angular2HttpWrapper} from "./angular2HttpWrapper";
import {Connect, RequestFailedError} from "./connect";
import {discardPeriodicTasks, fakeAsync, tick} from '@angular/core/testing';
import Manifest = Connect.Manifest;

describe('SyncService Download', () => {
    let angular2HttpWrapper: Angular2HttpWrapper,
        connect: Connect;

    let httpGetAllQuestionsCounter = 0;
    const httpMock = {
        postJson: (url, body) => {
            switch(url) {
                case '/Wizer/CloudFront/GetAllQuestions':
                    httpGetAllQuestionsCounter++;
                    return Promise.resolve([{Id: 1337, ShortName: "xxRBD1DBM2"}]);
                case '/Wizer/CloudFront/GetMyVotes':
                    return Promise.resolve({ success: true, votes: [{QuestionId: 1337, ResponseText:"Server response"}]});
                case '/Wizer/CloudFront/VoteManyQuestionsFromJson':
                    return Promise.resolve({ success: true });
                default:
                    return Promise.resolve({ success: true });
            }
        }
    };
    let manifest;

    beforeEach(() => {
        angular2HttpWrapper = httpMock as Angular2HttpWrapper;
        connect = new Connect(angular2HttpWrapper);
        httpGetAllQuestionsCounter = 0;

        manifest = {
            config: {
                hostName: "NotARealHostname",
                eventTitle: 'TakedaBa2',
                questionsToSend: [
                    {"questionName": "xxRBD1DBM2", "rangeName": "xxRBD1DBM2", responseText: "Mock response", questionId: 1},
                ],
                questionsToReceive: [
                    {"questionName": "xxRBD1DBM2", "rangeName": "xxRBD1DBM2", responseText: "Mock response", questionId: 1},
                ]
            },
            questionIds: [1]
        };
    });

    describe('getMyVotes', () => {
        it('should get my votes', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();

            connect.getMyVotes(manifest).catch(fail);
            tick(1);

            expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith(
                '/Wizer/CloudFront/GetMyVotes',
                {
                    questionIds: [1]
                }
            );
        }));

        it('Should not request anything if no questionsToReceive', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();
            manifest.config.questionsToReceive = [];

            connect.getMyVotes(manifest).catch(fail);
            tick(1);

            expect(angular2HttpWrapper.postJson).not.toHaveBeenCalled();
        }));

        it('should handle request errors', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callFake(() => { return Promise.resolve({success: false}); });
            let errResult = null;
            connect.voteManyQuestionsFromJson(manifest).then(fail).catch((err) => {
                errResult = err;
            });
            tick(1);
            expect(errResult instanceof RequestFailedError).toBe(true);
        }));
    });

    describe('voteManyQuestionsFromJson', () => {
        it('Should add questionsToSend to body of request', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();

            connect.voteManyQuestionsFromJson(manifest).catch(fail);
            tick(1);

            expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith(
                '/Wizer/CloudFront/VoteManyQuestionsFromJson',
                {
                    votesJson: JSON.stringify({
                        votes: [
                            { questionId: 1, responseText: "Mock response"}
                        ]
                    })
                }
            );
        }));

        it('requires questionIds to have been fetched', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();
            delete manifest.questionIds;

            let errResult = null;
            try {
                connect.voteManyQuestionsFromJson(manifest).then(fail)
                tick(1);
            } catch(err) {
                errResult = err;
            }

            expect(errResult.message).toEqual("Question Ids not fetched");
        }));

        it('Should not request anything if no questionsToSend', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();
            manifest.config.questionsToSend = [];

            connect.voteManyQuestionsFromJson(manifest).catch(fail);
            tick(1);

            expect(angular2HttpWrapper.postJson).not.toHaveBeenCalled();
        }));

        it('Should handle request errors', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callFake(() => { return Promise.resolve({success: false}); });
            let errResult = null;
            connect.voteManyQuestionsFromJson(manifest).then(fail).catch((err) => {
                errResult = err;
            });
            tick(1);
            expect(errResult instanceof RequestFailedError).toBe(true);
        }));
    });
});