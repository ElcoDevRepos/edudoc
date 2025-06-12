import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { DistrictAdminsComponent } from './components/district-admin-list/district-admins.component';
import { DistrictAdminSchoolDistrictBasicInfoComponent } from './components/district-admin-school-district-basic-info/district-admin-school-district-basic-info.component';
import { DistrictAdminSchoolDistrictDetailComponent } from './components/district-admin-school-district-detail/district-admin-school-district-detail.component';
import { DistrictAdminSchoolsComponent } from './components/district-admin-schools/district-admin-schools.component';

@NgModule({
    declarations: [DistrictAdminSchoolDistrictDetailComponent, DistrictAdminSchoolDistrictBasicInfoComponent, DistrictAdminSchoolsComponent, DistrictAdminsComponent],
    imports: [SharedModule],
})
export class DistrictAdminSchoolDistrictModule {}
