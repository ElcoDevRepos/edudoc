import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';

import { UserModule } from '@admin/users/user.module';
import { AddLicenseComponent } from './components/add-license/add-license.component';
import { AddOdeComponent } from './components/add-ode/add-ode.component';
import { DoNotBillCardComponent } from './components/do-not-bill-card/do-not-bill-card.component';
import { LicenseODEListComponent } from './components/license-ode-list/license-ode-list.component';
import { ProviderAccessLogComponent } from './components/provider-access-log/provider-access-log.component';
import { ProviderAccessRevocationComponent } from './components/provider-access-revocation/provider-access-revocation.component';
import { ProviderDoNotBillReasonsService } from './components/provider-access-revocation/provider-do-not-bill-reasons.service';
import { ProviderAcknowledgmentLogsComponent } from './components/provider-acknowledgments-log/provider-acknowledgments-log.component';
import { ProviderAssignmentComponent } from './components/provider-assignment/provider-assignment.component';
import { ProviderBasicInfoComponent } from './components/provider-basic-info/provider-basic-info.component';
import { ProviderDetailComponent } from './components/provider-detail/provider-detail.component';
import { ProviderHeaderComponent } from './components/provider-header/provider-header.component';
import { ProvidersComponent } from './components/provider-list/providers.component';
import { ProviderMedicaidStatusComponent } from './components/provider-medicaid-status/provider-medicaid-status.component';
import { ProviderService } from './provider.service';
import { AgencyTypeService } from './services/agency-type.service';
import { ProviderEmploymentTypeService } from './services/provider-employment-type.service';
import { ProviderLicenseService } from './services/provider-license.service';
import { ProviderOdeService } from './services/provider-ode.service';
import { ProviderSchoolDistrictService } from './services/provider-school-district.service';

@NgModule({
    declarations: [
        ProvidersComponent,
        ProviderMedicaidStatusComponent,
        ProviderHeaderComponent,
        ProviderDetailComponent,
        ProviderBasicInfoComponent,
        AddLicenseComponent,
        AddOdeComponent,
        LicenseODEListComponent,
        ProviderAccessRevocationComponent,
        ProviderAssignmentComponent,
        ProviderAcknowledgmentLogsComponent,
        ProviderAccessLogComponent,
        DoNotBillCardComponent,
    ],
    imports: [SharedModule, UserModule],
})
export class ProviderModule {
    static forRoot(): ModuleWithProviders<ProviderModule> {
        return {
            ngModule: ProviderModule,
            providers: [
                ProviderService,
                ProviderEmploymentTypeService,
                ProviderLicenseService,
                ProviderOdeService,
                ProviderDoNotBillReasonsService,
                ProviderSchoolDistrictService,
                AgencyTypeService,
            ],
        };
    }
}
