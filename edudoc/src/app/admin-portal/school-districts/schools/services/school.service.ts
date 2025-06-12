import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISchool } from '@model/interfaces/school';
import { BaseService } from '@mt-ng2/base-service';

export const emptySchool: ISchool = {
    Archived: false,
    CreatedById: 0,
    Id: 0,
    Name: null,
};

@Injectable({ providedIn: 'root' })
export class SchoolService extends BaseService<ISchool> {
    constructor(public http: HttpClient) {
        super('/schools', http);
    }

    getEmptySchool(): ISchool {
        return { ...emptySchool };
    }

    createSchoolUnderDistrict(school: ISchool, districtId: number): Observable<ISchool> {
        return this.http.post<ISchool>(`/schools/${districtId}/create`, school);
    }

    updateSchool(school: ISchool, districtId: number): Observable<number> {
        return this.http.put<number>(`/schools/${districtId}/update`, school);
    }

    getDistrictSchools(districtId: number): Observable<ISchool[]> {
        return this.http.get<ISchool[]>(`/schools/district/${districtId}`);
    }
}
