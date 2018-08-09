import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DataAdaptorService } from '../../../dataadaptor/data-adaptor.service';
import { Project } from '../../../calcmodule';
import { Utils } from '../../../utils';


@Component({
    selector: 'im-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
    @Input() project: Project;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() onDelete: EventEmitter<any> = new EventEmitter();
    
    constructor() {}

    ngOnInit() {

    }
}