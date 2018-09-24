import { Component, OnInit, ViewChild } from '@angular/core';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-researchdevelopment',
  templateUrl: './researchdevelopment.component.html',
  styleUrls: ['./researchdevelopment.component.styl']
})
export class ResearchdevelopmentComponent implements OnInit {
    private innovationList = ["SELECT INNOVATION", "Multi-Vitamin & Probiotics Juice", "Flavored Sparkling Water", "Flavored Bottled Water", "Fruit-Based Colas", "Organically Grown Green Tea", "Packaging for Force Energy Drinks", "Bio-Degradable Packaging", "Muscle Recovery Sports Drink", "Animal Farm Crisps", "Oats In A Cup", "Carbonated Candy", "Veggie-Bites", "Whole Grain Cookies", "Rice Pops", "Fake Baked Chips Acquisition"];
    private completeList = ["SELECT INNOVATION", "Multi-Vitamin & Probiotics Juice", "Flavored Sparkling Water", "Flavored Bottled Water", "Fruit-Based Colas", "Organically Grown Green Tea", "Packaging for Force Energy Drinks", "Bio-Degradable Packaging", "Muscle Recovery Sports Drink", "Animal Farm Crisps", "Oats In A Cup", "Carbonated Candy", "Veggie-Bites", "Whole Grain Cookies", "Rice Pops", "Fake Baked Chips Acquisition", "*Holy Cow Cup", "*Nitro Nachos", "*Home Fountain", "*CentrePlate"];
    private productRangeArray = ["Very Narrow","Narrow","Intermediate","Broad","Very Broad"];
    private activeIndex: number = 1;
    private tabNo: number;
    private tab1:string;
    private tab2:string;
    private isWhatIfEnabled: boolean = false;
    private isBreakthrough1Visible: boolean = false;
    private isBreakthrough2Visible: boolean = false;
    private isRnD3Visible: boolean = false;
    private isRnD4Visible: boolean = false;
    private isInnovationVisible: boolean = false;
    private modelChangeListner: any;
    private listIndex: number = -1;
    private currentYear: number;
    private isBreakthrough1Selected: boolean = false
    private isBreakthrough2Selected: boolean = false
    @ViewChild('innovationModal') public childModal: ModalDirective;

    constructor(private textengineService: TextService, private calcService: CalcService) { }

    ngOnInit() {
        let self = this;
        this.tab1 = this.textengineService.getText("TabHeading1") || "Decision";
        this.tab2 = this.textengineService.getText("TabHeading2") || "Reports";
        this.currentYear = +this.calcService.getValue("tlInputTeamYear");

        this.checkWhatIfStatus();
        this.checkRnDbooleans();
        this.initializeInnovationList();
        this.modelChangeListner = this.calcService.getObservable().subscribe(() => {
            self.checkRnDbooleans();
            self.initializeInnovationList();
        });
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

    checkWhatIfStatus(){
        this.isWhatIfEnabled = this.calcService.getValue("tlInputWhatIfActivate") == "0" ? false : true;
    }

    checkRnDbooleans(){
        let rangeForRnD3 = this.currentYear == 2 ? "tlOutputRnDFocus3Unlock" : this.currentYear == 3 ? "tlOutputRnDFocus3UnlockRd3" : "";
        let rangeForBreakThrough1 = this.currentYear == 2 ? "tlOutputBreakThroughInnov1Unlock" : this.currentYear == 3 ? "tlOutputBreakThroughInnov1UnlockRd3" : "";
        let rangeForRnD4 = this.currentYear == 3 ? "tlOutputRnDFocus4UnlockRd3" : "";
        let rangeForBreakThrough2 = this.currentYear == 3 ? "tlOutputBreakThroughInnov2UnlockRd3" : "";

        this.isRnD3Visible = rangeForRnD3 == "" ? false : this.calcService.getValue(rangeForRnD3) == "0" ? false : true;
        this.isRnD4Visible = rangeForRnD4 == "" ? false : this.calcService.getValue(rangeForRnD4) == "0" ? false : true;
        this.isBreakthrough1Visible = rangeForBreakThrough1 == "" ? false : this.calcService.getValue(rangeForBreakThrough1) == "0" ? false : true;
        this.isBreakthrough2Visible = rangeForBreakThrough2 == "" ? false : this.calcService.getValue(rangeForBreakThrough2) == "0" ? false : true;

        this.isBreakthrough1Selected = this.calcService.getValue("tlInputDisrupt1") == "0" ? false : true;
        this.isBreakthrough2Selected = this.calcService.getValue("tlInputDisrupt2") == "0" ? false : true;
    }

    showChildModal(index){
        this.listIndex = index;
        this.isInnovationVisible = true;
        this.childModal.show();
    }

    hideChildModal(){
        this.listIndex = -1;
        this.childModal.hide();
        this.isInnovationVisible = false;
    }

    updateDropdown(index){
        this.calcService.setValue("tlInputInnov"+this.listIndex,this.innovationList[index + 1]);
        this.hideChildModal();
    }

    initializeInnovationList(){
        // let checkList = this.calcService.getValue("dataInnovList");
        // this.innovationList = [];
        // for(let i=0; i< checkList.length;i++){
        //     let strValue = checkList[i][0];
        //     if(strValue == "unlocked"){
        //         this.innovationList.push(this.completeList[i]);
        //     }
        // }

        let checkListRangeName = ["tlOutputBreakThroughUnlock1","tlOutputBreakThroughUnlock2","tlOutputBreakThroughUnlock3","tlOutputBreakThroughUnlock4"];
        let breakthroughInnovationList = ["*Holy Cow Cup", "*Nitro Nachos", "*Home Fountain", "*CentrePlate"];
        this.innovationList = ["SELECT INNOVATION", "Multi-Vitamin & Probiotics Juice", "Flavored Sparkling Water", "Flavored Bottled Water", "Fruit-Based Colas", "Organically Grown Green Tea", "Packaging for Force Energy Drinks", "Bio-Degradable Packaging", "Muscle Recovery Sports Drink", "Animal Farm Crisps", "Oats In A Cup", "Carbonated Candy", "Veggie-Bites", "Whole Grain Cookies", "Rice Pops", "Fake Baked Chips Acquisition"];

        for(let i=0; i< checkListRangeName.length;i++){
            let strValue = this.calcService.getValue(checkListRangeName[i]);
            if(strValue == "unlocked"){
                this.innovationList.push(breakthroughInnovationList[i]);
            }
        }
    }

}