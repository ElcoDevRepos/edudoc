import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { MyReasonsForReturnManagementComponent } from './my-reasons-for-return-management.component';

@NgModule({
    declarations: [MyReasonsForReturnManagementComponent],
    imports: [SharedModule],
})
export class MyReasonsForReturnModule {}
