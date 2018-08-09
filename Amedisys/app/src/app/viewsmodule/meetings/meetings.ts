import { Component, Input, OnInit } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';

@Component({
    selector: 'meetings',
    templateUrl: './meetings.html',
    styleUrls: ['./meetings.css'],
    providers: []
})

export class Meetings implements OnInit {
    @Input() meeting;
    @Input() index;

    private isHidden = true;
    private isViewed = false;

    constructor(private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        this.isHidden = (this.calcService.getValue(this.meeting.triggerRange) != 1);
        this.isViewed = (this.calcService.getValue("tlInput"+this.meeting.ID) != 0);
        this.meeting["icon"] = "/assets/images/" + this.meeting["icon"];
        this.meeting["image"] = "/assets/images/" + this.meeting["image"];
    }

    onSelect() {
        // this.router.navigate(['/dashboard', 'meetings', this.meeting.ID]);
        this.router.navigate(['/dashboard', { outlets: { 'messages': 'meetings/' + this.meeting.ID } }]);
    }

    // onClick(meetingId: string) {
    //     // var linkPath = '/dashboard(rightdash:meetings/' + meetingId + ')';
    //     // this.router.navigateByUrl(linkPath);
    //     this.router.navigate(['/', { outlets: { 'messages': 'meetings/' + this.meeting.ID } }]);

    // }
}