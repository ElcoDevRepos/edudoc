import { NgModule } from '@angular/core';

import { MessageLinkBasicInfoComponent } from './components/message-link-basic-info/message-link-basic-info.component';
import { MessageLinkDetailComponent } from './components/message-link-detail/message-link-detail.component';
import { MessageLinkHeaderComponent } from './components/message-link-header/message-link-header.component';

import { SharedModule } from '@common/shared.module';

@NgModule({
    declarations: [MessageLinkHeaderComponent, MessageLinkDetailComponent, MessageLinkBasicInfoComponent],
    exports: [MessageLinkHeaderComponent, MessageLinkDetailComponent, MessageLinkBasicInfoComponent],
    imports: [SharedModule],
})
export class MessageLinkModule {}
