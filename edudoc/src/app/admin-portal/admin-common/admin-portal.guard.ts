import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Injectable, Injector } from '@angular/core';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { AuthService } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Injectable()
export class AdminPortalGuard  {
    public authService: AuthService;
    public notificationsService: NotificationsService;

    constructor(public injector: Injector, public router: Router) {}

    /**
     * Function to determine if the route can be activated.
     * @param route
     */
    canActivate(): Observable<boolean> {
        if (!this.authService) {
            this.authService = this.injector.get(AuthService);
        }
        if (!this.notificationsService) {
            this.notificationsService = this.injector.get(NotificationsService);
        }

        const currentUser = this.authService.currentUser.getValue();

        if (currentUser && currentUser.CustomOptions.UserTypeId === UserTypesEnum.Admin) {
            return of(true);
        } else {
            // this.notificationsService.info('Only Admin Users can access the admin section');
            if (currentUser.CustomOptions.UserTypeId === UserTypesEnum.Admin) {
                void this.router.navigate(['/admin/home']);
                return of(false);
            } else if (currentUser.CustomOptions.UserTypeId === UserTypesEnum.Provider) {
                void this.router.navigate(['/provider/dashboard']);
                return of(false);
            } else if (currentUser.CustomOptions.UserTypeId === UserTypesEnum.SchoolDistrictAdmin) {
                void this.router.navigate(['/school-district-admin/home']);
                return of(false);
            }
            void this.router.navigate(['/login']);
            return of(false);
        }
    }
}
