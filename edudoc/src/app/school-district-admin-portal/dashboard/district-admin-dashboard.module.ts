import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { DistrictAdminDashboardComponent } from './district-admin-dashboard-component/district-admin-dashboard.component';
import { DistrictAdminDashboardHeaderComponent } from './district-admin-dashboard-header/district-admin-dashboard-header.component';
import { DistrictAdminDashboardService } from './services/district-admin-dashboard.service';
import { DistrictAdminMessageService } from './services/district-admin-message.service';
import { MessagesWidgetComponent } from './widgets/messages-widget/messages-widget.component';

@NgModule({
    declarations: [
        DistrictAdminDashboardComponent,
        DistrictAdminDashboardHeaderComponent,
        MessagesWidgetComponent,
    ],
    imports: [SharedModule, ModalModule],
})
export class DistrictAdminDashboardModule {
    static forRoot(): ModuleWithProviders<DistrictAdminDashboardModule> {
        return {
            ngModule: DistrictAdminDashboardModule,
            providers: [DistrictAdminDashboardService, DistrictAdminMessageService],
        };
    }
}
