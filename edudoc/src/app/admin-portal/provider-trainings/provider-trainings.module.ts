import { MessageDocumentModule } from '@admin/message/message-documents/message-document.module';
import { MessageLinkModule } from '@admin/message/message-links/message-link.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ProviderTrainingsAddComponent } from './provider-trainings-add/provider-trainings-add.component';
import { ProviderTrainingsComponent } from './provider-trainings-list/provider-trainings.component';
import { ProviderTrainingReminderDynamicCellComponent } from './provider-trainings-list/training-reminder-cell/training-reminder-cell.component';

@NgModule({
    declarations: [ProviderTrainingsComponent, ProviderTrainingsAddComponent, ProviderTrainingReminderDynamicCellComponent],
    imports: [SharedModule, MessageLinkModule, MessageDocumentModule],
})
export class ProviderTrainingsModule {}
