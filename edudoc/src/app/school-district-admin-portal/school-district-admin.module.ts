import { UserRoleModule } from '@admin/user-roles/user-roles.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { DistrictAdminDashboardModule } from './dashboard/district-admin-dashboard.module';
import { SchoolDistrictAdminNavModule } from './nav/school-district-admin-nav.module';
import { DistrictAdminReportsModule } from './reports/district-admin-reports.module';
import { SchoolDistrictAdminNotFoundComponent } from './school-district-admin-common/school-district-admin-not-found/not-found.component';
import { SchoolDistrictAdminPortalGuard } from './school-district-admin-common/school-district-admin-portal.guard';
import { SchoolDistrictAdminSharedModule } from './school-district-admin-common/school-district-admin-shared.module';
import { SchoolDistrictAdminRoutingModule } from './school-district-admin-routing.module';
import { SchoolDistrictAdminComponent } from './school-district-admin.component';
import { DistrictAdminSchoolDistrictModule } from './school-district-admins/district-admin-school-district.module';
import { StudentModule } from './students/student.module';
import { SchoolDistrictAdminUserModule } from './users/school-district-admin-user.module';

@NgModule({
    declarations: [SchoolDistrictAdminComponent, SchoolDistrictAdminNotFoundComponent],
    imports: [
        UserRoleModule,
        DistrictAdminSchoolDistrictModule,
        StudentModule,
        SchoolDistrictAdminSharedModule,
        SchoolDistrictAdminRoutingModule,
        SchoolDistrictAdminUserModule,
        SchoolDistrictAdminNavModule.forRoot(),
        DistrictAdminReportsModule,
        DistrictAdminDashboardModule,
        SharedModule,
    ],
    providers: [SchoolDistrictAdminPortalGuard],
})
export class SchoolDistrictAdminModule {}
