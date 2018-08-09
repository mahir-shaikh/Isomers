import { Component, Input, OnInit, OnChanges, EventEmitter, ViewChild, OnDestroy, HostListener, ElementRef, AfterViewChecked } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective, CarouselComponent } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { HammerGestureConfig } from '@angular/platform-browser';

const MAX_ACTIVE_PATHS = 8;

@Component({
    selector: 'inputs-component',
    templateUrl: './inputs.component.html',
    styleUrls: ['./inputs.component.styl']
})

export class InputsComponent {
    private NoOfVisiblePaths = [];
    private className:string = "";
    private isInitOver: boolean = false;
    private isAnimationOver: boolean = false;
    private slideChangeListener : Subscription;  
    private activeSlideNumber : number= 0;
    private isButtonDisabled : boolean = false;
    private modelChangeListener : Subscription;
    @ViewChild('carousal') Carousal;

    constructor(private elRef: ElementRef,private dataStore: DataStore, private utils: Utils, private router:Router, private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        let totalActivePath = this.calcService.getValue("calcTotalActivePaths");
        this.NoOfVisiblePaths = [];
        if(totalActivePath == 0){
            this.NoOfVisiblePaths.push(1);
            this.isButtonDisabled = true;
        }else{
            for(let i = 0; i < totalActivePath; i++){
                this.NoOfVisiblePaths.push(1);
            }
        }

        if (this.NoOfVisiblePaths.length == MAX_ACTIVE_PATHS) {
          this.isButtonDisabled = true;
        }
        
        setTimeout(() => {
          if(window.screen.width <= 768 && this.NoOfVisiblePaths.length > 1){
            this.performInitialAnimation();
          }else{
            this.isAnimationOver = true;            
          }
        },200);

        let self = this;

        this.modelChangeListener = this.calcService.getObservable().subscribe(() => {
            let totalActivePath = Number(this.calcService.getValue("calcTotalActivePaths"));
            if(totalActivePath == this.NoOfVisiblePaths.length && this.NoOfVisiblePaths.length < MAX_ACTIVE_PATHS){
              this.isButtonDisabled = false;
            }else{
              this.isButtonDisabled = true;
            }
            if (totalActivePath === MAX_ACTIVE_PATHS) {
              this.isButtonDisabled = true;
            }
        });

        this.slideChangeListener = this.Carousal.activeSlideChange.subscribe((newSlideNumber) => {
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
            }
          });
    }

    ngOnDestroy() {
      this.isInitOver = false;
      this.slideChangeListener.unsubscribe();
    }

    ngOnChanges(){

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

    createNewPath(){
        if(this.NoOfVisiblePaths.length < MAX_ACTIVE_PATHS){
            this.NoOfVisiblePaths.push(1);
            this.isButtonDisabled = true;
            setTimeout(() => {
                this.Carousal.selectSlide(this.Carousal._slides.length - 1);
            },200)
        }
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
