import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';

import { ClaimTypeService } from './claimtype.service';
import { ClaimValueService } from './claimvalue.service';
import { UserRoleBasicInfoComponent } from './user-role-basic-info/user-role-basic-info.component';
import { UserRoleDetailComponent } from './user-role-detail/user-role-detail.component';
import { UserRoleHeaderComponent } from './user-role-header/user-role-header.component';
import { UserRolesComponent } from './user-role-list/user-roles.component';
import { UserRolePermissionsComponent } from './user-role-permissions/user-role-permissions.component';
import { UserRoleService } from './user-role.service';

import { UserTypeService } from './user-type.service';

@NgModule({
    declarations: [UserRolesComponent, UserRoleDetailComponent, UserRoleHeaderComponent, UserRoleBasicInfoComponent, UserRolePermissionsComponent],
    imports: [SharedModule],
})
export class UserRoleModule {
    static forRoot(): ModuleWithProviders<UserRoleModule> {
        return {
            ngModule: UserRoleModule,
            providers: [UserRoleService, ClaimTypeService, ClaimValueService, UserTypeService],
        };
    }
}
