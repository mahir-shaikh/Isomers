export class PulseState {
    public config:any;
    public user:any;
    public participation:any;

    constructor(hostname: string, eventTitle:string) {
        if (!hostname) {
            hostname = window.location.hostname;
        }
        if (!eventTitle) {
            eventTitle = "Gateway";
        }

        this.config = {
            hostname: hostname,
            eventTitle: eventTitle
        }
    }
}