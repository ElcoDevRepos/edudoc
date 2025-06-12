import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { EncounterComponent } from './encounters-list.component';

@NgModule({
    declarations: [EncounterComponent],
    imports: [SharedModule, ModalModule],
})
export class EncountersModule {
    static forRoot(): ModuleWithProviders<EncountersModule> {
        return {
            ngModule: EncountersModule,
            providers: [],
        };
    }
}
