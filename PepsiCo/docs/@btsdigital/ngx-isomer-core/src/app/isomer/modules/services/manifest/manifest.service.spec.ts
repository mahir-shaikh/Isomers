
import * as ConnectInterface from '../../connect/interfaces';
import { ManifestService } from './manifest.service';

describe('ManifestService', () => {

    let manifestService: ManifestService;
    let manifestMock: ConnectInterface.Connect.Manifest;

    beforeEach(() => {


        manifestMock = {
            config: {
                hostName: 'NotARealHostname',
                eventTitle: 'Some event',
                questionsToSend: [
                    { 'questionName': 'questionOne', 'rangeName': 'questionOne', 'questionId': 123 },
                    { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 124 },
                ],
                questionsToReceive: [
                    { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 1234 },
                ],
                foremanquestionsToRecieve: null,
                trackQuestion: null
            }
        };
        manifestService = new ManifestService();
        manifestService.setConfig(manifestMock);
        manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);
    });

    describe('Get', () => {
        it('returns latest modified Manifest', () => {
            expect(manifestService.Get()).toBe(manifestMock);
            manifestMock.votes = { 1: 'Vote' };

            expect(manifestService.Get()).toBe(manifestMock);
        });

        it('Changes internal state if subscribers change it', (done) => {
            manifestService.State.subscribe((m) => {
                m.votes = { 1: 'Vote' };
                expect(manifestService.Get().votes).toEqual({ 1: 'Vote' });
                done();
            });
            manifestService.SetState(manifestService.Get());
        });
    });

    describe('Set', () => {
        it('returns Manifest', () => {
            manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);
            expect(manifestService.Get()).toBe(manifestMock);
        });

        it('validate manifest fails when questionsToSend are absent', () => {
            let faultmanifestMock = {
                config: {
                    hostName: 'NotARealHostname',
                    eventTitle: 'Some event',
                    questionsToSend: null,
                    questionsToReceive: [
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 1234 },
                    ],
                    foremanquestionsToRecieve: null,
                    trackQuestion: null
                }
            };
            const ermsg = 'Both config.questionsToSend and config.questionsToReceive must be present in manifest';
            expect(function () { manifestService.setConfig(faultmanifestMock); }).toThrow(new Error(ermsg));

            faultmanifestMock = {
                config: {
                    hostName: 'NotARealHostname',
                    eventTitle: 'Some event',
                    questionsToSend: [
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 1234 },
                    ],
                    questionsToReceive: null,
                    foremanquestionsToRecieve: null,
                    trackQuestion: null
                }
            };
            const errrmsg = 'Both config.questionsToSend and config.questionsToReceive must be present in manifest';
            expect(function () { manifestService.setConfig(faultmanifestMock); }).toThrow(new Error(errrmsg));
        });

        it('validate manifest fails when hostName || eventtitle are absent', () => {
            let faultmanifestMock = {
                config: {
                    hostName: 'NotARealHostname',
                    eventTitle: null,
                    questionsToSend: [
                        { 'questionName': 'questionOne', 'rangeName': 'questionOne', 'questionId': 123 },
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 124 },
                    ],
                    questionsToReceive: [
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 1234 },
                    ],
                    foremanquestionsToRecieve: null,
                    trackQuestion: null
                }
            };

            expect(function () { manifestService.setConfig(faultmanifestMock); }).toThrow(new Error('config.hostName and config.eventTitle must both be present in the manifest'));

            faultmanifestMock = {
                config: {
                    hostName: null,
                    eventTitle: 'Some event',
                    questionsToSend: [
                        { 'questionName': 'questionOne', 'rangeName': 'questionOne', 'questionId': 123 },
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 124 },
                    ],
                    questionsToReceive: [
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 1234 },
                    ],
                    foremanquestionsToRecieve: null,
                    trackQuestion: null
                }
            };

            expect(function () { manifestService.setConfig(faultmanifestMock); }).toThrow(new Error('config.hostName and config.eventTitle must both be present in the manifest'));

            faultmanifestMock = {
                config: {
                    hostName: null,
                    eventTitle: 'Some event',
                    questionsToSend: [
                        { 'questionName': null, 'rangeName': 'questionOne', 'questionId': 123 },
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 124 },
                    ],
                    questionsToReceive: [
                        { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', 'questionId': 1234 },
                    ],
                    foremanquestionsToRecieve: null,
                    trackQuestion: null
                }
            };
            const errormessage = 'Manifest inconsistency found at config.questionsToSend at index: 0 (Missing rangeName or questionName)';
            expect(function () { manifestService.setConfig(faultmanifestMock); }).toThrow(new Error(errormessage));
        });

    });
});
