export declare class ChannelEvent {
    EventName: string;
    InvokedByParticipationId: number;
    TargetParticipationId: number;
    ChannelName: string;
    Timestamp?: string;
    Data: any;
    Json: string;
    For: string;
}
export declare enum ChannelEventName {
    DDNewAction = 0,
    Help = 1,
    ParticipantActionSubmit = 2,
    MyVoteChanged = 3,
    ParticipantComment = 4,
}
export declare enum Channels {
    GroupDirector = 0,
    Participants = 1,
}
export declare enum MessageFor {
    Client = 0,
    Group = 1,
    Event = 2,
}
