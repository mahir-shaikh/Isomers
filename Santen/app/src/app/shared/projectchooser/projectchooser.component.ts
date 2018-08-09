import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProjectStateService } from '../../calcmodule';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service';
import { Project } from '../../calcmodule';
import { CalcService } from '../../calcmodule';
import { Utils, ROUTES, PROJECT_NAME_REF, TEAM_NAME_REF } from '../../utils';
import { Router } from '@angular/router';
import * as Collections from 'typescript-collections';
import { ModalDirective } from 'ng2-bootstrap/modal';

const LAST_PROJECT = "LastProject";

@Component({
    selector: 'im-projectchooser',
    templateUrl: 'projectchooser.component.html',
    styleUrls: ['./projectchooser.component.css']
})

export class ProjectChooserComponent {
    private projectId: string;
    private teamName: string;
    private projectsCount: number;
    private projects: Collections.Dictionary<String, Project>;
    private arrProjects:Array<Project>;
    private projectIdForDeletion: string;
    // private projectExistsError: boolean = false;
    @ViewChild('warningModal') _warningModal:ModalDirective;
    @ViewChild('deleteProjectModal') _deleteProjectModal: ModalDirective;

    constructor(private projectStateService: ProjectStateService, private dataAdaptor: DataAdaptorService, private utils: Utils, private router: Router, private calcService: CalcService) { };

    ngOnInit() {
        this.initializeProjects();
        this.dataAdaptor.getValue(LAST_PROJECT).then((projectId) => this.projectId = projectId);
    }

    switchProject(projectIdentifier: string): Promise<any> {
        // TODO
        return new Promise((resolve, reject) => {
            this.projectStateService.saveProjectState(this.projectId, projectIdentifier).then(() => {
                this.projectStateService.restoreProjectState(projectIdentifier).then(() => {
                    // console.log("Project state loaded");
                    this.setActiveProject(projectIdentifier);
                    resolve();
                }, (e) => {
                    console.log("Could not load project " + projectIdentifier, e);
                    reject();
                    // this.projectExistsError = true;
                });
            }, (e) => {
                console.log("Could not load project " + projectIdentifier, e);
                reject();
                // this.projectExistsError = true;
            });
        });
    }

    selectProject(projectIdentifier: string, checkBeforeCreate:boolean = false) {
        if (checkBeforeCreate) {
            let projectExists = this.projectStateService.projectExists(projectIdentifier);
            if (projectExists) {
                // check if project exists - if it does - tell the user if he wishes to load existing project or choose a new name
                this._warningModal.show()
                return;
            }
        }

        // TODO
        this.loadProjectState(projectIdentifier).then(() => {
            // navigate to plan page 
            this.setActiveProject(projectIdentifier).then(() => {
                // navigate to plan page 
                this.router.navigateByUrl(ROUTES.DEVELOPMENT_PLAN);
            });
        }, (rejectReason) => {
            console.log("Error loading project", rejectReason);
        });
    }

    // Save project state - will also create a new state if needed
    saveProjectState(projectIdentifier: string): Promise<any> {
        let projectExists = this.projectStateService.projectExists(projectIdentifier);
        return new Promise((resolve, reject) => {
            this.projectStateService.saveProjectState(projectIdentifier, projectIdentifier).then(() => {
                // console.log("Project state saved");
                this.setActiveProject(projectIdentifier).then(() => {
                    // navigate to plan page only when creating a new project
                    if (!projectExists) {
                        this.router.navigateByUrl(ROUTES.DEVELOPMENT_PLAN);
                    }
                    resolve();
                }, (e) => {
                    reject(e);
                });
            }, (rejectReason) => {
                console.log("Error loading project", rejectReason);
                reject(rejectReason);
            });
        });
    }

    // load existing project
    loadProjectState(projectIdentifier: string): Promise<any> {
        // TODO
        this.teamName = this.calcService.getValue(TEAM_NAME_REF);
        return this.switchProject(projectIdentifier);
    }

    setActiveProject(projectIdentifier: string): Promise<any> {
        return this.dataAdaptor.setValue(LAST_PROJECT, projectIdentifier).then(() => {
            this.calcService.setValue(PROJECT_NAME_REF, projectIdentifier);
            this.calcService.setValue(TEAM_NAME_REF, this.teamName);
        });
    }

    deleteProject(projectIdentifier: string): void {
        if (!projectIdentifier) {
            this._deleteProjectModal.hide();
            return;
        }
        // check if project exists
        this.projectStateService.deleteProject(projectIdentifier).then(() => {
            // project successfully deleted!
            this.initializeProjects();
            this._deleteProjectModal.hide();
        }, (err) => {
            new Error("Error deleting project: " + projectIdentifier + err);
            this._deleteProjectModal.hide();
        });
    }

    initializeProjects() {
        this.projects = this.projectStateService.getAllProjects();
        this.projectsCount = this.projects.size();
        this.arrProjects = this.utils.dictionaryToArray(this.projects);
    }

    showDeleteProjectAlert(projectIdentifier: string): void {
        this.projectIdForDeletion = projectIdentifier;
        this._deleteProjectModal.show();
    }
}
