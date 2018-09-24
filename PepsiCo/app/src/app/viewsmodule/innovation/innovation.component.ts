import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalcService } from '@btsdigital/ngx-isomer-core';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'innovation',
  templateUrl: './innovation.component.html',
  styleUrls: ['./innovation.component.styl']
})
export class InnovationComponent implements OnInit {
    @Input() content;
    private innovationArray = []
    private activeIndex: number = -1;
    private currentManufacturingValue: number = -1;
    private currentRawMaterialValue: number = -1;
    private currentDistributionValue: number = -1;
    private costFormat = "$0,0";
    private costScalar = 1;
    private animationClass: string = "";
    private isOpening: boolean = false;
    private isClosing: boolean = false;
    @Output() useInnovation:EventEmitter<any> = new EventEmitter<any>();


    constructor( private calcService: CalcService, private textEngineService: TextEngineService) { }

    ngOnInit() {
        this.initializeContent();
    }

    initializeContent() {
        this.content = [];
        this.content = this.textEngineService.getInitiatives("Innovation");

        for (const index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                this.innovationArray.push(this.content[index]);
            }
        }

    }

    onNext(){
        this.animationClass = "zoomOutRight";

        setTimeout(()=>{
            this.animationClass = "slideInLeft";
            this.activeIndex++;
            this.updateGaugeValues();
        },1000);
    }

    onPrev(){
        this.animationClass = "zoomOutLeft";

        setTimeout(()=>{
            this.animationClass = "slideInRight";
            this.activeIndex--;
            this.updateGaugeValues();            
        },1000);
    }

    showData(index){
        this.isOpening = true;
        this.isClosing = false;
        this.animationClass = "zoomIn";
        this.activeIndex = index;
        this.updateGaugeValues();
    }

    hideData(){
        this.isOpening = false;
        this.isClosing = true;
        this.animationClass = "zoomOut";
        setTimeout(()=>{
            this.activeIndex = -1;
        },1000)
    }

    updateGaugeValues(){
        let data = this.innovationArray[this.activeIndex].manufacturing;
        this.currentManufacturingValue =  data == "Low" ? 25 : data == "Medium" ? 50 : 75;
        data = this.innovationArray[this.activeIndex].distribution;
        this.currentDistributionValue =  data == "Low" ? 25 : data == "Medium" ? 50 : 75;
        data = this.innovationArray[this.activeIndex].rawmaterial;
        this.currentRawMaterialValue =  data == "Low" ? 25 : data == "Medium" ? 50 : 75;
    }

    useThis(){
        this.useInnovation.emit(this.activeIndex);
    }


}