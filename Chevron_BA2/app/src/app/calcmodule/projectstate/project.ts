import * as moment from 'moment';


const DATE_FORMAT = "DD-MM-YYYY";
const TIME_FORMAT = "hh:mmA";


export class Project {
    private creationDate: String;
    private creationTime: String;
    private modifiedDate: String;
    private modifiedTime: String;

    constructor(private creationUtcTime: moment.Moment, private modifiedUtcTime: moment.Moment, private name: String) {
        this.init();
    }

    private init() {
        let localCreationTime = moment.utc(this.creationUtcTime).toDate(),
            modificationTime = moment.utc(this.modifiedUtcTime).toDate();
        this.creationDate = moment(localCreationTime).format(DATE_FORMAT);
        this.creationTime = moment(localCreationTime).format(TIME_FORMAT);

        this.modifiedDate = moment(modificationTime).format(DATE_FORMAT);
        this.modifiedTime = moment(modificationTime).format(TIME_FORMAT);
    }

    getName(): String {
        return this.name;
    }

    getCreationDate(): String {
        return this.creationDate;
    }

    getCreationTime(): String {
        return this.creationTime;
    }

    getLastModifiedDate(): String {
        return this.modifiedDate;
    }

    getLastModifiedTime(): String {
        return this.modifiedTime;
    }

    updateModificationTime(modifiedUtctime: moment.Moment) {
        this.modifiedUtcTime = modifiedUtctime;
        this.modifiedDate = moment(modifiedUtctime.toDate()).format(DATE_FORMAT);
        this.modifiedTime = moment(modifiedUtctime.toDate()).format(TIME_FORMAT);
    }

    toString(): String {
        return JSON.stringify(this);
    }
}

export class ProjectIdentifier {
    private name: String;

    constructor(name:String) {
        this.name = name;
    }

    toString():String {
        return '"' + this.name + '"';
    }
}