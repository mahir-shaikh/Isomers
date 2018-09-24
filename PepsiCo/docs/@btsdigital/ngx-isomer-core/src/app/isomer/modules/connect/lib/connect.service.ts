import { Injectable } from '@angular/core';
import * as ConnectInterface from '../interfaces';
import { AuthenticationError } from '../authentication-error';
import { RequestFailedError } from '../request-failed-error';
import { HttpWrapperService } from '../httpwrapper/http-wrapper.service';
import { stagger } from '@angular/core/src/animation/dsl';

/**
* This is the service which calls the api functions and returns values needed
*/
@Injectable()
export class ConnectService {
    /**
    * Constructor Connect service
    *
    * @param {HttpWrapperService} httpWrapperService HttpWrapperService instance
    *
    */
    constructor(private httpWrapperService: HttpWrapperService) { }

    /**
 * loop throug the maniges and fetch all used question names from the questionsToReceive and questionsToSend nodes
 */
    private static getAllQuestionNames(state: ConnectInterface.Connect.Manifest) {
        const names = [];
        for (const q of state.config.questionsToSend) {
            names.push(q.questionName);
        }
        for (const q of state.config.questionsToReceive) {
            names.push(q.questionName);
        }
        if (state.config.foremanquestionsToRecieve) {
            for (const q of state.config.foremanquestionsToRecieve) {
                names.push(q.questionName);
            }
        }
        if (state.config.trackQuestion) {
            names.push(state.config.trackQuestion.questionName);
        }
        return names;
    }

    /**
    * We recieve a list of questions ids from the api get questionIds
    * This function would substitute the correct id again the correct name in manifest
    */
    private static mapAndValidateQuestionIds(state: ConnectInterface.Connect.Manifest, questionIds: any): ConnectInterface.Connect.Manifest {
        // Note: We are mutating the state object passed in.
        // Attach id to questions for convenience and later use
        // All names should exist, otherwise reject as some questions are invalid
        for (const i of Object.keys(state.config.questionsToSend)) {
            const id = questionIds[state.config.questionsToSend[i].questionName];

            if (typeof id === 'undefined' || id === null) {
                throw new Error('No question id received for ' + state.config.questionsToSend[i].questionName);
            }

            state.config.questionsToSend[i].questionId = id;
        }
        for (const i of Object.keys(state.config.questionsToReceive)) {
            const id = questionIds[state.config.questionsToReceive[i].questionName];
            if (typeof id === 'undefined' || id === null) {
                throw new Error('No question id received for ' + state.config.questionsToReceive[i].questionName);
            }

            state.config.questionsToReceive[i].questionId = id;
        }
        if (state.config.foremanquestionsToRecieve) {
            state.foremanQuestionIds = {};

            for (const i of Object.keys(state.config.foremanquestionsToRecieve)) {
                const id = questionIds[state.config.foremanquestionsToRecieve[i].questionName];
                if (typeof id === 'undefined' || id === null) {
                    throw new Error('No question id received for ' + state.config.foremanquestionsToRecieve[i].questionName);
                }

                state.config.foremanquestionsToRecieve[i].questionId = id;
                state.foremanQuestionIds[state.config.foremanquestionsToRecieve[i].questionName] = id;
            }
        }
        if (state.config.trackQuestion) {
            const id = questionIds[state.config.trackQuestion.questionName];
            if (typeof id === 'undefined' || id === null) {
                throw new Error('No question id received for trackquestion ' + state.config.trackQuestion.questionName);
            }
            state.config.trackQuestion.questionId = id;
            state.trackQuestionId = id;
        }
        // Redundant assignment to keep complete list of questions
        // + be able to quickly see if they have been fetched
        state.questionIds = questionIds;
        return state;
    }

    /**
    * loop through the manifest and find the question ids of all the questionToRecieve
    */
    private static getQuestionIdsToReceive(state: ConnectInterface.Connect.Manifest): any[] {
        const ids = [];

        // Detect if questionIds have been fetched at all
        if (!state.questionIds) {
            return ids;
        }

        for (const q of state.config.questionsToReceive) {
            ids.push(q.questionId);
        }

        return ids;
    }

    /**
   * loop through the manifest and find the question ids of all the foremanquestionToRecieve
   */
    private static getForemanQuestionIdsToReceive(state: ConnectInterface.Connect.Manifest): any[] {
        const ids = [];

        // Detect if questionIds have been fetched at all
        if (!state.foremanQuestionIds) {
            return ids;
        }

        for (const q of state.config.foremanquestionsToRecieve) {
            ids.push(q.questionId);
        }

        return ids;
    }

    /**
   * loop through the manifest and find the track question id
   */
    private static getTrackQuestionId(state: ConnectInterface.Connect.Manifest): number {
        let trackQuestionId: number;

        // Detect if trackQuestionId have been fetched at all
        if (!state.trackQuestionId) {
            return trackQuestionId;
        }
        trackQuestionId = state.config.trackQuestion.questionId;
        return trackQuestionId;
    }

    /**
    * Handles authentication errors while api calls
    */
    private static handleAuthenticationError(response): any {
        if (response.success === false && ConnectService.isAuthenticationMessage(response.message)) {
            throw new AuthenticationError();
        }
        return response;
    }

    /**
    * Check if the error thron by api call is an authentication error
    */
    private static isAuthenticationMessage(message: string): boolean {
        return message === 'Authentication fails or insufficient privileges.' || message === 'Not authenticated.' || message === 'You must be authorized first.';
    }

    /**
   * Get questions ids of the shornames mentioned in manifest configuration
   */
    getQuestionIds = (state: ConnectInterface.Connect.Manifest): Promise<ConnectInterface.Connect.Manifest> => {
        const options = {
            questionNames: ConnectService.getAllQuestionNames(state)
        };
        return this.httpWrapperService.postJson('/Wizer/CloudFront/GetAllQuestions', options)
            .then(ConnectService.handleAuthenticationError)
            .then((questions) => {
                // We always expect an array of questions
                if (Array.isArray(questions)) {
                    const questionIds = {};
                    for (const q of questions) {
                        questionIds[q.ShortName] = q.Id;
                    }
                    return ConnectService.mapAndValidateQuestionIds(state, questionIds);
                } else {// Otherwise, try logging in again if no other error is readily detectable
                    if (typeof questions.success !== 'undefined' && !questions.success) {
                        throw new RequestFailedError(questions);
                    }
                    throw new AuthenticationError(questions);
                }
            });
    }

    /**
   * Save the votes to the backed in bulk.
   * This is used by UploadQueue in connect throttler
   */
    voteManyQuestionsFromJson = (state): Promise<ConnectInterface.Connect.Manifest> => {
        const responses = [];

        // Detect if questionIds have been fetched at all
        if (!state.questionIds) {
            throw new Error('Question Ids not fetched');
        }

        for (const q of state.config.questionsToSend) {
            responses.push({
                questionId: parseInt(q.questionId, 10),
                responseText: q.responseText
            });
        }

        if (responses.length === 0) {
            return Promise.resolve(state);
        }
        const payload = {
            votes: responses
        };

        return this.httpWrapperService.postJson(
            '/Wizer/CloudFront/VoteManyQuestionsFromJson',
            { votesJson: JSON.stringify(payload) }
        )
            .then(ConnectService.handleAuthenticationError)
            .then((res) => {
                if (!res.success) {
                    throw new RequestFailedError(res);
                }
                return state;
            });
    }

    /**
   * Fetch my votes from backend.
   * This is used by downloadQueue in connect throttler
   */
    getMyVotes = (state: ConnectInterface.Connect.Manifest): Promise<ConnectInterface.Connect.Manifest> => {
        const questionIds = {
            questionIds: ConnectService.getQuestionIdsToReceive(state)
        };

        if (questionIds.questionIds.length === 0) {
            state.votes = {};
            return Promise.resolve(state);
        }

        return this.httpWrapperService.postJson('/Wizer/CloudFront/GetMyVotes', questionIds)
            .then(ConnectService.handleAuthenticationError)
            .then((res) => {
                if (res.success) {
                    state.participantId = res.participantId;
                    state.votes = {};
                    for (const vote of res.votes) {
                        state.votes[vote.QuestionId] = vote.ResponseText;
                    }

                    return state;
                } else {
                    throw new RequestFailedError(res);
                }
            });
    }

    /**
 * Fetch my foreman votes from backend.
 * This is used by downloadQueue in connect throttler
 */
    getMyForemanVotes = (state: ConnectInterface.Connect.Manifest): Promise<ConnectInterface.Connect.Manifest> => {
        const params = {
            questionIds: ConnectService.getForemanQuestionIdsToReceive(state),
            trackQuestionId: ConnectService.getTrackQuestionId(state)
        };

        if (params.questionIds.length === 0) {
            state.foremanvotes = {};
            return Promise.resolve(state);
        }

        return this.httpWrapperService.postJson('/Wizer/CloudFront/GetMyForemanVotes', params)
            .then(ConnectService.handleAuthenticationError)
            .then((res) => {
                if (res.success) {
                    state.foremanId = res.participantId;
                    state.foremanvotes = {};
                    for (const vote of res.votes) {
                        state.foremanvotes[vote.QuestionId] = vote.ResponseText;
                    }

                    return state;
                } else {
                    throw new RequestFailedError(res);
                }
            });
    }

}



