import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { AcknowledgmentsModule } from './acknowledgments/acknowledgments.module';
import { ElectronicSignaturesModule } from './electronic-signatures/electronic-signatures.module';
import { ProviderAttestationsComponent } from './provider-attestations.component';

@NgModule({
    declarations: [
        ProviderAttestationsComponent,
    ],
    exports: [
        AcknowledgmentsModule,
        ElectronicSignaturesModule,
    ],
    imports: [
        AcknowledgmentsModule,
        ElectronicSignaturesModule,
        SharedModule,
    ]
})
export class ProviderAttestationsModule {}
