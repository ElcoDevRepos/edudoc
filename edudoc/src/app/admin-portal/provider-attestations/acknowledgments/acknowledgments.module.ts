import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { AdminAcknowledgmentsComponent } from './components/admin-acknowledgments.component';

@NgModule({
    declarations: [AdminAcknowledgmentsComponent],
    exports: [AdminAcknowledgmentsComponent],
    imports: [SharedModule],
})
export class AcknowledgmentsModule {}
