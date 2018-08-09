import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { DataStore, Utils, EVENTS, SCENARIO, ROUTES } from '../../utils';
import { TextEngineService } from '../../textengine/textengine.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CalcService } from '../../calcmodule';
import { Subscription } from 'rxjs';
import { DataAdaptorService } from '../../dataadaptor/data-adaptor.service'


@Component({
    selector: 'opsoperationdata',
    templateUrl: './opsoperationdata.component.html',
    styleUrls: ['./opsoperationdata.component.styl']
})

export class OpsOperationDataComponent implements OnInit{
    private seriesInternalReadiness:Array<any>=[];
    private internalReportData: string;
    private internalReportDataSerialLabel: string;
    private chartOptions = '{"yAxis":{"reversedStacks":false}}';
    private closingData: number;
    constructor( private calcService: CalcService, private textEngineService : TextEngineService) { };

    ngOnInit() {
        let self = this;
        // self.seriesInternalReadiness = [
        // {
        //     type: 'column',
        //     name: 'tlOutputGraphsLabelIntReadinessOpening',
        //     data: ['tlOutputGraphsLIntReadinessOpening']
        // },
        // {
        //     type: 'column',
        //     name: 'tlOutputGraphsLabelIntReadinessITFTEs',
        //     data: ['tlOutputGraphsLIntReadinessITFTEs']
        // },
        // {
        //     type: 'column',
        //     name: 'tlOutputGraphsLabelIntReadinessSupplyChainFTEs',
        //     data: ['tlOutputGraphsLIntReadinessSupplyChainFTEs']
        // },
        // {
        //     type: 'column',
        //     name: 'tlOutputGraphsLabelIntReadinessInfrastructure',
        //     data: ['tlOutputGraphsLIntReadinessInfrastructure']
        // },
        // {
        //     type: 'column',
        //     name: 'tlOutputGraphsLabelIntReadinessIClosing',
        //     data: ['tlOutputGraphsLIntReadinessClosing']
        // }];
        this.closingData = parseInt(self.calcService.getValue("tlOutputGraphsLIntReadinessClosing"));
        this.internalReportData = "tlOutputGraphsLIntReadinessITFTEs, tlOutputGraphsLIntReadinessSupplyChainFTEs, tlOutputGraphsLIntReadinessInfrastructure";
        this.internalReportDataSerialLabel = "tlOutputGraphsLabelIntReadinessITFTEs, tlOutputGraphsLabelIntReadinessSupplyChainFTEs, tlOutputGraphsLabelIntReadinessInfrastructure";
    }

    ngOnDestroy() {
    }
}
