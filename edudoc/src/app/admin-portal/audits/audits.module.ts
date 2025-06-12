import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { AuditsComponent } from './audits.component';

@NgModule({
    declarations: [AuditsComponent],
    imports: [SharedModule, ModalModule],
})
export class AuditsModule {
    static forRoot(): ModuleWithProviders<AuditsModule> {
        return {
            ngModule: AuditsModule,
            providers: [],
        };
    }
}
