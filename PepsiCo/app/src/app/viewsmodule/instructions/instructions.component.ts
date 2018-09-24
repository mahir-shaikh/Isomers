import { Component, OnInit, trigger, state, style, animate, transition, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ngx-bootstrap';
import { TextService} from '@btsdigital/ngx-isomer-core';

@Component({
	selector: 'instructions',
	templateUrl: './instructions.html',
	styleUrls: ['./instructions.styl'],
	exportAs: 'instructionsPage'
})

export class InstructionsComponent implements OnInit{
	
	@ViewChild('lgModal') public childModal: ModalDirective;
    private expanded = true;
    private modalShow: boolean = true;
    private activeIndex:number = 0;
    private num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    private imagePath: string = "";
    private videoPath: string = "";
    private el:any;
    private emitEvent: EventEmitter<any> = new EventEmitter(true);

    constructor(private textEngine: TextService, private elRef: ElementRef) { };

    ngOnInit() {
        this.el = this.elRef.nativeElement;
    }

    public showChildModal(): void {
    	this.childModal.show();
    }

    public hideChildModal(): void {

        this.childModal.hide();
        
        let video = this.el.querySelector('.instruction-media.video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }

    public getObservable(){
        return this.emitEvent;
    }

    public isVideo(i) {
        var value, isvideo;
        value = this.textEngine.getText("InstructionsVideo" + i),
        isvideo = /mp4/.test(value.split('.').pop());
        if (isvideo) {
            this.videoPath = './assets/videos/'+ value;
            this.videoPath = this.videoPath.replace(".mp4", "");
        }
        return isvideo;
    }

    public isImage(i) {
        var value, isimage;
        value = this.textEngine.getText("InstructionsVideo" + i);
        isimage = /jpg|jpeg|png/.test(value.split('.').pop());
        if (isimage) {
            this.imagePath = './assets/images/'+ value;
        }
        return isimage;
    }
}