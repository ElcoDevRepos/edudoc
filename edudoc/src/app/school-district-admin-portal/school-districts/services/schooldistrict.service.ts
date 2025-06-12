import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IAddress } from '@model/interfaces/address';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { catchError } from 'rxjs/operators';

export const emptySchoolDistrict: ISchoolDistrict = {
    ActiveStatus: true,
    Archived: false,
    CaseNotesRequired: false,
    IepDatesRequired: false,
    Code: null,
    CreatedById: 0,
    EinNumber: null,
    Id: 0,
    IrnNumber: null,
    Name: null,
    Notes: null,
    NpiNumber: null,
    ProgressReports: null,
    ProviderNumber: null,
    RequireNotesForAllEncountersSent: false,
    UseDisabilityCodes: false,
};

@Injectable({ providedIn: 'root' })
export class SchoolDistrictService extends BaseService<ISchoolDistrict> {
    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }

    getEmptySchoolDistrict(): ISchoolDistrict {
        return { ...emptySchoolDistrict };
    }

    search(csp: SearchParams): Observable<HttpResponse<ISchoolDistrict[]>> {
        return this.http.get<ISchoolDistrict[]>(`/school-districts/search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    saveAddress(schoolDistrictId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/school-districts/${schoolDistrictId}/address`, address);
        } else {
            return this.http.put<number>(`/school-districts/${schoolDistrictId}/address`, address);
        }
    }

    deleteAddress(schoolDistrictId: number): Observable<object> {
        return this.http.delete<object>(`/school-districts/${schoolDistrictId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    getAssignableSchoolDistricts(roleId: number): Observable<ISchoolDistrict[]> {
        return this.http.get<ISchoolDistrict[]>(`/school-districts/assignableDistricts/${roleId}`);
    }

    getAvailableDistrictAdmins(districtId: number): Observable<IUser[]> {
        return this.http.get<IUser[]>(`/school-districts/${districtId}/availableDistrictAdmins`);
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/school-districts/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
