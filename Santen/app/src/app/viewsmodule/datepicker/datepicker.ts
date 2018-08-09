import { Component, Input, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import {IMyOptions, IMyDateModel} from 'mydatepicker';

@Component({
    selector: 'mydatepicker',
    templateUrl: './datepicker.html',
    styleUrls: ['./datepicker.css']
})

export class MyDatePickerComponent implements OnInit {
    @Input() ref: string = "";
    @Input() yearRef:string = "";
    @Input() format:string = "";
    @Input() readOnly: boolean = false;
    @Input() timeType: string = "excel";
    @Input() selectionTxtFontSize: string = '0.875rem';
    private currDate: Object;
    private observer: EventEmitter<any>;
    private mydateoption: IMyOptions = {
        editableDateField: false,
        showClearDateBtn: false
    };
    
    constructor(private textEngineService: TextEngineService, private calcService: CalcService) { };

    ngOnInit() {
        let self = this;
        // this.content = this.textEngineService.getText("PlanningToolTips_R"+year);
        let excelValue, newDate;
        switch(this.timeType){
            case "excel":
                excelValue = Number(this.calcService.getValue(this.ref));
                if(excelValue) {
                    newDate = new Date((excelValue - 25569) * 86400 *1000);
                }
                else {
                    newDate = new Date();
                }
                break;
            case "text":
                excelValue = this.calcService.getValue(this.ref);
                if(excelValue == ""){
                    newDate = "";
                }else{
                    newDate = new Date(excelValue);
                }
                break;
        }
        if(newDate != ''){
            this.currDate = {
                date:{
                    year: newDate.getFullYear(),
                    month: newDate.getMonth() + 1,
                    day: newDate.getDate()
                }
            }
        }
        this.mydateoption["dateFormat"] = this.format;
        this.mydateoption["selectionTxtFontSize"] = this.selectionTxtFontSize;
        if(this.readOnly){
            this.mydateoption["componentDisabled"] = true;
        }
        this.observer = this.calcService.getObservable().subscribe(() => {
            switch(this.timeType){
                case "excel":
                    let excelTimeStamp = Number(self.calcService.getValue(self.ref));
                    let newDate = new Date((excelTimeStamp - 25569) * 86400 *1000);
                    self.currDate = {
                        date:{
                            year: newDate.getFullYear(),
                            month: newDate.getMonth() + 1,
                            day: newDate.getDate()
                        }
                    }
                    break;
                case "text":
                    excelValue = this.calcService.getValue(this.ref);
                    if(excelValue != ""){
                        newDate = new Date(excelValue);
                        this.currDate = {
                            date:{
                                year: newDate.getFullYear(),
                                month: newDate.getMonth() + 1,
                                day: newDate.getDate()
                            }
                        }
                    }else{
                        self.currDate = ''
                    }
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.observer.unsubscribe();
    }

    onDateChanged(event: IMyDateModel) {
        let date, timeStamp, excelTimeStamp, dateInText, month, year;
        switch(this.timeType){
            case "excel":
                date = event.jsdate;
                timeStamp = date.getTime();
                excelTimeStamp = ( (timeStamp / 1000) / 86400 ) + 25569;
                this.calcService.setValue(this.ref, excelTimeStamp);
                break;
            case "text":
                month = event.jsdate.toLocaleString("en-us", { month: "short" });
                date = event.jsdate.getDate();
                year = event.jsdate.getFullYear();
                dateInText = "" + month + " " + date + "," + " " + year;
                this.calcService.setValue(this.ref, dateInText);
                break;
        }
    }
}
