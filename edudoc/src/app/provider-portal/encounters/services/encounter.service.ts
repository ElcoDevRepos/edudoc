import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { SearchParams } from '@mt-ng2/common-classes';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';

export const emptyEncounter: IEncounter = {
    AdditionalStudents: 0,
    Archived: false,
    CreatedById: 0,
    EncounterDate: null,
    EncounterEndTime: null,
    EncounterStartTime: null,
    EncounterStudents: [],
    EvaluationTypeId: null,
    FromSchedule: false,
    Id: 0,
    IsGroup: false,
    ProviderId: 0,
    ServiceTypeId: 0,
};

export interface IStudentTherapiesRequestDto {
    StudentTherapyScheduleId: number;
    TimeZoneOffsetMinutes: number;
}

export interface IEncounterOverlapDto {
    EncounterDate: Date;
    EncounterStartTime: string;
    EncounterEndTime: string;
    StudentId: number;
    EncounterId: number;
    TimeZoneOffsetMinutes: number;
}

@Injectable({
    providedIn: 'root',
})
export class EncounterService extends BaseService<IEncounter> {
    protected encounterAbandonedUpdateSource = new Subject<void>();
    encounterAbandonedUpdated$: Observable<void> = this.encounterAbandonedUpdateSource.asObservable();
    isGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isGroupUpdated$: Observable<boolean> = this.isGroup.asObservable();

    // setEncounterGroupStatus(value: boolean): void {
    //     this.isGroup.next(value);
    // }

    emitIsGroupChange(value: boolean): void {
        this.isGroup.next(value);
    }

    getEncounterGroupStatus(): Observable<boolean> {
        return this.isGroup.asObservable();
    }

    constructor(public http: HttpClient, private dateTimeConverterService: DateTimeConverterService) {
        super('/encounters', http, ['EncounterDate']);
    }

    emitEncounterAbandonedChange(): void {
        this.encounterAbandonedUpdateSource.next();
    }

    getEmptyEncounter(): IEncounter {
        return JSON.parse(JSON.stringify(emptyEncounter));
    }

    buildEncounterByScheduleId(studentTherapyScheduleId: number): Observable<number> {
        const studentTherapiesRequestDto: IStudentTherapiesRequestDto = {
            StudentTherapyScheduleId: studentTherapyScheduleId,
            TimeZoneOffsetMinutes: new Date().getTimezoneOffset(),
        };
        return this.http.post<number>(`/encounters/student-therapy-schedule`, studentTherapiesRequestDto);
    }

    getByEncounterStudentId(encounterStudentId: number): Observable<IEncounter[]> {
        return this.http.get<IEncounter[]>(`/encounters/individual-encounter/${encounterStudentId}`);
    }

    getAssistantEncounters(csp: SearchParams): Observable<HttpResponse<IEncounterResponseDto[]>> {
        return this.http.get<IEncounterResponseDto[]>(`/encounters/assistant-encounters`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    checkEncounterStudentOverlap(date: Date, startTime: string, endTime: string, encounterId: number, studentId: number): Observable<number> {
        const encounterOverlapDto: IEncounterOverlapDto = {
            EncounterDate: date,
            EncounterStartTime: startTime,
            EncounterEndTime: endTime,
            StudentId: studentId,
            EncounterId: encounterId,
            TimeZoneOffsetMinutes: new Date().getTimezoneOffset(),
        };
        return this.http.post<number>(`/encounters/overlap`, encounterOverlapDto);
    }

    getReturnEncounters(csp: SearchParams): Observable<HttpResponse<IEncounterStudent[]>> {
        return this.http.get<IEncounterStudent[]>(`/encounters/return-encounters`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    setEncounterLocalTime(encounter: IEncounterStudent | IEncounter): void {
        encounter.EncounterStartTime = this.dateTimeConverterService.convertTimeToBrowserTimeZoneString(
            encounter.EncounterStartTime,
            encounter.EncounterDate,
        );
        encounter.EncounterEndTime = this.dateTimeConverterService.convertTimeToBrowserTimeZoneString(
            encounter.EncounterEndTime,
            encounter.EncounterDate,
        );
    }

    updateStatus(request: IClaimAuditRequestDto): Observable<void> {
        return this.http.put<void>('/encounters/update-status', request);
    }

    getEncounterNumbers(encounterId: number): Observable<string[]> {
        return this.http.get<string[]>(`/encounters/get-encounter-numbers/${encounterId}`);
    }

    archiveAll(searchParams: SearchParams): Observable<void> {
        return this.http.get<void>('/encounters/archive-selected', { params: this.getHttpParams(searchParams) });
    }

    validateEncounterDateTime(aggregateStudents: IEncounterStudent[]): Observable<number[]> {
        const nonDeviatedAggregateStudents = aggregateStudents.filter((es) => !es.StudentDeviationReasonId);
        // All encounters are deviated
        // NOTE: should this business logic be somewhere else, or is this alright?
        if (nonDeviatedAggregateStudents.length === 0) {
            return of([0]);
        }

        const actionList = nonDeviatedAggregateStudents.map((es) =>
            this.checkEncounterStudentOverlap(es.EncounterDate, es.EncounterStartTime, es.EncounterEndTime, es.EncounterId, es.StudentId),
        );
        return forkJoin(actionList);
    }
}
