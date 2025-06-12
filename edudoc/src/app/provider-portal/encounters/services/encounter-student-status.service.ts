import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IEncounterStudentStatus } from '@model/interfaces/encounter-student-status';

export const emptyEncounterStudentStatus: IEncounterStudentStatus = {
    CreatedById: 0,
    EncounterStatusId: 0,
    EncounterStudentId: 0,
    Id: 0,
};

@Injectable({
    providedIn: 'root',
})
export class EncounterStudentStatusService extends BaseService<IEncounterStudentStatus> {
    constructor(public http: HttpClient) {
        super('/encounter-student-statuses', http);
    }

    getEmptyEncounterStudentStatus(): IEncounterStudentStatus {
        return { ...emptyEncounterStudentStatus };
    }
}
