import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { DistrictAdminSchoolDistrictBasicInfoComponent } from './district-admin-school-district-basic-info/district-admin-school-district-basic-info.component';
import { DistrictAdminSchoolDistrictDetailComponent } from './district-admin-school-district-detail/district-admin-school-district-detail.component';
import { DistrictAdminSchoolsComponent } from './district-admin-schools/district-admin-schools.component';
import { DistrictAdminSchoolDistrictProgressReportDateComponent } from './district-admin-school-district-progress-report-date/district-admin-school-district-progress-report-date.component';

@NgModule({
    declarations: [
        DistrictAdminSchoolDistrictDetailComponent, 
        DistrictAdminSchoolDistrictBasicInfoComponent, 
        DistrictAdminSchoolsComponent,
        DistrictAdminSchoolDistrictProgressReportDateComponent
    ],
    imports: [SharedModule],
})
export class DistrictAdminSchoolDistrictModule {}
