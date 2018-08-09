
import JsCalcConnector from "./jscalc-connector";
import JsCalcApi = Connect.JsCalcApi;
import Manifest = Connect.Manifest;

describe('JsCalcConnector', () => {
    let calcServiceMock: JsCalcApi;
    let jsCalcConnector: JsCalcConnector;
    let manifest: Manifest;
    beforeEach(() => {
        calcServiceMock = {
            getValue: (key: string) => {
                return "GetMock";
            },
            setValue: (key: string, value: string) => {
                return Promise.resolve("SetMock");
            }
        } as JsCalcApi;
        jsCalcConnector = new JsCalcConnector(calcServiceMock);

        manifest = {
            config: {
                questionsToSend: [
                    {"questionName": "questionOne", "rangeName": "questionOne"},
                    {"questionName": "questionTwo", "rangeName": "questionTwo"},
                ],
                questionsToReceive: [
                    {"questionName": "questionTwo", "rangeName": "questionTwo", questionId: 123},
                ]
            }
        } as Manifest;
    });

    describe('readValues', () =>{
        it('returns the values in the model for all, and only, the requested ranges', (done) => {
            jsCalcConnector.readValues(manifest)
                .then((state: Manifest) => {
                    expect(state.config.questionsToSend[0].responseText).toBe("GetMock");
                    expect(state.config.questionsToSend[1].responseText).toBe("GetMock");

                    expect(state.config.questionsToReceive[0].responseText).not.toBeDefined();
                    done();
                })
                .catch(fail);
        });

        it('fails for undefined values', (done) => {
            spyOn(calcServiceMock, 'getValue').and.returnValue(undefined);
            jsCalcConnector.readValues(manifest)
                .then((state: Manifest) => {
                    fail(state);
                })
                .catch((err) => {
                    expect(err.message).toBe("jsCalc did not return a suitable response for question " + manifest.config.questionsToSend[0].questionName + " with range " + manifest.config.questionsToSend[0].rangeName);
                    done();
                });
        });
    });

    describe('writeValues', () =>{
        it('sets values for all given fields', (done) => {
            manifest.votes = {
                123: 'Value to set'
            };
            jsCalcConnector.writeValues(manifest)
                .then((state: Manifest) => {

                    expect(state.config.questionsToReceive[0].responseText).toBe("Value to set");

                    expect(state.config.questionsToSend[0].responseText).not.toBeDefined();
                    expect(state.config.questionsToSend[1].responseText).not.toBeDefined();
                    done();
                })
                .catch(fail);
        });

        it('does nothing if the value doesn\'t exist', (done) => {
            manifest.votes = {
                1234: 'Value to set'
            };
            jsCalcConnector.writeValues(manifest)
                .then((state: Manifest) => {
                    expect(state.config.questionsToReceive[0].responseText).not.toBeDefined();

                    expect(state.config.questionsToSend[0].responseText).not.toBeDefined();
                    expect(state.config.questionsToSend[1].responseText).not.toBeDefined();
                    done();
                })
                .catch(fail);
        });

    });
});