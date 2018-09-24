import { Component, OnInit } from '@angular/core';
import { TextService } from '@btsdigital/ngx-isomer-core';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.styl']
})
export class OperationsComponent implements OnInit {
    // private isCollapsed1: boolean = true;
    // private isCollapsed2: boolean = true;
    private activeIndex: number = 1;
    private tabNo: number;
    private tab1:string;
    private tab2:string;
    private flexibilityLevelArray = ["1","2","3","4","5","6","7","8","9","10"];
  
    constructor(private textengineService: TextService) { }

    ngOnInit() {
        this.tab1 = this.textengineService.getText("TabHeading1") || "Decision";
        this.tab2 = this.textengineService.getText("TabHeading2") || "Reports";
    }

    setActiveIndex(index: string): any {
        if (index === null) return;
        this.activeIndex = Number(index);
        switch (this.activeIndex) {
            case 1:
                this.tabNo = 1;
                break;            
            case 2:
                this.tabNo = 2;
                break;
            default:
                this.tabNo = 1;
                break;
        }
    }

}