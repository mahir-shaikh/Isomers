import { Dictionary } from '../../utils/utils';

export class LinkStatus {
    private newLinkCount: number = 0;
    private totalLinksVisible: number = 0;
    private _links: Dictionary = {};

    private incrementVisibleMessages() {
        this.totalLinksVisible++;
    }

    private incrementNewMessages() {
        this.newLinkCount++;
    }

    getNewLinksCount():number {
        return this.newLinkCount;
    }

    getTotalLinksCount():number {
        return this.totalLinksVisible;
    }

    addLink(trigger, isHidden?:boolean, isRead?: boolean) {
        let status: Status = new Status();
        status.isHidden = isHidden;
        if (isHidden === false && !!!isRead) {
            this.incrementNewMessages();
        }
        if (isHidden === false) {
            this.incrementVisibleMessages();
        }
        this._links[trigger] = status;
    }

    updateLink(trigger, isHidden?: boolean, isRead?: boolean) {
        let status: Status = this._links[trigger];
        if (!status) {
            this.addLink(trigger, isHidden, isRead);
            status = this._links[trigger];
        }
        if (status.isHidden !== !!isHidden) {
            this.incrementNewMessages();
            this.incrementVisibleMessages();
            status.isHidden = isHidden;
        }
    }

    markVisited() {
        if (this.newLinkCount > 0) {
            this.newLinkCount--;
        }
    }

    toString() {
        return JSON.stringify(this._links);
    }
}

class Status {
    private _trigger: string;
    private _isHidden: boolean;

    public get trigger() : string {
        return this._trigger;
    }

    public get isHidden() : boolean {
        return this._isHidden;
    }

    public set trigger(v : string) {
        this._trigger = v;
    }

    public set isHidden(v : boolean) {
        this._isHidden = v;
    }
}