import { SyncService } from '../sync/sync.service';
import { HttpWrapperService } from '../httpwrapper/http-wrapper.service';
import { ConnectService } from './connect.service';
import { RequestFailedError } from '../request-failed-error';
import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import * as ConnectInterface from '../interfaces';
import { equal } from 'assert';

describe('Connect Service Download', () => {
    let angular2HttpWrapper: HttpWrapperService,
        connect: ConnectService;

    let httpGetAllQuestionsCounter = 0;
    const httpMock = {
        postJson: (url, body) => {
            switch (url) {
                case '/Wizer/CloudFront/GetAllQuestions':
                    httpGetAllQuestionsCounter++;
                    return Promise.resolve([{ Id: 1337, ShortName: 'xxRBD1DBM2' }, { Id: 1338, ShortName: 'ForemanxxYear' }, { Id: 1339, ShortName: 'Track' }]);
                case '/Wizer/CloudFront/GetMyVotes':
                    return Promise.resolve({ success: true, votes: [{ QuestionId: 1337, ResponseText: 'Server response' }] });
                case '/Wizer/CloudFront/GetMyForemanVotes':
                    return Promise.resolve({ success: true, votes: [{ QuestionId: 1338, ResponseText: 'Server response for foreman' }] });
                case '/Wizer/CloudFront/VoteManyQuestionsFromJson':
                    return Promise.resolve({ success: true });
                default:
                    return Promise.resolve({ success: true });
            }
        }
    };
    let manifest;

    beforeEach(() => {
        angular2HttpWrapper = httpMock as HttpWrapperService;
        connect = new ConnectService(angular2HttpWrapper);
        httpGetAllQuestionsCounter = 0;

        manifest = {
            config: {
                hostName: 'NotARealHostname',
                eventTitle: 'TakedaBa2',
                questionsToSend: [
                    { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2', responseText: 'Mock response', questionId: 1 },
                ],
                questionsToReceive: [
                    { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2', responseText: 'Mock response', questionId: 1 },
                ],
                foremanquestionsToRecieve: [{ 'questionName': 'ForemanxxYear', 'rangeName': 'ForemanxxYear', responseText: 'Mock response', questionId: 2 }],
                trackQuestion: { 'questionName': 'Track', 'rangeName': 'Track', responseText: 'Mock response', questionId: 3 }
            },
            questionIds: [1],
            foremanQuestionIds: [2],
            trackQuestionId: 3
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
        it('should get my foreman votes', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();

            connect.getMyForemanVotes(manifest).catch(fail);
            tick(1);

            expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith(
                '/Wizer/CloudFront/GetMyForemanVotes',
                {
                    questionIds: [2],
                    trackQuestionId: 3
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
            spyOn(angular2HttpWrapper, 'postJson').and.callFake(() => Promise.resolve({ success: false }));
            let errResult = null;
            connect.voteManyQuestionsFromJson(manifest).then(fail).catch((err) => {
                errResult = err;
            });
            tick(1);
            expect(errResult instanceof RequestFailedError).toBe(true);
        }));

        it('get All questionanames', fakeAsync(() => {
            connect.getQuestionIds(manifest).then(function (result) {
                expect(result.questionIds['ForemanxxYear']).toBe(1338);
                expect(result.questionIds['xxRBD1DBM2']).toBe(1337);
                expect(result.questionIds['Track']).toBe(1339);
            });
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
                            { questionId: 1, responseText: 'Mock response' }
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
                connect.voteManyQuestionsFromJson(manifest).then(fail);
                tick(1);
            } catch (err) {
                errResult = err;
            }

            expect(errResult.message).toEqual('Question Ids not fetched');
        }));

        it('Should not request anything if no questionsToSend', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callThrough();
            manifest.config.questionsToSend = [];

            connect.voteManyQuestionsFromJson(manifest).catch(fail);
            tick(1);

            expect(angular2HttpWrapper.postJson).not.toHaveBeenCalled();
        }));

        it('Should handle request errors', fakeAsync(() => {
            spyOn(angular2HttpWrapper, 'postJson').and.callFake(() => Promise.resolve({ success: false }));
            let errResult = null;
            connect.voteManyQuestionsFromJson(manifest).then(fail).catch((err) => {
                errResult = err;
            });
            tick(1);
            expect(errResult instanceof RequestFailedError).toBe(true);
        }));
    });
});
