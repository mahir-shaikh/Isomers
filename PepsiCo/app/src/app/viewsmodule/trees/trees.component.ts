import { Component, OnInit } from '@angular/core';
import { TextService} from '@btsdigital/ngx-isomer-core';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.styl']
})
export class TreesComponent implements OnInit {
    private activeIndex: number = 1;
    private treeNo: number;
    private tree1:string;
    private tree2:string;

    constructor(private textengineService: TextService) { }

    ngOnInit() {
        this.tree1 = this.textengineService.getText("TreeTabHeading1");
        this.tree2 = this.textengineService.getText("TreeTabHeading2");
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {     
            case 1:
                this.treeNo = 1;
                break;
            case 2:
                this.treeNo = 2;
                break;
            default:
                this.treeNo = 1;
                break;
        }
    }

}