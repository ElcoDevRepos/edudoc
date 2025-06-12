import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IBillingScheduleAdminNotification } from '@model/interfaces/billing-schedule-admin-notification';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyBillingScheduleAdminNotification: IBillingScheduleAdminNotification = {
    AdminId: 0,
    BillingScheduleId: 0,
    CreatedById: 0,
    Id: 0,
};

@Injectable({
    providedIn: 'root',
})
export class BillingScheduleAdminNotificationService extends BaseService<IBillingScheduleAdminNotification> {
    constructor(public http: HttpClient) {
        super('/admin-notification-inclusions', http);
    }

    getEmptyBillingScheduleAdminNotification(): IBillingScheduleAdminNotification {
        return { ...emptyBillingScheduleAdminNotification };
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/users/admin-select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
