export class ChannelEvent {
    EventName: string;
    InvokedByParticipationId: number;
    TargetParticipationId: number = 0;
    ChannelName: string;
    Timestamp?: string;
    Data: any;
    Json: string;
    For: string;
}


export enum ChannelEventName {
    DDNewAction,
    Help,
    ParticipantActionSubmit,
    MyVoteChanged,
    ParticipantComment
}

export enum Channels {
    GroupDirector,
    Participants
}

export enum MessageFor {
    Client,
    Group,
    Event
}