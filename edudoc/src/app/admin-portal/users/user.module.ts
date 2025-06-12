import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { UserBasicInfoComponent } from './components/user-basic-info/user-basic-info.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserDistrictAdminAssignmentComponent } from './components/user-district-admin-assignment/user-district-admin-assignment.component';
import { UserDistrictAssignmentComponent } from './components/user-district-assignment/user-district-assignment.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { UsersComponent } from './components/user-list/users.component';
import { UserPhotoComponent } from './components/user-photo/user-photo.component';

@NgModule({
    declarations: [
        UsersComponent,
        UserHeaderComponent,
        UserDetailComponent,
        UserBasicInfoComponent,
        UserPhotoComponent,
        UserDistrictAssignmentComponent,
        UserDistrictAdminAssignmentComponent,
    ],
    exports: [UserBasicInfoComponent],
    imports: [SharedModule],
})
export class UserModule {
    static forRoot(): ModuleWithProviders<UserModule> {
        return {
            ngModule: UserModule,
            providers: [],
        };
    }
}
