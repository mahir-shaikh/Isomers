export declare class ParticipantOverview {
    participantId: number;
    participantName: string;
    participantEmail: string;
    currentActionControl: string;
    votes: Response[];
    track: string;
    isLoggedIn: boolean;
    isIgnored: boolean;
    isSubmitted: boolean;
}
export declare class VoteResponse {
    responseId: number;
    questionId: number;
    questionName: string;
    value: string;
}
