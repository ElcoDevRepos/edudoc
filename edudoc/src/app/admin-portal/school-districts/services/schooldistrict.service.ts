import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IAddress } from '@model/interfaces/address';
import { IContact } from '@model/interfaces/contact';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { sortByProperty } from '@mt-ng2/common-functions';
import { catchError, tap } from 'rxjs/operators';

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
    private _schooldistricts: ISchoolDistrict[];

    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }

    getEmptySchoolDistrict(): ISchoolDistrict {
        return { ...emptySchoolDistrict };
    }

    search(csp: SearchParams): Observable<HttpResponse<ISchoolDistrict[]>> {
        return this.http.get<ISchoolDistrict[]>(`/school-districts/search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getAllForMessages(): Observable<ISchoolDistrict[]> {
        if (!this._schooldistricts) {
            return this.http.get<ISchoolDistrict[]>(`/school-districts/message-options`).pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    this._schooldistricts = answer;
                }),
            );
        } else {
            return of(this._schooldistricts);
        }
    }

    saveAddress(schoolDistrictId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/school-districts/${schoolDistrictId}/address`, address);
        } else {
            return this.http.put<number>(`/school-districts/${schoolDistrictId}/address`, address);
        }
    }

    deleteAddress(schoolDistrictId: number): Observable<void> {
        return this.http.delete<void>(`/school-districts/${schoolDistrictId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    getAssignableSchoolDistricts(roleId: number): Observable<ISchoolDistrict[]> {
        return this.http.get<ISchoolDistrict[]>(`/school-districts/assignableDistricts/${roleId}`);
    }

    getAvailableDistrictAdmins(): Observable<IUser[]> {
        return this.http.get<IUser[]>(`/school-districts/availableDistrictAdmins`);
    }

    getAssignedDistrictAdmins(districtId: number): Observable<IUser[]> {
        return this.http.get<IUser[]>(`/school-districts/${districtId}/assignedDistrictAdmins`);
    }

    assignAdminDistrict(schoolDistrictId: number, newAssignmentId: number): Observable<number> {
        return this.http.put<number>(`/school-districts/${schoolDistrictId}/assign`, newAssignmentId);
    }

    unassignAdminDistrict(adminId: number): Observable<number> {
        return this.http.put<number>(`/school-districts/unassign`, adminId);
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/school-districts/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getSelectOptionsByEscIds(escIds): Observable<ISelectOptions[]> {
        return this.http.post<ISelectOptions[]>(`/school-districts/select-options`, escIds).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getDistrictsByEscId(escId: number): Observable<ISchoolDistrict[]> {
        return this.http.get<ISchoolDistrict[]>(`/school-districts/${escId}/district-options`);
    }

    getContacts(schoolDistrictId: number): Observable<IContact[]> {
        return this.http.get<IContact[]>(`/school-districts/contacts/${schoolDistrictId}`);
    }

    updateSchoolDistrictProviderCaseNotes(districtId: number, providerTitleIds: number[]): Observable<ISchoolDistrict> {
        return this.http.post<ISchoolDistrict>(`/school-districts/case-notes-required/${districtId}`, providerTitleIds).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getSchoolDistrictById(id: number): Observable<ISchoolDistrict> {
        return this.http.get<ISchoolDistrict>(`/school-districts/${id}`);
    }
}
