import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MtDisableDuringHttpCallsModule  } from '@mt-ng2/disable-during-http-calls';
import { DynamicFormModule } from '@mt-ng2/dynamic-form';
import { EntityListModule } from '@mt-ng2/entity-list-module';
import { MtSearchBarControlModule } from '@mt-ng2/searchbar-control';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthPermissionsComponent } from './auth-user/auth-permissions/auth-permissions.component';
import { AuthUserPasswordComponent } from './auth-user/auth-user-password/auth-user-password.component';
import { AuthUserPortalAccessComponent } from './auth-user/auth-user-portal-access/auth-user-portal-access.component';

@NgModule({
    bootstrap: [],
    declarations: [AuthUserPortalAccessComponent, AuthUserPasswordComponent, AuthPermissionsComponent],
    exports: [AuthUserPortalAccessComponent, AuthUserPasswordComponent, AuthPermissionsComponent],
    imports: [
        CommonModule,
        DynamicFormModule,
        MtDisableDuringHttpCallsModule ,
        EntityListModule,
        NgbModule,
        MtSearchBarControlModule,
    ],
})
export class AuthEntityModule {}
