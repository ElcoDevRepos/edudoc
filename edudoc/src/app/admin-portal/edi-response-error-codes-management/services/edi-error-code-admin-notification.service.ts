import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IEdiErrorCodeAdminNotification } from '@model/interfaces/edi-error-code-admin-notification';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyEdiErrorCodeAdminNotification: IEdiErrorCodeAdminNotification = {
    AdminId: 0,
    Archived: null,
    Id: 0,
};

@Injectable({
    providedIn: 'root',
})
export class EdiErrorCodeAdminNotificationService extends BaseService<IEdiErrorCodeAdminNotification> {
    constructor(public http: HttpClient) {
        super('/edi-error-code-admin-notifications', http);
    }

    getEmptyEdiErrorCodeAdminNotification(): IEdiErrorCodeAdminNotification {
        return { ...emptyEdiErrorCodeAdminNotification };
    }

    getAdmins(): Observable<IEdiErrorCodeAdminNotification[]> {
        return this.http.get<IEdiErrorCodeAdminNotification[]>(`/edi-error-code-admin-notifications/admins`)
            .pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
