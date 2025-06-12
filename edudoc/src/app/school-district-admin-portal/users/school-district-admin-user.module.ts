import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { SchoolDistrictAdminUserBasicInfoComponent } from './components/school-district-admin-user-basic-info/school-district-admin-user-basic-info.component';
import { SchoolDistrictAdminUserDetailComponent } from './components/school-district-admin-user-detail/school-district-admin-user-detail.component';
import { SchoolDistrictAdminUserHeaderComponent } from './components/school-district-admin-user-header/school-district-admin-user-header.component';
import { SchoolDistrictAdminUserPhotoComponent } from './components/school-district-admin-user-photo/school-district-admin-user-photo.component';

@NgModule({
    declarations: [
        SchoolDistrictAdminUserHeaderComponent,
        SchoolDistrictAdminUserDetailComponent,
        SchoolDistrictAdminUserBasicInfoComponent,
        SchoolDistrictAdminUserPhotoComponent,
    ],
    exports: [SchoolDistrictAdminUserBasicInfoComponent],
    imports: [SharedModule],
})
export class SchoolDistrictAdminUserModule {
    static forRoot(): ModuleWithProviders<SchoolDistrictAdminUserModule> {
        return {
            ngModule: SchoolDistrictAdminUserModule,
            //schooldistrictadmins: [],
        };
    }
}
