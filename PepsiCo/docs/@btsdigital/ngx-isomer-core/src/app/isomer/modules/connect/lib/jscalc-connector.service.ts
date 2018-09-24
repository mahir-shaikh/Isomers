import { Injectable } from '@angular/core';
import { Connect } from '../interfaces';
import { CalcService } from '../../calc/calc.service';

/**
 * This is a wrapper class for the JScalc module
 * This will give us an easy access to directly call the jsCalc functions for reading and writing in typescript
 */
@Injectable()
export class JsCalcConnectorService {
    /**
    * Constructor connect-throttler service
    *
    * @param {CalcService} jsCalcApi CalcService instance
    *
    */
    constructor(private jsCalcApi: CalcService) { }

    /**
    * Read a value from jsCalcApi which would in turn read it from model
    */
    readValues = (state: Connect.Manifest): Promise<Connect.Manifest> => {
        return Promise.resolve().then(() => {
            for (const i of Object.keys(state.config.questionsToSend)) {
                const q = state.config.questionsToSend[i];
                q.responseText = this.jsCalcApi.getValue(q.rangeName);
                if (typeof q.responseText === 'undefined') {
                    throw new Error('jsCalc did not return a suitable response for question ' + q.questionName + ' with range ' + q.rangeName);
                }
            }

            return state;
        });
    }

    /**
   * Write a value to jsCalcApi which would in turn write it to model
   */
    writeValues = (state: Connect.Manifest): Promise<Connect.Manifest> => {
        return Promise.resolve().then(() => {
            if (!state.votes) {
                throw new Error('State should contain a votes object with questionIds and responseText');
            }
            const promises = [];
            let question;

            for (const i of Object.keys(state.config.questionsToReceive)) {
                question = state.config.questionsToReceive[i];
                question.responseText = state.votes[question.questionId];

                // Only write values actually returned in the votes array.
                if (typeof question.responseText !== 'undefined') {
                    const valuePromise = this.jsCalcApi.setValue(question.rangeName, question.responseText);
                    promises.push(valuePromise);
                }
            }
            if (state.config.foremanquestionsToRecieve) {
                for (const i of Object.keys(state.config.foremanquestionsToRecieve)) {
                    question = state.config.foremanquestionsToRecieve[i];
                    if (state.foremanvotes) {
                        question.responseText = state.foremanvotes[question.questionId];

                        // Only write values actually returned in the fore man votes array.
                        if (typeof question.responseText !== 'undefined') {
                            const valuePromise = this.jsCalcApi.setValue(question.rangeName, question.responseText);
                            promises.push(valuePromise);
                        }
                    }
                }
            }
            return Promise.all(promises).then(() => {
                return state;
            });
        });
    }
}
