import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GatewayService } from '../../../services/gateway/gateway.service';
import { ContentObject, COSection, HierarchyEmmitOptions, CriteriaForState, CriteriaType } from '../../classes/contentobject';
import { CoFilterPipe } from '../../../gateway/common/coFilter.pipe';

//import * as moment from 'moment/moment';
const SHOW_SCHEDULE_MODAL = 'show_schedule_modal';

declare var $: any;
const SHOW_ENROLLMODULE_MODAL = "show-enrollmodule-modal";

@Component({
	selector: 'co-hierarchy',
	templateUrl: './hierarchy.component.html'
})

export class HierarchyComponent implements OnInit {
	@Input() hdata: ContentObject;
	@Input() level: number = 0;
	@Input() controls: boolean;
	@Input() filter: any = { isNew: '', favourite: '', selectedLevel: '', selectedType: '', selectedStatus: '', selectedStatusText: '' };
	@Input() rootMetadata: any;


	@Output() contentChange: EventEmitter<any> = new EventEmitter<HierarchyEmmitOptions>();
	@Output() favouriteChange: EventEmitter<any> = new EventEmitter<HierarchyEmmitOptions>();

	constructor(private gws: GatewayService) { }

	opt: HierarchyEmmitOptions;
	iconsPath: string = this.gws.iconsPath;
	lvlNo = null;
	showControls = false;
	currentDate =  new Date().toISOString();

	clsName1 = null;
	clsName2 = null;
	rescheduleStatus: boolean = false;


	ngOnInit() {
		this.lvlNo = this.level + 1;
		this.showControls = this.controls;

		if (this.lvlNo == 2) {
			this.clsName1 = "hi-list" + this.lvlNo + " " + "coLevel2CollapseContBG";
		} else {
			this.clsName1 = "hi-list" + this.lvlNo;
		}
		this.clsName2 = "level" + this.lvlNo + "Expand";

		/*setTimeout(function () {
			$('[data-toggle="tooltip"]').tooltip();
		}, 2000 * this.lvlNo);*/
	}

	onCoChange(heo: HierarchyEmmitOptions) {
		//console.log("onCoChange called", heo.action);
		this.contentChange.emit(heo);
	}

	schedule(event:any, items: ContentObject) {
		event.stopPropagation();	
		if (items.disabled) {
			return;
		}
		//$('.gw-scheduleModal').modal('show');
		this.gws.emitData(SHOW_SCHEDULE_MODAL, [items, event.currentTarget.innerText.trim()]);
	}
	
	showReschedule(items : ContentObject) {
		var self = this;
		if (items && items.criterias) {
			let filteredArray = items.criterias.filter(function(element) { 
				return element.CriteriaForState == CriteriaForState.Scheduling && element.CriteriaType == CriteriaType.AssessmentModuleId;
			});
			
			if (filteredArray.length > 0) {
				for (let i=0; i<filteredArray.length;i++) {
					let ResolvedCriteriaDate = new Date(filteredArray[i].ResolvedCriteriaValue).toISOString();
					if (ResolvedCriteriaDate > self.currentDate) {
						return true;
					}
				}
			}

			return false;
		}
	}
		
	toggleExpand(co) {
		co.expanded = !co.expanded;

		// if (!co.expanded && co.contentObjects.length > 0) {
		// 	for (var i = 0; i <= co.contentObjects.length - 1; i++) {
		// 		if (co.contentObjects[i].expanded == undefined) {
		// 			co.contentObjects[i]['expanded'] = false;
		// 		} else {
		// 			co.contentObjects[i].expanded = false;
		// 		}
		// 	}
		// }

		this.gws.emitData('REINIT_PROG', "");
	}

	onFavChange($event, items) {
		var opt = {}
		if ($event.newValue !== undefined) {
			items.fav = $event.newValue;
			opt = {
				action: "saveFavourite",
				data: items
			};
		}
		this.gws.emitData(this.gws.favouriteKey, opt);
	}

	jumpToCO(co: ContentObject, i) {
		if (co.locked) {
			return;
		}
		var opt: HierarchyEmmitOptions = new HierarchyEmmitOptions("contentPage", co, i);
		this.contentChange.emit(opt);
	}

	editMe(levelNo, curNode, curIdx) {
		var editAction: string = null;

		if (curNode.contentObjects.length == 0 && curNode.section !== null && curNode.section.length > 0 && !curNode.parent.parent.parent) {
			levelNo = 3;
		}

		if (levelNo == 1) {
			editAction = "editModule";
		} else if (levelNo == 2) {
			editAction = "editTopic";
		} else if (levelNo == 3) {
			editAction = "editSection";
		} else {
			editAction = null;
		}

		this.hierarchyEmmit(editAction, curNode, curIdx);
	}

	addTopic(mNode, mIdx) {
		this.hierarchyEmmit("addTopic", mNode, mIdx);
	}

	addSection(pNode) {
		this.hierarchyEmmit("addSection", pNode, 0);
	}

	moveUp(event, curNode, index) {
		event.stopPropagation();

		var newProgram = {
			contentObjects: []
		};

		for (var i = 0; i < curNode.parent.contentObjects.length; i++) {
			if (curNode.parent.contentObjects[i + 1] && curNode.parent.contentObjects[i + 1].id === curNode.id) {
				newProgram.contentObjects.push(curNode);
				newProgram.contentObjects.push(curNode.parent.contentObjects[i]);
				i++;
			}
			else {
				newProgram.contentObjects.push(curNode.parent.contentObjects[i]);
			}
		}

		curNode.parent.contentObjects = newProgram.contentObjects;
		this.hierarchyEmmit("saveSequence", curNode.parent, 0);
	}

	moveDown(event, curNode, index) {
		event.stopPropagation();

		var newProgram = {
			contentObjects: []
		};

		for (var i = 0; i < curNode.parent.contentObjects.length; i++) {
			if (curNode.parent.contentObjects[i] && curNode.parent.contentObjects[i].id === curNode.id && i < curNode.parent.contentObjects.length - 1) {
				newProgram.contentObjects.push(curNode.parent.contentObjects[i + 1]);
				newProgram.contentObjects.push(curNode);
				i++;
			}
			else {
				newProgram.contentObjects.push(curNode.parent.contentObjects[i]);
			}
		}

		curNode.parent.contentObjects = newProgram.contentObjects;
		this.hierarchyEmmit("saveSequence", curNode.parent, 0);
	}

	hierarchyEmmit(curAct, curNode, curIdx) {
		this.opt = {
			action: curAct,
			curNode: curNode,
			idx: curIdx
		}

		this.gws.emitData(this.gws.hierarchyKey, this.opt);
	}

	enrollModule(event, items) {
		event.stopPropagation();
		if (items.disabled) {
			return;
		}

		this.gws.emitData(SHOW_ENROLLMODULE_MODAL, items);
	}

}