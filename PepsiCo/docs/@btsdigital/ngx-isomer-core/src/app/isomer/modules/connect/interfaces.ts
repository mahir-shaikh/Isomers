
/**
 * Namespace connect which declares various interfaces that are used in the connect module
 */
export namespace Connect {
    export interface Question {
        questionName: string;
        rangeName: string;
        questionId?: number;
        responseText?: string;
    }
    export interface Config {
        hostName: string;
        eventTitle: string;
        questionsToSend: Question[];
        questionsToReceive: Question[];
        foremanquestionsToRecieve: Question[];
        trackQuestion: Question;
    }
    export interface Manifest {
        config: Config;
        questionIds?: {};
        foremanQuestionIds?: {};
        trackQuestionId?: number;
        votes?: {};
        foremanvotes?: {};
        participantId?: string;
        foremanId?: string;
    }
}
