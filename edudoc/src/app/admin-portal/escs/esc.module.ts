import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { EscBasicInfoComponent } from './components/esc-basic-info/esc-basic-info.component';
import { EscDetailComponent } from './components/esc-detail/esc-detail.component';
import { EscHeaderComponent } from './components/esc-header/esc-header.component';
import { EscsComponent } from './components/esc-list/escs.component';
import { EscContactService } from './services/esc-contact.service';
import { EscService } from './services/esc.service';

@NgModule({
    declarations: [EscsComponent, EscHeaderComponent, EscDetailComponent, EscBasicInfoComponent],
    imports: [SharedModule],
})
export class EscModule {
    static forRoot(): ModuleWithProviders<EscModule> {
        return {
            ngModule: EscModule,
            providers: [EscService, EscContactService],
        };
    }
}
