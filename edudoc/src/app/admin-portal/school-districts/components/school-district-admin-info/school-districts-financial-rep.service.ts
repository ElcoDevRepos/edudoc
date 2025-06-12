import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';
import { ISchoolDistrictsFinancialRep } from '../../../../model/interfaces/school-districts-financial-rep';

export const emptySchoolDistrictsFinancialRep: ISchoolDistrictsFinancialRep = {
    FinancialRepId: 0,
    Id: 0,
    SchoolDistrictId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class SchoolDistrictsFinancialRepService extends BaseService<ISchoolDistrictsFinancialRep> {
    constructor(public http: HttpClient) {
        super('/school-districts-financial-reps', http);
    }

    getEmptySchoolDistrictsFinancialRep(): ISchoolDistrictsFinancialRep {
        return { ...emptySchoolDistrictsFinancialRep };
    }

    updateSchoolDistrictFinancialReps(schoolDistrictId: number, financialRepIds: number[]): Observable<number> {
        return this.http.post<number>(`/school-districts-financial-reps/update/${schoolDistrictId}`, financialRepIds);
    }
}
