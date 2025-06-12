import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ProviderAcknowledgmentsComponent } from './components/provider-acknowledgments.component';

@NgModule({
    declarations: [ProviderAcknowledgmentsComponent],
    exports: [ProviderAcknowledgmentsComponent],
    imports: [SharedModule],
})
export class AcknowledgmentsModule {}
