import { Injectable } from '@angular/core';
import { CalcService } from '../calc.service';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service';
import { Project} from './project';
import { Utils } from '../../utils';
import * as Collections from 'typescript-collections';
import * as _ from 'lodash';
import * as moment from 'moment';

const PROJECT_KEYS:string = "Projects";
const DATE_FORMAT:string = "DD-MM-YYYY";
const TIME_FORMAT:string = "hh:mmA";

@Injectable()
export class ProjectStateService {

    private projects:Collections.Dictionary<String, Project> = new Collections.Dictionary<String, Project>();
    private initPromise:Promise<any>;

    constructor(private calcService: CalcService, private dataService: DataAdaptorService, private utils: Utils) {}

    init() {
        if (this.initPromise) {
            return this.initPromise;
        }
        return this.initPromise = new Promise((resolve, reject) => {
            this.dataService.getValue(PROJECT_KEYS).then((projects) => {
                // if user has save any projects - load them from storage
                if (projects !== null) {
                    this.projects = new Collections.Dictionary<String, Project>();
                    this.populateDictionary(projects);
                }
                resolve();
            });
        });
    }

    private populateDictionary(projects:string) {
        let projectsObj = JSON.parse(projects);

        Object.keys(projectsObj).forEach((projectIdentifier) => {
            let data = projectsObj[projectIdentifier];
            this.projects.setValue(projectIdentifier, new Project(data.creationUtcTime, data.modifiedUtcTime, projectIdentifier));
        });
    }

    projectExists(projectIdentifier:string) {
        let keys = this.projects.keys();
        return (keys.indexOf(projectIdentifier) === -1) ? false : true;
    }

    private createProject(projectIdentifier:string): Promise<any> {
        if (this.projectExists(projectIdentifier)) {
            return Promise.resolve();
        }
        else {
            let _moment = moment.utc(),
                utcDate = _moment.format();
            this.projects.setValue(projectIdentifier, new Project(_moment, _moment, projectIdentifier));
            return this.dataService.setValue(PROJECT_KEYS, this.utils.stringifyDictionary(this.projects));
        }
    }

    saveProjectState(projectIdentifier: string, newProjectIndentifier?:string): Promise<any> {
        if (projectIdentifier == null) {
            projectIdentifier = newProjectIndentifier;
        }
        return new Promise((resolve, reject) => {
            let projectStatePromise: Promise<any>;
            if (!this.projectExists(projectIdentifier)) {
                projectStatePromise = this.createProject(projectIdentifier);
            }
            else {
                projectStatePromise = Promise.resolve();
            }

            projectStatePromise.then(() => {
                this.calcService.saveProjectState(projectIdentifier).then(() => {
                    // this.projects[string].lastModified = moment.utc();
                    let project = this.projects.getValue(projectIdentifier);
                    project.updateModificationTime(moment.utc());
                    this.projects.setValue(projectIdentifier, project);
                    this.dataService.setValue(PROJECT_KEYS, this.utils.stringifyDictionary(this.projects)).then(() => {
                        resolve();
                    });
                }, (e) => { 
                    reject(e);
                });
            }, (e) => {
                reject(e);
            });
        });
    }

    restoreProjectState(projectIdentifier: string): Promise<any> {
        if (!this.projectExists(projectIdentifier)) {
            return new Promise((resolve, reject) => {
                this.createProject(projectIdentifier).then(() => {
                    this.calcService.loadProjectState(projectIdentifier).then(resolve, reject);
                }, reject); // since project doesnt exist create a new one and set that as active project
            })
        }
        return this.calcService.loadProjectState(projectIdentifier);
    }

    getAllProjects(): Collections.Dictionary<String, Project> {
        return this.projects;
    }
}
