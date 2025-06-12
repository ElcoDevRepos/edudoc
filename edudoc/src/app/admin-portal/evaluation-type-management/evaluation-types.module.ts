import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { EvaluationTypeManagementComponent } from './evaluation-type-management.component';

@NgModule({
    declarations: [EvaluationTypeManagementComponent],
    imports: [SharedModule],
})
export class EvaluationTypesModule {}
