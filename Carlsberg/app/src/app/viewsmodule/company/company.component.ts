import { Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { ROUTES } from '../../utils';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs'

@Component({
    selector: 'company-decisions',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.styl'],
})

export class CompanyDecisionsComponent {
    private PackList=[];
    private ProjectList=[];
    private modelChangeListner: Subscription;
    constructor( private calcService: CalcService) { };

    ngOnInit() {
       this.initializePackList();
       this.initializeProjectList();


        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            this.initializePackList();
            this.initializeProjectList();
        });
    }

    initializePackList(){
        let PackInnovationList = this.calcService.getValue("tlOutputPackInnovationList");
        this.PackList = [];
        for(let i=0; i< PackInnovationList.length;i++){
            let strValue = PackInnovationList[i][0];
            if(strValue != ""){
                this.PackList.push(strValue);
            }
        }
    }

    initializeProjectList(){
        let SIList = this.calcService.getValue("tlOutputSIList");
        this.ProjectList = [];
        for(let i=0; i< SIList.length;i++){
            let strValue = SIList[i][0];
            if(strValue != ""){
                this.ProjectList.push(strValue);
            }
        }
    }

    ngOnDestroy(){
        if(this.modelChangeListner){
            this.modelChangeListner.unsubscribe();
        }
    }

    getListener(){
        return this.modelChangeListner;
    }

    
}

