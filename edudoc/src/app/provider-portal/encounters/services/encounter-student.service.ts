import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IEncounterEsignRejection } from '@model/interfaces/custom/encounter-esign-rejection.dto';
import { IEncounterEsign } from '@model/interfaces/custom/encounter-esign.dto';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { Observable, Subject } from 'rxjs';

export const emptyEncounterStudent: IEncounterStudent = {
    Archived: false,
    CaseLoadId: null,
    CreatedById: 0,
    DiagnosisCodeId: null,
    DocumentTypeId: null,
    EncounterDate: null,
    EncounterEndTime: null,
    EncounterId: 0,
    EncounterLocationId: 0,
    EncounterStartTime: null,
    EncounterStatusId: 1,
    EncounterStudentCptCodes: [],
    EncounterStudentGoals: [],
    EncounterStudentMethods: [],
    Id: 0,
    IsTelehealth: false,
    StudentDeviationReasonId: null,
    StudentId: 0,
    SupervisorComments: null,
    SupervisorESignedById: null,
    TherapyCaseNotes: null,
};

export interface IEncounterStudentRequestDto {
    EncounterStudent: IEncounterStudent;
}

export interface IEncounterStudentCreationRequestDto {
    StudentId: number;
    EncounterId: number;
    EncounterLocationId: number;
    StudentDeviationReasonId?: number;
}

@Injectable({
    providedIn: 'root',
})
export class EncounterStudentService extends BaseService<IEncounterStudent> {

    protected deviationReasonUpdateSource = new Subject<number>();
    deviationReasonUpdated$: Observable<number> = this.deviationReasonUpdateSource.asObservable();

    protected evaluationEditSource = new Subject<number>();
    evaluationEditUpdated$: Observable<number> = this.evaluationEditSource.asObservable();
    emitEvaluationEditChange(encounterStudentId: number): void {
        this.evaluationEditSource.next(encounterStudentId);
    }

    constructor(public http: HttpClient) {
        super('/encounter-students', http, ['EncounterDate']);
    }

    getEmptyEncounterStudent(): IEncounterStudent {
        return { ...emptyEncounterStudent };
    }

    getByEncounterId(encounterId: number): Observable<IEncounterStudent[]> {
        return this.http.get<IEncounterStudent[]>(`/encounter-students/get-by-encounterId/${encounterId}`);
    }

    isSupervisor(encounterStudentId: number): Observable<boolean> {
        return this.http.get<boolean>(`/encounter-students/${encounterStudentId}/isSupervisor`);
    }

    createEncounterStudent(studentId: number, encounterId: number, encounterLocationId: number, studentDeviationReasonId?: number): Observable<IEncounterStudent> {
        const encounterStudentCreationRequestDto: IEncounterStudentCreationRequestDto = {
            EncounterId: encounterId,
            StudentId: studentId,
            EncounterLocationId: encounterLocationId,
            StudentDeviationReasonId: studentDeviationReasonId
        };
        return this.http.post<IEncounterStudent>(`/encounter-students/create`, encounterStudentCreationRequestDto);
    }

    updateEncounterStudent(encounterStudent: IEncounterStudent): Observable<IEncounterStudent> {
        const encounterStudentRequestDto: IEncounterStudentRequestDto = {
            EncounterStudent: encounterStudent,
        };
        return this.http.put<IEncounterStudent>(`/encounter-students/update`, encounterStudentRequestDto);
    }

    signEncounter(encounterStudentId: number, esignPatch: IEncounterEsign): Observable<IEncounterStudent> {
        return this.http.put<IEncounterStudent>(`/encounter-students/${encounterStudentId}/sign-encounter`, esignPatch);
    }

    rejectEncounter(encounterStudentId: number, eSignRejectionPatch: IEncounterEsignRejection): Observable<IEncounterStudent> {
        return this.http.put<IEncounterStudent>(`/encounter-students/${encounterStudentId}/reject-encounter`, eSignRejectionPatch);
    }
    emitDeviationReasonChange(encounterStudentId: number): void {
        this.deviationReasonUpdateSource.next(encounterStudentId);
    }

    deleteMultipleStudentsFromEncounter(encounterStudentIds: number[]) {
        return this.http.delete<object>(`/encounter-students/bulkDeleteEncounters`, {
            responseType: 'text' as 'json',
            body: encounterStudentIds
        });
    }
}
