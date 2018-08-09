import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Http } from '@angular/http';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';
import { Dictionary } from '../../utils/utils';
import { SearchGlossaryPipe } from './search-glossary.pipe';

@Component({
    selector: 'glossary',
    templateUrl: './glossary.html',
    styleUrls: ['./glossary.css']
})

export class Glossary implements OnInit, OnDestroy {

    private alphabets: any = [];
    private activeIndex: number = 0;
    private glossaryContent: Dictionary;
    private glossaryContentPromise: Promise<any>;
    private searchAlphabet: string = '';

    constructor(private http: Http, private calcService: CalcService, private router: Router) {}

    ngOnInit() {
        for (let i = 65; i <= 90; i++) {
            this.alphabets.push(String.fromCharCode(i));
        }

        return this.glossaryContentPromise = new Promise((resolve, reject) => {
            this.loadTextContent().then(json => {
                this.glossaryContent = json;
                resolve(this.glossaryContent)
            });
        });
    }

    loadTextContent(): Promise<any> {
        return this.http.get('assets/data/Glossary.json').toPromise().then(response => response.json());
    }
    
    ngOnDestroy() {

    }

    scrollGlossaryList(event, index: string) {
        this.activeIndex = parseInt(index);
        let toElement = document.getElementById(event.currentTarget.getAttribute('id').replace('#', ''));

        if (toElement) {
            this.scrollTo(document.getElementsByClassName('glossary-list')[0], toElement.offsetTop - 132, 400);
        }
    }

    scrollTo(element, to, duration) {
        let self = this;
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) return;
            self.scrollTo(element, to, duration - 10);
        }, 10);
    }

    searchGlossary(event) {
        this.searchAlphabet = event.currentTarget.value;
    }
}