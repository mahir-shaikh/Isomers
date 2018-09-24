import { NgModule } from '@angular/core';

import { LoggerService } from './app/services/logger/logger.service';
import { ChannelEvent, ChannelEventName, Channels, MessageFor } from './app/common/classes/channelevent';
import { ContentObject, COSection, HierarchyEmmitOptions, CriteriaType, CriteriaForState } from './app/common/classes/contentobject';
import { Delivery } from './app/common/classes/delivery';
import { XLSXParser } from './app/common/classes/excelParser';
import { ParticipantOverview, VoteResponse } from './app/common/classes/participantoverview';
import { Question } from './app/common/classes/question';
import { Section } from './app/common/classes/section';
import { CoFilterPipe } from './app/gateway/common/coFilter.pipe';
import { GatewayService } from './app/services/gateway/gateway.service';
import { FavComponent } from './app/gateway/common/fav.component';
import { SwitchComponent } from './app/gateway-authoring/common/switch.component';
import { SearchKeyPipe } from './app/gateway-authoring/common/searchKeys.pipe';
import { HierarchyComponent } from './app/common/components/hierarchy/hierarchy.component';

@NgModule({
    imports: [

    ],
    exports: [
        LoggerService,
        GatewayService
    ],
    declarations: [
        HierarchyComponent
    ],
    providers: [
        LoggerService,
        GatewayService
    ]
})
export class PulseUtilitiesModule {}
export { ChannelEvent, ChannelEventName, Channels, MessageFor, ContentObject, COSection, HierarchyEmmitOptions, CriteriaType, CriteriaForState, Delivery, XLSXParser, ParticipantOverview, VoteResponse, Question, Section }