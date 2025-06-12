import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { EdiResponseErrorCodesManagementComponent } from './edi-response-error-codes-management.component';

@NgModule({
    declarations: [EdiResponseErrorCodesManagementComponent],
    imports: [SharedModule],
})
export class EdiResponseErrorCodesModule {}
