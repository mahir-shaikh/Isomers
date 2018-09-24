import { Component, OnInit, Input, TemplateRef, ViewChild, ViewContainerRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CalcService } from '@btsdigital/ngx-isomer-core'

@Component({
  selector: 'custom-accordian',
  templateUrl: './customaccordian.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./customaccordian.component.styl']
})
export class CustomaccordianComponent implements OnInit {
    @Input() dataContentRef: TemplateRef<any>;
    @Input() headingLabelRef: string = "";
    @Input() headingValueRef: string = "";
    @Input() isReversed: boolean = false;
    @Input() isOpen: boolean = false;
    @ViewChild('dataContainer',{read:ViewContainerRef}) dataContainerRef : ViewContainerRef;
    private subscriber: any;
    private headingLabel:string = "";
    private headingValue:string = "";

    constructor(private router: Router, private calcService: CalcService, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.subscriber = this.calcService.getObservable().subscribe(() => {
            this.updateValue()
        });

        this.updateValue();
        
        if(this.dataContentRef){
            this.dataContainerRef.createEmbeddedView(this.dataContentRef);            
        }
    }
    ngAfterViewInit() { 
    }

    toggleState(){
        this.isOpen = this.isOpen ? false : true;
    }

    updateValue(){
        let label = this.calcService.getValueForYear(this.headingLabelRef);
        let value = this.calcService.getValueForYear(this.headingValueRef);

        if (this.headingValue != value || this.headingLabel != label) {
            this.cdRef.markForCheck();
        }
        this.headingValue = value;
        this.headingLabel = label;
    }

}