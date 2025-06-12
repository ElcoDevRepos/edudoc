import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IBillingScheduleExcludedServiceCode } from '@model/interfaces/billing-schedule-excluded-service-code';
import { IServiceCode } from '@model/interfaces/service-code';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyBillingScheduleExcludedServiceCode: IBillingScheduleExcludedServiceCode = {
    BillingScheduleId: 0,
    CreatedById: 0,
    Id: 0,
    ServiceCodeId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class BillingScheduleExcludedServiceCodeService extends BaseService<IBillingScheduleExcludedServiceCode> {
    constructor(public http: HttpClient) {
        super('/service-code-exclusions', http);
    }

    getEmptyBillingScheduleExcludedServiceCode(): IBillingScheduleExcludedServiceCode {
        return { ...emptyBillingScheduleExcludedServiceCode};
    }

    getServiceCodes(): Observable<IServiceCode[]> {
        return this.http.get<IServiceCode[]>(`/options/serviceCodes`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
