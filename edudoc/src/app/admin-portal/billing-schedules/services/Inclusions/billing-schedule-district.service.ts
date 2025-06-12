import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IBillingScheduleDistrict } from '@model/interfaces/billing-schedule-district';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyBillingScheduleDistrict: IBillingScheduleDistrict = {
    BillingScheduleId: 0,
    CreatedById: 0,
    Id: 0,
    SchoolDistrictId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class BillingScheduleDistrictService extends BaseService<IBillingScheduleDistrict> {
    constructor(public http: HttpClient) {
        super('/school-district-inclusions', http);
    }

    getEmptyBillingScheduleDistrict(): IBillingScheduleDistrict {
        return { ...emptyBillingScheduleDistrict};
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/school-districts/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
