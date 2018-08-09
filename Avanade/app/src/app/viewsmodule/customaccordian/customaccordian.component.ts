import { Component, OnInit, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule/calc.service'

@Component({
  selector: 'custom-accordian',
  templateUrl: './customaccordian.component.html',
  styleUrls: ['./customaccordian.component.styl']
})
export class CustomaccordianComponent implements OnInit {
    @Input() graphContentRef: TemplateRef<any>;
    @Input() tableContentRef: TemplateRef<any>;
    @Input() headingText: string = "Heading";
    @Input() link:string = "";
    @Input() alwaysOpen:boolean = false;
    @ViewChild('graphContainer',{read:ViewContainerRef}) graphContainer : ViewContainerRef;
    @ViewChild('tableContainer',{read:ViewContainerRef}) tableContainer : ViewContainerRef;
    private isOpen: boolean = true;

    constructor(private router: Router, private calcService: CalcService) { }

    ngOnInit() {
    }
    ngAfterViewInit() { 
        if(this.graphContentRef){
            this.graphContainer.createEmbeddedView(this.graphContentRef);            
        }
        if(this.tableContentRef){
            this.tableContainer.createEmbeddedView(this.tableContentRef);
        }
    }

    toggleState(){
        this.isOpen = this.isOpen ? false : true;
    }

    navigateToLink(){
        this.router.navigate([this.link]);
    }

}