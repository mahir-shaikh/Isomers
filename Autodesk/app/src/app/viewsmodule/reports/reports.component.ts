import { Component, Input, OnInit, OnChanges, EventEmitter, ViewChild, OnDestroy, HostListener, AfterViewChecked, ElementRef } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective, CarouselComponent } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { HammerGestureConfig } from '@angular/platform-browser';
import { ReportDataComponent } from './../reportdata/reportdata.component';


@Component({
    selector: 'reports-component',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.styl']
})

export class ReportsComponent {
    private TotalPaths = ["Path1", "Path2", "Path3", "Path4", "Path5", "Path6", "Path7", "Path8", "Total"];
    private NoOfVisiblePaths = [];
    private className: string = "";
    private isInitOver: boolean = false;
    private isAnimationOver: boolean = false;
    private slideChaneListener : Subscription;  
    private activeSlideNumber : number= 0;
    @ViewChild('carousal') Carousal;

    constructor(private elRef: ElementRef,private dataStore: DataStore, private utils: Utils, private router: Router, private calcService: CalcService, private textEngineService: TextEngineService) {};

    ngOnInit() {
        let totalActivePath = this.calcService.getValue("calcTotalActivePaths");
        this.NoOfVisiblePaths = [];
        if(totalActivePath == 0){
            this.NoOfVisiblePaths.push(this.TotalPaths[0]);
        }else{
            for(let i = 0; i < totalActivePath; i++){
                this.NoOfVisiblePaths.push(this.TotalPaths[i]);
            }
        }
        //Total will be present in both case
        this.NoOfVisiblePaths.push(this.TotalPaths[this.TotalPaths.length - 1]);
        
        setTimeout(() => {
          if(window.screen.width <= 768){
            this.performInitialAnimation();
          }else{
            this.isAnimationOver = true;            
          }
        },200);

        let self = this;
        this.slideChaneListener = this.Carousal.activeSlideChange.subscribe((newSlideNumber) => {
          // direction left = 0; Right = 1
          let direction;
          if(this.activeSlideNumber > newSlideNumber){
            direction = 0;
          }else{
            direction = 1;
          }
          this.activeSlideNumber = newSlideNumber;
          if(self.isInitOver && self.isAnimationOver){
            if(direction && self.Carousal.getCurrentSlideIndex() == 0) {
             return;
            }else if(!direction && self.Carousal.getCurrentSlideIndex() == self.Carousal._slides.length - 1){
             return;
            }

            self.className = direction ? "slideInRight" : "slideInLeft";
            let slideArray = document.getElementsByTagName('slide');
            let carousel = document.getElementsByTagName('carousel')[0];
            let currentSlide, nextSlide;
            for(let i = 0; i< slideArray.length; i++){
                if(slideArray[i].classList.contains('active')){
                    currentSlide = slideArray[i];
                    // nextSlide = direction ? slideArray[i + 1] : slideArray[i-1];
                    nextSlide = slideArray[newSlideNumber];
                    currentSlide.classList.add("animating");
                    currentSlide.classList.add("zoomOut");
                    nextSlide.classList.add('animating');
                    nextSlide.classList.add(self.className);

                    carousel.classList.add('hideIndicators');
                    break;
                }   
            }
            setTimeout(()=>{
              currentSlide.classList.remove("animating");
              currentSlide.classList.remove("zoomOut");
              nextSlide.classList.remove("animating");
               nextSlide.classList.remove(self.className);
               carousel.classList.remove('hideIndicators');
            }, 1000)  
            
            //Chart Reflow Issue
            if(typeof(Event) === 'function') {
              // modern browsers
              window.dispatchEvent(new Event('resize'));
            }else{
              // for IE and other old browsers
              // causes deprecation warning on modern browsers
              var evt = window.document.createEvent('UIEvents'); 
              evt.initUIEvent('resize', true, false, window, 0); 
              window.dispatchEvent(evt);
            }
            }
          });
    }



    ngOnChanges() {

    }

    ngOnDestroy() {
      this.isInitOver = false;
      this.slideChaneListener.unsubscribe();
    }

    ngAfterViewChecked(){
      this.isInitOver = true;
    }

    swipeL(){
      this.Carousal.nextSlide();
    }
    swipeR(){
      this.Carousal.previousSlide();
    }

    performInitialAnimation(){
      let slideArray = document.getElementsByTagName('slide');
      let lastSlide = slideArray[slideArray.length - 1];
      let currentSlide = slideArray[0];
      currentSlide.classList.add("animating");
      lastSlide.classList.add("animating");
      lastSlide.classList.add("rotateOutUpRight");

      setTimeout(()=>{
        currentSlide.classList.remove("animating");
        lastSlide.classList.remove("animating");
        lastSlide.classList.remove("rotateOutUpRight");
        this.isAnimationOver = true;
      }, 1000) 
    }
}
