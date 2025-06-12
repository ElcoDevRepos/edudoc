import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { EntityComponentsDocumentsModule } from '@mt-ng2/entity-components-documents';
import { MessageDocumentBasicInfoComponent } from './components/message-document-basic-info/message-document-basic-info.component';
import { MessageDocumentDetailComponent } from './components/message-document-detail/message-document-detail.component';
import { MessageDocumentHeaderComponent } from './components/message-document-header/message-document-header.component';

@NgModule({
    declarations: [MessageDocumentHeaderComponent, MessageDocumentDetailComponent, MessageDocumentBasicInfoComponent],
    exports: [MessageDocumentHeaderComponent, MessageDocumentDetailComponent, MessageDocumentBasicInfoComponent],
    imports: [SharedModule, EntityComponentsDocumentsModule],
})
export class MessageDocumentModule {}
