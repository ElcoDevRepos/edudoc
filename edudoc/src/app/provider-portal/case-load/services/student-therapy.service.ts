import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { ITherapyGroup } from '@model/interfaces/therapy-group';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

export const emptyStudentTherapy: IStudentTherapy = {
    Archived: false,
    CaseLoadId: 0,
    CreatedById: 1,
    DateCreated: new Date(),
    EncounterLocationId: 0,
    EndDate: null,
    Friday: false,
    Id: 0,
    Monday: false,
    SessionName: null,
    StartDate: null,
    TherapyGroup: null,
    TherapyGroupId: null,
    Thursday: false,
    Tuesday: false,
    Wednesday: false,
};

export const emptyTherapyGroup: ITherapyGroup = {
    Archived: false,
    CreatedById: 1,
    DateCreated: new Date(),
    EndDate: null,
    Friday: false,
    Id: 0,
    Monday: false,
    Name: null,
    ProviderId: null,
    StartDate: null,
    Thursday: false,
    Tuesday: false,
    Wednesday: false,
};

@Injectable({
    providedIn: 'root',
})
export class StudentTherapyService extends BaseService<IStudentTherapy> {
    constructor(public http: HttpClient) {
        super('/student-therapy', http);
    }

    getEmptyStudentTherapy(): IStudentTherapy {
        return { ...emptyStudentTherapy };
    }

    getEmptyTherapyGroup(): ITherapyGroup {
        return { ...emptyTherapyGroup };
    }

    getGroupOptions(providerId: number, csp: SearchParams): Observable<HttpResponse<ITherapyGroup[]>> {
        return this.http.get<ITherapyGroup[]>(`/student-therapy/${providerId}/group-options`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}
