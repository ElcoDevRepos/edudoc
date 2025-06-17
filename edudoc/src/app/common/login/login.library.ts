import { Router } from '@angular/router';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { UserRoles } from '@model/UserRoles';
import { ILoginResponse } from '@mt-ng2/auth-module';

export const loginSuccessHandler = function (config: { router: Router; returnUrl?: string; loginResponse: ILoginResponse }): void {
    const { router, returnUrl, loginResponse } = config;

    if (returnUrl) {
        void router.navigateByUrl(returnUrl);
    } else {
        const providerPortalRoleIds = [UserRoles.Provider];
        const schoolDistrictAdminPortalRoleIds = [UserRoles.SchoolDistrictAdministrator];

        const currentUser = loginResponse.UserDetails;
        const currentUserOptions = currentUser.CustomOptions as IUserDetailCustomOptions;
        if (currentUser && providerPortalRoleIds.includes(currentUserOptions.RoleId)) {
            void router.navigate(['/provider']);
        } else if (currentUser && schoolDistrictAdminPortalRoleIds.includes(currentUserOptions.RoleId)) {
            void router.navigate(['/school-district-admin']);
        } else {
            void router.navigate(['/admin']);
        }
    }
};
