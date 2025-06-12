import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { ProviderTitleAddComponent } from './components/provider-title-add/provider-title-add.component';
import { ProviderTitleBasicInfoComponent } from './components/provider-title-basic-info/provider-title-basic-info.component';
import { ProviderTitleDetailComponent } from './components/provider-title-detail/provider-title-detail.component';
import { ProviderTitleHeaderComponent } from './components/provider-title-header/provider-title-header.component';
import { ProviderTitlesComponent } from './components/provider-title-list/provider-titles.component';

@NgModule({
    declarations: [
        ProviderTitlesComponent,
        ProviderTitleHeaderComponent,
        ProviderTitleAddComponent,
        ProviderTitleDetailComponent,
        ProviderTitleBasicInfoComponent,
    ],
    imports: [SharedModule],
})
export class ProviderTitleModule {}
