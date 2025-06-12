import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IBillingScheduleExcludedCptCode } from '@model/interfaces/billing-schedule-excluded-cpt-code';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyBillingScheduleExcludedCptCode: IBillingScheduleExcludedCptCode = {
    BillingScheduleId: 0,
    CptCodeId: 0,
    CreatedById: 0,
    Id: 0,
};

@Injectable({
    providedIn: 'root',
})
export class BillingScheduleExcludedCptCodeService extends BaseService<IBillingScheduleExcludedCptCode> {
    constructor(public http: HttpClient) {
        super('/cpt-code-exclusions', http);
    }

    getEmptyBillingScheduleExcludedCptCode(): IBillingScheduleExcludedCptCode {
        return { ...emptyBillingScheduleExcludedCptCode};
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/cpt-codes/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
