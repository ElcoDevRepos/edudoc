import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IRevokeAccess } from '@model/interfaces/revoke-access';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

export const emptyRevokeAccess: IRevokeAccess = {
    AccessGranted: false,
    Date: null,
    Id: 0,
    OtherReason: '',
    ProviderId: 0,
    RevocationReasonId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class RevokeAccessService extends BaseService<IRevokeAccess> {
    constructor(public http: HttpClient) {
        super('/revokeAccesses', http);
    }

    getEmptyRevokeAccess(): IRevokeAccess {
        return { ...emptyRevokeAccess };
    }

    getAccessLogs(providerId: number, searchparams: SearchParams): Observable<HttpResponse<IRevokeAccess[]>> {
        const params = this.getHttpParams(searchparams);
        return this.http.get<IRevokeAccess[]>(`/revokeAccesses/getAccessLogs/${providerId}`, {observe: 'response', params: params});
    }
}
