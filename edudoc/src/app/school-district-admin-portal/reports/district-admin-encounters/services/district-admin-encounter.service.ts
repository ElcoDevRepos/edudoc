import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IEncounter } from '@model/interfaces/encounter';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DistrictAdminEncounterService extends BaseService<IEncounter> {
    constructor(public http: HttpClient) {
        super('/district-admin-encounters-by-student', http, ['EncounterDate', 'EncounterStudents.EncounterDate']);
    }

    getEncounters(csp: SearchParams): Observable<HttpResponse<IEncounterResponseDto[]>> {
        return this.http.get<IEncounterResponseDto[]>(`/district-admin-encounters-by-student/get-encounters`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getEncounterTotalMinutes(csp: SearchParams): Observable<HttpResponse<number>> {
            const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
            return this.http.get<number>(`/district-admin-encounters-by-student/get-total-minutes/${timeZoneOffsetMinutes}`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getCptCodeSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/district-admin-encounters-by-student/cpt-codes/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getProviderSelectOptions(districtId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/district-admin-encounters-by-student/providers/select-options/${districtId}`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getStudentOptions(csp: SearchParams): Observable<HttpResponse<ISelectOptions[]>> {
        return this.http.get<ISelectOptions[]>(`/district-admin-encounters-by-student/students`, { observe: 'response', params: this.getHttpParams(csp) });
    }

}
