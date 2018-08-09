import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '../../utils/utils';

@Pipe({ name: 'searchGlossary' })
export class SearchGlossaryPipe implements PipeTransform {

    transform(glossaryContent: any, searchAlphabet: string) {
        if (glossaryContent) {
            return glossaryContent.filter(g => this.getGlossaryList(g, searchAlphabet));
        }
    }

    getGlossaryList(g: any, searchAlphabet: string): boolean {
        if (g.glossary) {
            var childMatch = true;
            var result = g.glossary.filter(gi => gi.title.toLowerCase().indexOf(searchAlphabet.toLowerCase()) > -1);
            
            if (result.length == 0)
                childMatch = false;

            return childMatch;
        }
        else {
            return g.title.toLowerCase().indexOf(searchAlphabet.toLowerCase()) > -1;
        }
    }
}