import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IBillingScheduleExcludedProvider } from '@model/interfaces/billing-schedule-excluded-provider';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyBillingScheduleExcludedProvider: IBillingScheduleExcludedProvider = {
    BillingScheduleId: 0,
    CreatedById: 0,
    Id: 0,
    ProviderId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class BillingScheduleExcludedProviderService extends BaseService<IBillingScheduleExcludedProvider> {
    constructor(public http: HttpClient) {
        super('/provider-exclusions', http);
    }

    getEmptyBillingScheduleExcludedProvider(): IBillingScheduleExcludedProvider {
        return { ...emptyBillingScheduleExcludedProvider};
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/providers/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
