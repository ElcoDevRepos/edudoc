import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ISupervisorProviderStudentReferalSignOff } from '@model/interfaces/supervisor-provider-student-referal-sign-off';

export const emptySupervisorProviderStudentReferalSignOff: ISupervisorProviderStudentReferalSignOff = {
    CreatedById: 0,
    Id: 0,
    StudentId: 0,
    SupervisorId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class SupervisorProviderStudentReferalSignOffService extends BaseService<ISupervisorProviderStudentReferalSignOff> {
    constructor(public http: HttpClient) {
        super('/supervisorproviderstudentreferalsignoffs', http);
    }

    getEmptySupervisorProviderStudentReferalSignOff(): ISupervisorProviderStudentReferalSignOff {
        return { ...emptySupervisorProviderStudentReferalSignOff };
    }
}
