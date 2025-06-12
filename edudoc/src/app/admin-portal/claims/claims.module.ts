import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { ClaimsAuditComponent } from './claims-audit-list.component';

@NgModule({
    declarations: [ClaimsAuditComponent],
    imports: [SharedModule, ModalModule],
})
export class ClaimsModule {
    static forRoot(): ModuleWithProviders<ClaimsModule> {
        return {
            ngModule: ClaimsModule,
            providers: [],
        };
    }
}
