import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProviderDashboardComponent } from './provider-dashboard-component/provider-dashboard.component';

import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { ProviderDashboardHeaderComponent } from './provider-dashboard-header/provider-dashboard-header.component';
import { ProviderDashboardService } from './services/provider-dashboard.service';
import { ProviderMessageService } from './services/provider-message.service';
import { MessagesWidgetComponent } from './widgets/messages-widget/messages-widget.component';
import { ToDoListWidgetComponent } from './widgets/to-do-list-widget/to-do-list-widget.component';

@NgModule({
    declarations: [
        ProviderDashboardComponent,
        ProviderDashboardHeaderComponent,
        MessagesWidgetComponent,
        ToDoListWidgetComponent,
    ],
    imports: [SharedModule, ModalModule],
})
export class ProviderDashboardModule {
    static forRoot(): ModuleWithProviders<ProviderDashboardModule> {
        return {
            ngModule: ProviderDashboardModule,
            providers: [ProviderDashboardService, ProviderMessageService],
        };
    }
}
