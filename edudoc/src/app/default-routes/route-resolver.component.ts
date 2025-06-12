import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoles } from '@model/UserRoles';
import { AuthService } from '@mt-ng2/auth-module';

@Component({
    selector: 'not-found',
    template: '',
})
export class RouteResolverComponent implements OnInit {
    path: string;
    adminPortalRoleIds = [UserRoles.AccountAssistant, UserRoles.AccountManager, UserRoles.Administrator];
    providerPortalRoleIds = [UserRoles.Provider];
    schoolDistrictAdminPortalRoleIds = [UserRoles.SchoolDistrictAdministrator];
    constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.isAuthenticated().subscribe((data) => {
            if (data) {
                const path = this.route.snapshot.url
                    .map((segment) => segment.path)
                    .filter((pathStr) => !['admin', 'provider', 'school-district-admin'].includes(pathStr));
                const user = this.authService.currentUser.getValue() ;
                if (this.providerPortalRoleIds.includes(user.CustomOptions.RoleId as UserRoles)) {
                    path.length ? void this.router.navigate(['/provider', ...path]) : void this.router.navigate(['/provider']);
                } else if (this.schoolDistrictAdminPortalRoleIds.includes(user.CustomOptions.RoleId as UserRoles)) {
                    path.length ? void this.router.navigate(['/school-district-admin', ...path]) : void this.router.navigate(['/school-district-admin']);
                } else {
                    path.length ? void this.router.navigate(['/admin', ...path]) : void this.router.navigate(['/admin']);
                }
            } else {
                void this.router.navigate(['/login']);
            }
        });
    }
}
