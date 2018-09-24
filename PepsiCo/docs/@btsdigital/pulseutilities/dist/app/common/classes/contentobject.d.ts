export declare class ContentObject {
    id: number;
    title?: string;
    name: string;
    description?: string;
    metadata: any;
    contentObjects?: ContentObject[];
    section?: COSection[];
    eventName: string;
    status: string;
    points?: number;
    fav: boolean;
    expanded?: boolean;
    metdataKeys?: any;
    path?: string;
    parent?: ContentObject;
    completed?: number;
    languageName: string;
    languages: any;
    maxModules?: number;
    criterias?: Array<any>;
    enrollable?: boolean;
    schedulable?: boolean;
    scheduled?: boolean;
    enrolled?: boolean;
    disabled?: boolean;
    visible?: boolean;
    locked?: boolean;
    message?: string;
    lockCondition?: string;
}
export declare class COSection {
    id: number;
    value: string;
    selected: boolean;
}
export declare class HierarchyEmmitOptions {
    action: string;
    curNode: ContentObject;
    idx: number;
    constructor(action: string, curNode: ContentObject, idx: number);
}
export declare enum CriteriaType {
    NA = 1,
    DefaultSectionsToBe = 2,
    DefaultSectionsToBeUntil = 4,
    AssessmentModuleId = 8,
    ParentEnrollmentCompleted = 16,
    ParentSchedulingCompleted = 32,
    OffsetToCohortStartTime = 64,
    OffsetToCohortEndTime = 128,
    OffsetToDeliveryStartTime = 256,
    OffsetToDeliveryEndTime = 512,
    OffsetToSessionStartTime = 1024,
    OffsetToSessionEndTime = 2048,
    VoteOnQuestion = 4096,
    CompletionPreRequisite = 8192,
}
export declare enum CriteriaForState {
    NA = 1,
    MakingVisible = 2,
    MakingAvailable = 4,
    RemovingAccess = 8,
    MakingInvisible = 16,
    Scheduling = 32,
    Enrolling = 64,
}
