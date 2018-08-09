declare namespace Connect {
    interface Question {
        questionName: string
        rangeName: string
        questionId?: number
        responseText?: string
    }
    interface Config {
        hostName: string
        eventTitle: string
        questionsToSend: Question[]
        questionsToReceive: Question[]
    }
    interface Manifest {
        config: Config
        questionIds?: {}
        votes?: {}
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
    let manifest: Connect.Manifest;
    export = manifest
}