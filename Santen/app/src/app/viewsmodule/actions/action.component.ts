import { Component, ElementRef, Input, OnInit, OnDestroy,  EventEmitter, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Utils, DataStore, EVENTS, ROUTES, PRINT_DATA, PROJECT_NAME_REF, Email } from '../../utils';
import {EmailDirective} from '../emaildirective/emaildirective'
import { ModalDirective } from 'ng2-bootstrap';

const ROW_COUNT = "rowcount";

@Component({
    selector: 'actions',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.css']
})

export class ActionsComponent implements OnInit, OnDestroy {
    private resetEventListener: EventEmitter<any>;
    private printEventListener: EventEmitter<any>;
    private arrInputRefs: Array<string>;
    private commitmentrowArray: Array<number>;
    private commitmentrows:number = 3;
    private disableCommitmentButton: boolean = false;
    private projectRef: string;
    private emailContent:Email;
    private emailBody: string;
    private emailTo: string ="";
    private showError: string = "";
    private emailSubject: string = "";
    private allowSubmit:boolean = true; 
    @ViewChild(EmailDirective) emailRef: EmailDirective;
    @ViewChild('emailModal') emailModalRef: ModalDirective;
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef, private dataStore: DataStore, private utils: Utils) {
    }

    ngOnInit() {
        this.resetEventListener = this.dataStore.getObservableFor(EVENTS.RESET_TOOL_PAGE).subscribe(() => {
            this.utils.resetInputs(this.arrInputRefs, this.calcService);
            this.commitmentrows = 3;
            this.dataStore.setData(this.projectRef + ROW_COUNT, this.commitmentrows, true);
            this.disableCommitmentButton = false;
        });

        this.printEventListener = this.dataStore.getObservableFor(EVENTS.PRINT_PAGE).subscribe(() => {
            this.dataStore.setData(PRINT_DATA, this.getPrintReportData());
        })

        this.arrInputRefs = ['tlInputActionAsExpected4', 'tlInputActionAsExpected5', 'tlInputActionAsExpected6', 'tlInputActionAsExpected3',
            'tlInputActionAsExpected2', 'tlInputActionAsExpected1', 'tlInputActionAsExpectedInsight4', 'tlInputActionAsExpectedInsight5', 
            'tlInputActionAsExpectedInsight6', 'tlInputActionAsExpectedInsight3', 'tlInputActionAsExpectedInsight2', 
            'tlInputActionAsExpectedInsight1', 'tlInputActionAccountable1', 'tlInputActionAccountable2', 'tlInputActionAccountable3', 
            'tlInputActionAccountable4', 'tlInputActionAccountable5', 'tlInputActionCompletionDate1', 'tlInputActionCompletionDate2', 
            'tlInputActionCompletionDate3', 'tlInputActionCompletionDate4', 'tlInputActionCompletionDate5', 'tlInputActionOutcome1', 
            'tlInputActionOutcome2', 'tlInputActionOutcome3', 'tlInputActionOutcome4', 'tlInputActionOutcome5', 'tlInputActionCommitment1',
            'tlInputActionCommitment2', 'tlInputActionCommitment3', 'tlInputActionCommitment4', 'tlInputActionCommitment5'
        ];

        this.projectRef = this.calcService.getValue(PROJECT_NAME_REF);
        this.dataStore.getData(this.projectRef + ROW_COUNT, true).then((val) => {
            this.commitmentrows = Number((val) ? val : 3);
            this.commitmentrowArray = Array(this.commitmentrows).map((x,i)=>i);

            if(this.commitmentrows >= 5){
                this.disableCommitmentButton = true;
            }
        }) ;
    }

    ngOnDestroy() {
        this.resetEventListener.unsubscribe();
        this.printEventListener.unsubscribe();
    }

    private getPrintReportData(): Array<any> {
        let printData =  [
        {
            "type": "headertext",
            "content": "CommitmentPage"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "ProjectName", "indent": 0, "isHeading": true }, { "value": "tlInputPlanProjectName" }],
                "class": "heading-row"
                },
            {
                "columns": [{ "text": "DiseaseArea", "indent": 0 }, { "value": "tlInputPlanDiseaseArea" }]
            },
            {
                "columns": [{ "text": "Formulation", "indent": 0 }, { "value": "tlInputPlanFormulation" }]
            },
            {
                "columns": [{ "text": "TargetIndication", "indent": 0 }, { "value": "tlInputPlanTargetIndication" }]
            },
            {
                "columns": [{ "text": "ProjectStartDate", "indent": 0 }, { "value": "tlInputPlanProjectStartDate" }]
            },
            {
                "columns": [{ "text": "TargetLaunchDate", "indent": 0 }, { "value": "tlInputPlanTargetLaunchDate" }]
            },
            {
                "columns": [{ "text": "CurrentStage", "indent": 0 }, { "value": "tlInputPlanCurrentStage" }]
            },
            {
                "columns": [{ "text": "LOE", "indent": 0 }, { "value": "tlInputPlanLOEDate" }]
            },
            {
                "columns": [{ "text": "InLicensedAcquisitionPeriod", "indent": 0 }, { "value": "tlInputPlanInLicenseStage" }]
            },
            {
                "columns": [{ "text": "InLicensedAcquisitionCost", "indent": 0 }, { "value": "tlInputPlanInLicenseCost" }]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "table",
            "content": [{
                "columns": [{ "text": "Hypothesis", "indent": 0, "isHeading": true }, { "text": "Validated", "indent": 0, "isHeading": true }, { "text": "FurtherInsights", "indent": 0, "isHeading": true }],
                "class": "heading-row"
                },
            {
                "columns": [{ "value": "tlInputPlanQ1Metric1", "indent": 0 }, { "value": "tlInputActionAsExpected4" }, { "value": "tlInputActionAsExpectedInsight4" }]
            },
            {
                "columns": [{ "value": "tlInputPlanQ1Metric2", "indent": 0 }, { "value": "tlInputActionAsExpected5" }, { "value": "tlInputActionAsExpectedInsight5" }]
            },
            {
                "columns": [{ "value": "tlInputPlanQ1Metric3", "indent": 0 }, { "value": "tlInputActionAsExpected6" }, { "value": "tlInputActionAsExpectedInsight6" }]
            },
            {
                "columns": [{ "value": "tlInputPlanQ4Assumption1", "indent": 0 }, { "value": "tlInputActionAsExpected1" }, { "value": "tlInputActionAsExpectedInsight1" }]
            },
            {
                "columns": [{ "value": "tlInputPlanQ4Assumption2", "indent": 0 }, { "value": "tlInputActionAsExpected2" }, { "value": "tlInputActionAsExpectedInsight2" }]
            },
            {
                "columns": [{ "value": "tlInputPlanQ4Assumption3", "indent": 0 }, { "value": "tlInputActionAsExpected3" }, { "value": "tlInputActionAsExpectedInsight3" }]
            },
            ]
        },
        {
            "type": "linebreak"
        }];

        let commitmentData = {
            "type": "table",
            "content": [{
                "columns": [{ "text": "Commitment", "indent": 0, "isHeading": true }, { "text": "IndividualAccountable", "indent": 0, "isHeading": true }, { "text": "ExpectedCompletionDate", "indent": 0, "isHeading": true }, { "text": "ExpectedOutcome", "indent": 0, "isHeading": true }],
                "class": "heading-row"
                }]
        };

        for(let i=1;i<=this.commitmentrows;i++){
            let SampleCommitementData = [{ "value": "tlInputActionCommitment"+i, "indent": 0 }, { "value": "tlInputActionAccountable"+i }, { "value": "tlInputActionCompletionDate"+i }, { "value": "tlInputActionOutcome"+i }];
            let SampleString : string = '{ "columns" : ' + JSON.stringify(SampleCommitementData) + '}';
            // SampleString = '"columns" :' + SampleString;
            commitmentData.content.push(JSON.parse(SampleString));
        }

        printData.push(commitmentData);

        return printData;
    }

    getEmailData(){
        var mailBody = [
        {
            "type": "subject",
            "content": "CommitmentPage"
        },
        {
            "type": "text",
            "content": [{
                row:[{ text:"EmailGreeting"}]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "text",
            "content": [{
                row:[{ text:"EmailIntro"}]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "text",
            "content": [{
                row:[{ "text": "MetricEmailIntro", "indent": 0, "isHeading": true }]
            },{
                row:[{ "value": "tlInputPlanQ1Metric1", "indent": 5, "row-no": true},{ "text": "WhichEmailText"}, { "value": "tlInputActionAsExpected4" }, { "text": "ValidateEmailText"}, { "text":"InsightEmailText", "value": "tlInputActionAsExpectedInsight4", "end-of-text":true }]
            },{
                row:[{ "value": "tlInputPlanQ1Metric2", "indent": 5, "row-no": true},{ "text": "WhichEmailText"}, { "value": "tlInputActionAsExpected5" }, { "text": "ValidateEmailText"}, { "text":"InsightEmailText", "value": "tlInputActionAsExpectedInsight5", "end-of-text":true }]
            },{
                row:[{ "value": "tlInputPlanQ1Metric3", "indent": 5, "row-no": true},{ "text": "WhichEmailText"}, { "value": "tlInputActionAsExpected6" }, { "text": "ValidateEmailText"}, { "text":"InsightEmailText", "value": "tlInputActionAsExpectedInsight6", "end-of-text":true }]
            }]
        },
        {
            "type": "linebreak"
        },
        {
            "type": "text",
            "content": [{
                row:[{ "text": "AssumptionEmailIntro", "indent": 0, "isHeading": true }]
            },{
                row:[{ "value": "tlInputPlanQ4Assumption1", "indent": 5, "row-no": true},{ "text": "WhichEmailText"}, { "value": "tlInputActionAsExpected1" }, { "text": "ValidateEmailText"}, { "text":"InsightEmailText", "value": "tlInputActionAsExpectedInsight1", "end-of-text":true }]
            },{
                row:[{ "value": "tlInputPlanQ4Assumption2", "indent": 5, "row-no": true},{ "text": "WhichEmailText"}, { "value": "tlInputActionAsExpected2" }, { "text": "ValidateEmailText"}, { "text":"InsightEmailText", "value": "tlInputActionAsExpectedInsight2", "end-of-text":true }]
            },{
                row:[{ "value": "tlInputPlanQ4Assumption3", "indent": 5, "row-no": true},{ "text": "WhichEmailText"}, { "value": "tlInputActionAsExpected3" }, { "text": "ValidateEmailText"}, { "text":"InsightEmailText", "value": "tlInputActionAsExpectedInsight3", "end-of-text":true}]
            }]
        },
        {
            "type": "linebreak"
        }];

        let flag = 0;
        for(let i=0;i<5;i++){
            if(this.calcService.getValue('tlInputActionCompletionDate' + (i + 1)).trim() || this.calcService.getValue('tlInputActionCompletionDate' + (i + 1)).trim() != ""){
                flag = 1;
            }else if(this.calcService.getValue('tlInputActionAccountable' + (i + 1)).trim()|| this.calcService.getValue('tlInputActionAccountable' + (i + 1)).trim() != ""){
                flag = 1;
            }else if(this.calcService.getValue('tlInputActionOutcome' + (i + 1)).trim() || this.calcService.getValue('tlInputActionOutcome' + (i + 1)).trim() != ""){
                flag = 1;
            }
            if(flag){
                let row1 = {
                row:[{ "value": "tlInputActionAccountable"+(i + 1), "indent": 5, "row-no": true}]
                }, row2 = {
                row:[{ "text": "DateEmailText", "indent": 10},{ value: 'tlInputActionCompletionDate'+(i + 1)}]
                }, row3 ={
                    row:[{ "text": "ActionEmailText", "indent": 10},{ value: 'tlInputActionCommitment'+(i + 1)}]
                }, row4 = {
                    row:[{ "text": "EstimatedEmailText", "indent": 10},{ value: 'tlInputActionOutcome'+(i + 1)}]
                };
                if(mailBody[mailBody.length - 1]['type'] == "text"){
                    if(mailBody[mailBody.length - 1]['content'][0].row[0].text != "CommitmentEmailIntro"){
                        let introRow = {
                            "type": "text",
                            "content": [{
                                row:[{ "text": "CommitmentEmailIntro", "indent": 0, "isHeading": true }]
                            }]
                        };
                        mailBody.push(introRow);
                    }
                }else{
                    let introRow = {
                            "type": "text",
                            "content": [{
                                row:[{ "text": "CommitmentEmailIntro", "indent": 0, "isHeading": true }]
                            }]
                        };
                        mailBody.push(introRow);
                }
                mailBody[mailBody.length - 1]['content'].push(row1,row2, row3, row4);
                flag = 0;
            }
        }
        this.emailContent = this.emailRef.getMailData(mailBody);
        this.emailBody = this.emailContent.body;
        this.emailSubject = this.emailContent.subject;
    }
    onCommitmentRowAdd(){
        this.commitmentrows++;
        this.dataStore.setData(this.projectRef + ROW_COUNT, this.commitmentrows, true);
        if(this.commitmentrows >= 5){
            this.disableCommitmentButton = true;
        }
        this.commitmentrowArray = Array(this.commitmentrows).map((x,i)=>i);
    }

    showEmailModal(){
        this.emailModalRef.show();
        this.getEmailData();
        if(this.emailTo != ""){
            this.validateEmail();
        }
    }

    onSubmitEmailModal(){
        //implement request to send enmail.
        let self= this;
        let to = (this.emailTo.indexOf(',') !== -1) ? this.emailTo.split(',').join(';') : this.emailTo;
        this.emailContent.to = to;
        this.emailContent.subject = this.emailSubject;
        this.emailContent.body = this.emailBody;
        this.allowSubmit = true;
        this.emailRef.sendEmail(this.emailContent).then((response) => {
            if (response.success) {
                this.emailModalRef.hide();
            }
            else {
                console.log(response.message);
            }
        }, (err) => {
            // this.emailModalRef.hide();
            console.log(err);
        });
            self.emailTo = "";
    }

    validateEmail(){
        let emails = this.emailTo.replace(" ","").split(";"),
            regex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
     
        if(emails.length > 1){
            emails = emails.filter(function(value){
                return value != "";
            });
        }
        if(this.emailTo != ""){
            for(let i=0; i< emails.length; i++){
                if(regex.test(emails[i])){
                    this.showError = "";
                    this.allowSubmit = false;
                    continue;
                }else{
                    this.showError = "Email pattern not correct. It should be like this 'john@doe.com'";
                    this.allowSubmit = true;
                    break;
                }
            }
        }else{
            this.showError = "Email can't be empty";
            this.allowSubmit = true;
        }
    }
}