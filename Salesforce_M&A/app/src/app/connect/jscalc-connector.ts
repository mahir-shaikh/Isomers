import Manifest = Connect.Manifest;
import JsCalcApi = Connect.JsCalcApi;

export default class JsCalcConnector {
    constructor(private jsCalcApi: JsCalcApi) {}

    readValues = (state: Manifest): Promise<Manifest> => {
        return Promise.resolve().then(() => {
            for(let i in state.config.questionsToSend) {
                let q = state.config.questionsToSend[i];
                q.responseText = this.jsCalcApi.getValue(q.rangeName);
                if(typeof q.responseText == "undefined") {
                    throw new Error("jsCalc did not return a suitable response for question " + q.questionName + " with range " + q.rangeName);
                }
            }

            return state;
        });
    };

    writeValues = (state: Manifest): Promise<Manifest> => {
        return Promise.resolve().then(() => {
            if(!state.votes) {
                throw new Error("State should contain a votes object with questionIds and responseText");
            }
            let promises = [], question;

            for(let i in state.config.questionsToReceive) {
                question = state.config.questionsToReceive[i];
                question.responseText = state.votes[question.questionId];

                // Only write values actually returned in the votes array.
                if(typeof question.responseText !== "undefined") {
                    let valuePromise = this.jsCalcApi.setValue(question.rangeName, question.responseText);
                    promises.push(valuePromise);
                }
            }

            return Promise.all(promises).then(() => {
                return state;
            });
        })
    };
}