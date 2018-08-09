import Manifest = Connect.Manifest;
import HttpWrapper = Connect.HttpWrapper;
import Question = Connect.Question;

export class Connect {
    constructor(private _http: HttpWrapper) { }

    getQuestionIds = (state: Manifest): Promise<Manifest> => {
        const options = {
            questionNames: Connect.getAllQuestionNames(state)
        };
        return this._http.postJson('/Wizer/CloudFront/GetAllQuestions', options)
            .then(Connect.handleAuthenticationError)
            .then((questions) => {
                // We always expect an array of questions
                if(Array.isArray(questions)) {
                    let questionIds = {};
                    for(const q of questions) {
                        questionIds[q.ShortName] = q.Id;
                    }
                    return Connect.mapAndValidateQuestionIds(state, questionIds);
                }
                //Otherwise, try logging in again if no other error is readily detectable
                else {
                    if(typeof questions.success !== 'undefined' && !questions.success) {
                        throw new RequestFailedError(questions);
                    }
                    throw new AuthenticationError(questions);
                }
            });
    };

    voteManyQuestionsFromJson = (state): Promise<Manifest> => {
        let responses = [];

        // Detect if questionIds have been fetched at all
        if(!state.questionIds) throw new Error("Question Ids not fetched");

        for(const q of state.config.questionsToSend) {
            responses.push({
                questionId: parseInt(q.questionId),
                responseText: q.responseText
            });
        }

        if(responses.length == 0) {
            return Promise.resolve(state);
        }
        let payload = {
            votes: responses
        };

        return this._http.postJson(
            '/Wizer/CloudFront/VoteManyQuestionsFromJson',
            { votesJson: JSON.stringify(payload) }
        )
        .then(Connect.handleAuthenticationError)
        .then((res) => {
            if(!res.success) {
                throw new RequestFailedError(res);
            }
            return state;
        });
    };

    getMyVotes = (state: Manifest): Promise<Manifest> => {
        let questionIds = {
            questionIds: Connect.getQuestionIdsToReceive(state)
        };

        if(questionIds.questionIds.length == 0) {
            state.votes = {};
            return Promise.resolve(state);
        }

        return this._http.postJson('/Wizer/CloudFront/GetMyVotes', questionIds)
        .then(Connect.handleAuthenticationError)
        .then((res) => {
            if(res.success) {
                state.votes = {};
                for(const vote of res.votes) {
                    state.votes[vote.QuestionId] = vote.ResponseText;
                }

                return state;
            } else {
                throw new RequestFailedError(res);
            }
        });
    };

    private static getAllQuestionNames(state) {
        const names = [];
        for(const q of state.config.questionsToSend) {
            names.push(q.questionName);
        }
        for(const q of state.config.questionsToReceive) {
            names.push(q.questionName);
        }

        return names;
    }

    private static mapAndValidateQuestionIds(state: Manifest, questionIds: any): Manifest {
        // Note: We are mutating the state object passed in.
        // Attach id to questions for convenience and later use
        // All names should exist, otherwise reject as some questions are invalid
        for(let i in state.config.questionsToSend) {
            const id = questionIds[state.config.questionsToSend[i].questionName];

            if(typeof id === "undefined" || id === null) {
                throw new Error("No question id received for " + state.config.questionsToSend[i].questionName);
            }

            state.config.questionsToSend[i].questionId = id
        }
        for(let i in state.config.questionsToReceive) {
            const id = questionIds[state.config.questionsToReceive[i].questionName];
            if(typeof id === "undefined" || id === null) {
                throw new Error("No question id received for " + state.config.questionsToReceive[i].questionName);
            }

            state.config.questionsToReceive[i].questionId = id;
        }
        //Redundant assignment to keep complete list of questions
        //+ be able to quickly see if they have been fetched
        state.questionIds = questionIds;
        return state;
    }

    private static getQuestionIdsToReceive(state: Manifest): any[] {
        const ids = [];

        // Detect if questionIds have been fetched at all
        if(!state.questionIds) return ids;

        for(const q of state.config.questionsToReceive) {
            ids.push(q.questionId);
        }

        return ids;
    }

    private static handleAuthenticationError(response): any {
        if(response.success === false && Connect.isAuthenticationMessage(response.message)) {
            throw new AuthenticationError();
        }
        return response;
    }

    private static isAuthenticationMessage(message: string): boolean {
        return message === "Authentication fails or insufficient privileges." || message === "Not authenticated." || message === "You must be authorized first.";
    }
}

export class RequestFailedError {
    success: boolean;
    message: string;

    constructor(res: any) {
        this.message = res.errCode+":"+ (res.errMsg || res.message);
        this.success = res.success;
    }
}

export class AuthenticationError{
    originalObj: any;
    unauthenticated: boolean;

    constructor(object?: any) {
        this.originalObj = object;
        this.unauthenticated = true;
    }
}