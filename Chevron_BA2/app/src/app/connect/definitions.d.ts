declare namespace Connect {
    interface Connect {
        authenticateUser(state: Manifest): Promise<Manifest | Error>
        getQuestionIds(state: Manifest): Promise<Manifest | Error | AuthenticationError>
        voteManyQuestionsFromJson(state: Manifest): Promise<Manifest | Error | AuthenticationError>
        getMyVotes(state: Manifest): Promise<Manifest | Error | AuthenticationError>
        authenticateToCloudFront(state: Manifest): Promise<Manifest | Error >
        getQuestionIdsToReceive(state: Manifest): Array<any>
    }
    export interface JsCalcConnector {
        readValues(state: Manifest): Promise<Manifest | Error>
        writeValues(state: Manifest): Promise<Manifest | Error>
    }

    interface Question {
        questionName: string
        rangeName: string
        questionId?: number
    }
    interface Config {
        hostName: string
        eventTitle: string
        questionsToSend: [Question]
        questionsToReceive: [Question]
    }
    interface Manifest {
        config: Config
        user?: any
        questionIds?: [number]
        votes?: [any]
        participation?: any
        cloudFrontCookies?: any
    }

    interface AuthenticationError {
        unauthenticated: Boolean,
        originalObj?: any
    }

    export interface HttpWrapper {
        postJson(relativeUrl: string, body): Promise<any>
    }

    interface JsCalcApi {
        getValue(key: string): string
        setValue(key: string, value: any): Promise<any>
    }
}

declare module "app/connect/lib/manifest" {
    let manifest: Connect.Manifest
    export = manifest
}

declare module "app/connect/lib/connect" {
    function connect(httpWrapper: Connect.HttpWrapper, PromiseLibrary): Connect.Connect;
    export = connect
}

declare module "app/connect/lib/jsCalcConnector" {
    function jsCalcConnector(jsCalcApi: Connect.JsCalcApi, PromiseLibrary): Connect.JsCalcConnector
    export = jsCalcConnector
}