import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEscSchoolDistrict } from '@model/interfaces/esc-school-district';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

export const emptySchool: IEscSchoolDistrict = {
    Archived: false,
    CreatedById: 0,
    EscId: 0,
    Id: 0,
    SchoolDistrictId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class SchoolDistrictEscService extends BaseService<IEscSchoolDistrict> {
    constructor(public http: HttpClient) {
        super('/esc-school-districts', http);
    }

    getEmptyEscSchoolDistrict(): IEscSchoolDistrict {
        return { ...emptySchool };
    }

    archiveSchoolDistrict(escId: number, districtId: number): Observable<IEscSchoolDistrict> {
        return this.http.post<IEscSchoolDistrict>(`/esc-school-districts/archive/${escId}/${districtId}`, {});
    }
}
