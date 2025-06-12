import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IProviderInactivityDate } from '@model/interfaces/provider-inactivity-date';
import { Observable } from 'rxjs';

export const emptyProviderInactivityDate: IProviderInactivityDate = {
    Archived: false,
    Id: 0,
    ProviderId: 0,
    ProviderInactivityEndDate: null,
    ProviderDoNotBillReasonId: 0,
    ProviderInactivityStartDate: null,
};

@Injectable({
    providedIn: 'root',
})
export class ProviderInactivityDateService extends BaseService<IProviderInactivityDate> {
    constructor(public http: HttpClient) {
        super('/providerinactivitydates', http);
    }

    getEmptyProviderInactivityDate(): IProviderInactivityDate {
        return { ...emptyProviderInactivityDate };
    }

    getInactivityDatesByProviderId(providerId: number): Observable<IProviderInactivityDate[]> {
        return this.http.get<IProviderInactivityDate[]>(`/providerinactivitydates/get-by-provider/${providerId}`);
    }
}
