import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IIepServiceDto } from '@model/interfaces/custom/iep-service.dto';
import { IIepService } from '@model/interfaces/iep-service';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';

export const emptyIepService: IIepService = {
    AudDate: null,
    AudTotalMinutes: 0,
    CcDate: null,
    CcTotalMinutes: 0,
    CreatedById: 0,
    EndDate: null,
    EtrExpirationDate: null,
    Id: 0,
    NursingDate: null,
    NursingTotalMinutes: 0,
    OtpDate: null,
    OtpTotalMinutes: 0,
    PsyDate: null,
    PsyTotalMinutes: 0,
    PtDate: null,
    PtTotalMinutes: 0,
    SocDate: null,
    SocTotalMinutes: 0,
    StartDate: null,
    StpDate: null,
    StpTotalMinutes: 0,
    StudentId: 0,
};

@Injectable({ providedIn: 'root' })
export class StudentIEPServicesService extends BaseService<IIepService> {

    constructor(public http: HttpClient) {
        super('/iep-services', http);
    }

    getEmptyIepService(studentId: number): IIepService {
        const emptyService = { ...emptyIepService };
        emptyService.StudentId = studentId;
        return emptyService;
    }

    getIepServices(csp: SearchParams): Observable<HttpResponse<IIepServiceDto[]>> {
        return this.http.get<IIepServiceDto[]>(`/iep-services/get-list`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}
