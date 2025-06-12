import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IAddress } from '@model/interfaces/address';
import { ISelectOptions, ISelectOptionsWithProviderId } from '@model/interfaces/custom/select-options';
import { IStudent } from '@model/interfaces/student';
import { BaseService } from '@mt-ng2/base-service';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ISelectionChangedEvent } from '@mt-ng2/type-ahead-control';
import { catchError } from 'rxjs/operators';
import { IStudentDto } from '@model/interfaces/custom/student.dto';

export const emptyStudent: IStudent = {
    Archived: false,
    CreatedById: 0,
    DateOfBirth: null,
    FirstName: null,
    Grade: null,
    Id: 0,
    LastName: null,
    MedicaidNo: null,
    SchoolId: 0,
    StudentCode: null,
    StudentParentalConsents: [],
};

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseService<IStudent> {
    // store filter values
    savedSearchEntity: IEntitySearchParams;
    savedDistrictSelectionEvent: ISelectionChangedEvent;

    constructor(public http: HttpClient) {
        super('/students', http, ['DateOfBirth']);
    }

    getEmptyStudent(): IStudent {
        return { ...emptyStudent };
    }

    getStudents(csp: SearchParams): Observable<HttpResponse<IStudentDto[]>> {
        return this.http.get<IStudentDto[]>(`/students/_search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    saveAddress(studentId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/students/${studentId}/address`, address);
        } else {
            return this.http.put<number>(`/students/${studentId}/address`, address);
        }
    }

    deleteAddress(studentId: number): Observable<void> {
        return this.http.delete<void>(`/students/${studentId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/students/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getStudentSelectOptionsByAssistant(): Observable<ISelectOptionsWithProviderId[]> {
        return this.http.get<ISelectOptionsWithProviderId[]>(`/students/select-options-by-assistant`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getStudentSelectOptionsByDistricts(csp: SearchParams): Observable<HttpResponse<ISelectOptions[]>> {
        return this.http.get<ISelectOptions[]>(`/students/select-options-by-districts`, { observe: 'response', params: this.getHttpParams(csp) }).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    setSearchEntity(search: IEntitySearchParams): void {
        this.savedSearchEntity = search;
    }

    setSavedDistrictSelectionEvent(event: ISelectionChangedEvent): void {
        this.savedDistrictSelectionEvent = event;
    }

    deleteStudentForSchoolDistrictAdmin(id: number): Observable<number> {
        return this.http.delete<number>(`/students/delete/${id}`, {});
    }

    createNoAddCaseload(student: IStudent): Observable<number> {
        return this.http.post<number>(`/students/create/no-caseload`, student);
    }
}
