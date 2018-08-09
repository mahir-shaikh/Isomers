import { Directive, Input, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { EmailService, Email } from '../../utils';


@Directive({
    selector: '[sendemail]'
})

export class EmailDirective implements OnInit {
    @Input() mailTo: string = "";
    private mailBodyValue: string;
    private mailtToContent: string;
    private mailSubject: string;
    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private emailService: EmailService) { };

    ngOnInit() {
        // this.mailtToContent = "mailTo:"+this.mailTo+"?subject"+this.mailSubject+"&body"+this.mailBodyValue;
    }

    getMailData(mailBody: any = ""): Email {
        let mailBodyText = "", text, value;
        for(let data in mailBody){
            switch(mailBody[data].type){
                case "subject":
                    this.mailSubject = this.textEngineService.getText(mailBody[data].content) || mailBody[data].content;
                    break;
                case "table":
                    for(let i=0;i<mailBody[data].content.length;i++){
                        let columns = mailBody[data].content[i].columns;
                        for(let j=0;j<columns.length;j++){
                            let columnValue = columns[j];
                            if(columnValue.text){
                                text = this.textEngineService.getText(columnValue.text) || columnValue.text;
                                if(!text){
                                    text = columnValue.text;
                                }
                                mailBodyText += text + "\t";
                            }else if(columnValue.value){
                                value = this.calcService.getValue(columnValue.value);
                                mailBodyText += value + "\t";
                            }
                        }
                        mailBodyText +="%0D";
                    }
                    break;
                case "text":
                    let rowNo = 1;
                    for(let i=0;i<mailBody[data].content.length;i++){
                        let row = mailBody[data].content[i].row;
                        for(let j=0;j<row.length;j++){
                            let rowValue = row[j];
                            if(rowValue.text){
                                text = this.textEngineService.getText(rowValue.text);
                                if(!text){
                                    text = rowValue.text;
                                }
                                let appendIndentation = "";
                                if(rowValue.indent){
                                    for(let k=0;k<rowValue.indent;k++){
                                        appendIndentation += " ";
                                    }
                                }
                                let textWithValue;
                                if(rowValue.value){
                                    textWithValue = this.calcService.getValue(rowValue.value);
                                    if(textWithValue != ""){
                                        mailBodyText += appendIndentation;
                                        if(rowValue["row-no"]){
                                            mailBodyText += rowNo + ". ";
                                            rowNo++;
                                        }
                                        // mailBodyText += text;
                                        mailBodyText += " "+ textWithValue.trim();
                                        if(rowValue["end-of-text"]){
                                            mailBodyText += ".";
                                        }
                                        continue;
                                    }
                                }else{
                                    mailBodyText += appendIndentation;
                                    if(rowValue["row-no"]){
                                        mailBodyText += rowNo + ". ";
                                        rowNo++;
                                    }
                                    mailBodyText += text.trim();
                                    if(rowValue["end-of-text"]){
                                        mailBodyText += ".";
                                    }
                                }
                            }else if(rowValue.value){
                                value = this.calcService.getValue(rowValue.value);
                                if(rowValue.value.indexOf("tlInputActionAsExpected") != -1 && rowValue.value.indexOf("tlInputActionAsExpectedInsight") == -1){
                                    if(value == "Yes"){
                                        value = "did";
                                    }else{
                                        value = "did not";
                                    }
                                }
                                let appendIndentation = "";
                                if(rowValue.indent){
                                    for(let k=0;k<rowValue.indent;k++){
                                        appendIndentation += " ";
                                    }
                                }
                                mailBodyText += " " + appendIndentation;
                                if(rowValue["row-no"]){
                                    mailBodyText += rowNo + ". ";
                                    rowNo++;
                                }
                                mailBodyText += value.trim();
                                if(rowValue["end-of-text"]){
                                    mailBodyText += ".";
                                }
                                mailBodyText +=" ";
                            }
                        }
                        mailBodyText +="\r\n";
                    }
                    break;
                case "linebreak":
                    mailBodyText += "\r\n";
                    break;
                default:
                    break;
            }
        }
        this.mailBodyValue = mailBody;
        // this.mailtToContent = "mailTo:"+this.mailTo+"?";
        // if(this.mailSubject){
        //     this.mailtToContent += "subject="+this.mailSubject+"&";
        // }
        // this.mailtToContent += "body="+ mailBodyText;
        let out = new Email();

        out.to = this.mailTo;
        out.body = mailBodyText;
        out.subject = this.mailSubject;
        // window.location.assign("mailTo:?subject="+ this.mailSubject + "&body=" + encodeURIComponent(mailBodyText));
        return out;
    }

    sendEmail(mailBody: any): Promise<any> {
        if (!mailBody) {
            return Promise.reject("Email body is empty!");
        }

        // let email: Email = this.getMailData(mailBody);
        // mailBody.body = mailBody.body.replace('\n','\r\n');
        return this.emailService.sendEmail(mailBody);
    }
}


// sample Data
//         return [
//         {
//             "type": "subject",
//             "content": "CommitmentPage"
//         },
//         {
//             "type": "table",
//             "content": [{
//                 "columns": [{ "text": "Hypothesis", "indent": 0, "isHeading": true }, { "text": "Validated", "indent": 0, "isHeading": true }, { "text": "FurtherInsights", "indent": 0, "isHeading": true }],
//                 "class": "heading-row"
//                 },
//             {
//                 "columns": [{ "text": "tlInputPlanQ1Metric1", "indent": 0 }, { "value": "tlInputActionAsExpected4" }, { "value": "tlInputActionAsExpectedInsight4" }]
//             },
//             {
//                 "columns": [{ "text": "tlInputPlanQ1Metric2", "indent": 0 }, { "value": "tlInputActionAsExpected5" }, { "value": "tlInputActionAsExpectedInsight5" }]
//             },
//             {
//                 "columns": [{ "text": "tlInputPlanQ1Metric3", "indent": 0 }, { "value": "tlInputActionAsExpected6" }, { "value": "tlInputActionAsExpectedInsight6" }]
//             },
//             {
//                 "columns": [{ "text": "tlInputPlanQ4Assumption1", "indent": 0 }, { "value": "tlInputActionAsExpected1" }, { "value": "tlInputActionAsExpectedInsight1" }]
//             },
//             {
//                 "columns": [{ "text": "tlInputPlanQ4Assumption2", "indent": 0 }, { "value": "tlInputActionAsExpected2" }, { "value": "tlInputActionAsExpectedInsight2" }]
//             },
//             {
//                 "columns": [{ "text": "tlInputPlanQ4Assumption3", "indent": 0 }, { "value": "tlInputActionAsExpected3" }, { "value": "tlInputActionAsExpectedInsight3" }]
//             },
//             ]
//         },
//         {
//             "type": "linebreak"
//         }
//         }];