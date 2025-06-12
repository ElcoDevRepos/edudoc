import { NgModule } from '@angular/core';

import { MessageBasicInfoComponent } from './components/message-basic-info/message-basic-info.component';
import { MessageDetailComponent } from './components/message-detail/message-detail.component';
import { MessageHeaderComponent } from './components/message-header/message-header.component';

import { SharedModule } from '@common/shared.module';
import { MessageDragAndDropComponent } from './components/message-drag-n-drop-list/message-drag-n-drop-list.component';

@NgModule({
    declarations: [MessageHeaderComponent, MessageDetailComponent, MessageBasicInfoComponent, MessageDragAndDropComponent],
    imports: [SharedModule],
})
export class MessageModule {}
