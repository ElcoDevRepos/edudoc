import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { DistrictAdminReportsModule } from '@school-district-admin/reports/district-admin-reports.module';
import { SummaryReportDistrictComponent } from './summary-report-district/summary-report-district.component';

@NgModule({
    declarations: [
        SummaryReportDistrictComponent,
    ],
    imports: [
        SharedModule,
        DistrictAdminReportsModule,
    ],
})
export class SummaryReportModule {}
