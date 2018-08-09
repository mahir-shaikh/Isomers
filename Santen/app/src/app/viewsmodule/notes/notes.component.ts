import { Component, ElementRef, Input, OnInit, OnDestroy} from '@angular/core';
import { trigger, state, style, transition, animate, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router, Resolve, ActivatedRoute, Params, NavigationEnd } from '@angular/router';


@Component({
    selector: 'notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css'],
    animations: [
          trigger('heroState', [
            state('in', style({height: '*'})),
            transition('* => void', [
              style({height: '*'}),
              animate(350, style({height: 0}))
            ])
          ])
      ]
})

export class NotesComponent implements OnInit, OnDestroy {
    @Input() noteRef: string = "";
    @Input() textareaHeight: number = 250;
    @Input() textareaWidth: number = 350;
    @Input() notesRight: number = 0;
    @Input() notesTop: number = 0;
    private animState: string = "in";

    private expanded: boolean = false;
    constructor(private textengineService: TextEngineService, private calcService: CalcService, private activatedRoute: ActivatedRoute, private router: Router, private elRef: ElementRef, changeDetectorRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    expand(event){
        this.expanded = this.expanded? false : true;
        this.animState = this.animState == "in"? "void": "in";
    }
    getWidth(){
        return this.textareaWidth;
    }
}