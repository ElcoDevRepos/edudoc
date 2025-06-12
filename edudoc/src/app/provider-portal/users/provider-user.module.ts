import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { ProviderUserBasicInfoComponent } from './components/provider-user-basic-info/provider-user-basic-info.component';
import { ProviderUserDetailComponent } from './components/provider-user-detail/provider-user-detail.component';
import { ProviderUserHeaderComponent } from './components/provider-user-header/provider-user-header.component';
import { ProviderUserORPComponent } from './components/provider-user-ORP/provider-user-ORP.component';
import { ProviderUserPhotoComponent } from './components/provider-user-photo/provider-user-photo.component';

@NgModule({
    declarations: [
        ProviderUserHeaderComponent,
        ProviderUserDetailComponent,
        ProviderUserBasicInfoComponent,
        ProviderUserPhotoComponent,
        ProviderUserORPComponent,
    ],
    exports: [ProviderUserBasicInfoComponent],
    imports: [SharedModule],
})
export class ProviderUserModule {
    static forRoot(): ModuleWithProviders<ProviderUserModule> {
        return {
            ngModule: ProviderUserModule,
            providers: [],
        };
    }
}
