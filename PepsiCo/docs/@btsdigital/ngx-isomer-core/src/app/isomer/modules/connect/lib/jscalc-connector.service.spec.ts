
import { JsCalcConnectorService } from './jscalc-connector.service';
import { CalcService } from '../../calc/calc.service';
import * as ConnectInterface from '../interfaces';

describe('JsCalcConnector', () => {
    let calcServiceMock: CalcService;
    let jsCalcConnector: JsCalcConnectorService;
    let manifest: ConnectInterface.Connect.Manifest;
    beforeEach(() => {
        calcServiceMock = {
            getValue: (key: string) => {
                return 'GetMock';
            },
            setValue: (key: string, value: string) => {
                return Promise.resolve('SetMock');
            }
        } as CalcService;
        jsCalcConnector = new JsCalcConnectorService(calcServiceMock);

        manifest = {
            config: {
                questionsToSend: [
                    { 'questionName': 'questionOne', 'rangeName': 'questionOne' },
                    { 'questionName': 'questionTwo', 'rangeName': 'questionTwo' },
                ],
                questionsToReceive: [
                    { 'questionName': 'questionTwo', 'rangeName': 'questionTwo', questionId: 123 },
                ],
                foremanquestionsToRecieve : [
                    { 'questionName': 'questionTwoF', 'rangeName': 'questionTwoF', questionId: 121 },
                ]
            }
        } as ConnectInterface.Connect.Manifest;
    });

    describe('readValues', () => {
        it('returns the values in the model for all, and only, the requested ranges', (done) => {
            jsCalcConnector.readValues(manifest)
                .then((state: ConnectInterface.Connect.Manifest) => {
                    expect(state.config.questionsToSend[0].responseText).toBe('GetMock');
                    expect(state.config.questionsToSend[1].responseText).toBe('GetMock');

                    expect(state.config.questionsToReceive[0].responseText).not.toBeDefined();
                    done();
                })
                .catch(fail);
        });

        it('fails for undefined values', (done) => {
            spyOn(calcServiceMock, 'getValue').and.returnValue(undefined);
            jsCalcConnector.readValues(manifest)
                .then((state: ConnectInterface.Connect.Manifest) => {
                    fail(state);
                })
                .catch((err) => {
                    let errmessage = 'jsCalc did not return a suitable response for question ' + manifest.config.questionsToSend[0].questionName;
                    errmessage += ' with range ' + manifest.config.questionsToSend[0].rangeName;
                    expect(err.message).toBe(errmessage);
                    done();
                });
        });
    });

    describe('writeValues', () => {
        it('sets values for all given fields', (done) => {
            manifest.votes = {
                123: 'Value to set'
            };
            manifest.foremanvotes = {
                121 : 'Foreman value to be set'
            };
            jsCalcConnector.writeValues(manifest)
                .then((state: ConnectInterface.Connect.Manifest) => {

                    expect(state.config.questionsToReceive[0].responseText).toBe('Value to set');
                    expect(state.config.foremanquestionsToRecieve[0].responseText).toBe('Foreman value to be set');
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
                .then((state: ConnectInterface.Connect.Manifest) => {
                    expect(state.config.questionsToReceive[0].responseText).not.toBeDefined();
                    expect(state.config.foremanquestionsToRecieve[0].responseText).not.toBeDefined();
                    expect(state.config.questionsToSend[0].responseText).not.toBeDefined();
                    expect(state.config.questionsToSend[1].responseText).not.toBeDefined();
                    done();
                })
                .catch(fail);
        });

    });
});
