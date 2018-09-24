/**
 * Namespace connect which declares various interfaces that are used in the connect module
 */
export declare namespace Connect {
    interface Question {
        questionName: string;
        rangeName: string;
        questionId?: number;
        responseText?: string;
    }
    interface Config {
        hostName: string;
        eventTitle: string;
        questionsToSend: Question[];
        questionsToReceive: Question[];
        foremanquestionsToRecieve: Question[];
        trackQuestion: Question;
    }
    interface Manifest {
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
