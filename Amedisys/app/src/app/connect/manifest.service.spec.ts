import Manifest = Connect.Manifest;
import {ManifestService} from "./manifest.service";

describe('ManifestService', () => {

    let manifestService: ManifestService;
    let manifestMock: Manifest;
    beforeEach(() => {
        manifestService = new ManifestService();

        manifestMock = {
            config: {
                hostName: "NotARealHostname",
                eventTitle: "Some event",
                questionsToSend: [
                    {"questionName": "questionOne", "rangeName": "questionOne", "questionId": 123},
                    {"questionName": "questionTwo", "rangeName": "questionTwo", "questionId": 124},
                ],
                questionsToReceive: [
                    {"questionName": "questionTwo", "rangeName": "questionTwo", "questionId": 1234},
                ]
            }
        };
        manifestService.SetState(manifestMock as Manifest);
    });

    describe('Get', () =>{
        it('returns latest modified Manifest', () => {
            expect(manifestService.Get()).toBe(manifestMock);
            manifestMock.votes = { 1: "Vote"};

            expect(manifestService.Get()).toBe(manifestMock);
        });

        it('Changes internal state if subscribers change it', (done) => {
            manifestService.State.subscribe((m)=> {
                m.votes = { 1: "Vote"};
                expect(manifestService.Get().votes).toEqual({ 1: "Vote"});
                done();
            });
            manifestService.SetState(manifestService.Get());
        })
    });

    describe('Set', () => {

    });
});