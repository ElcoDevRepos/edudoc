import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEventWithSchedule, IEncounterForCalendarDto } from '@model/interfaces/custom/encounter-for-calendar.dto';
import { IStudentTherapySchedule } from '@model/interfaces/student-therapy-schedule';
import { BaseService } from '@mt-ng2/base-service';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IEntity } from '@mt-ng2/shared-entities-module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export const emptyStudentTherapySchedule: IStudentTherapySchedule = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    Id: 0,
    ScheduleDate: new Date(),
    ScheduleEndTime: null,
    ScheduleStartTime: null,
    StudentTherapyId: 0,
};

export interface ICalendarEventDto {
    EndDate: Date;
    Location: string;
    StartDate: Date;
    Students: string[];
    Name: string;
}

export interface IStudentTherapiesDto {
    Id: number;
    EndTime: Date;
    GroupId: number;
    Location: string[];
    StartTime: Date;
    Students: string[];
    Name: string;
    TherapySchedules: IStudentTherapySchedule[];
    IsEsigned: boolean;
}

export interface IStudentTherapiesByDayDto extends IEntity {
    Weekday: number;
    StudentId: number;
    FirstName: string;
    LastName: string;
    StartTime: Date;
    EndTime: Date;
    SessionName: string;
}

interface ICalendarColors {
    blue: IColors,
    white: IColors,
}

interface IColors {
    primary: string;
    secondary: string;
}

export const calendarColors: ICalendarColors = {
    blue: {
        primary: '#007bc1', // border
        secondary: '#007bc1',
    },
    white: {
        primary: '#808080',
        secondary: '#F9F6EE',
    }
};

@Injectable({
    providedIn: 'root',
})
export class StudentTherapyScheduleService extends BaseService<IStudentTherapySchedule> {
    studentTherapySchedules: IStudentTherapiesDto[];
    studentTherapyScheduleIds: number[];

    searchEntity: IEntitySearchParams = {
        extraParams: [],
        order: 'StartTime',
        orderDirection: 'desc',
        query: '',
        skip: 0,
        take: 1,
    };
    searchParams: SearchParams = new SearchParams(this.searchEntity);

    // Saved filters
    startDate: Date;
    endDate: Date = new Date();
    order = 'StartTime';
    orderDirection = 'desc';
    daysOfTheWeek: number[] = [];
    query = '';

    constructor(public http: HttpClient) {
        super('/student-therapy-schedule', http);
    }

    getEmptyStudentTherapy(): IStudentTherapySchedule {
        return { ...emptyStudentTherapySchedule };
    }

    getForCalendar(csp: SearchParams): Observable<CalendarEventWithSchedule[]> {
        return this.http
            .get<IEncounterForCalendarDto[]>(`/student-therapy-schedule/calendar`, { observe: 'body', params: this.getHttpParams(csp) })
            .pipe(
                map((body) => {
                    return body.map((e) => {
                        const sessionName = e.IsSchedule ? e.SessionName : (e.IsGroup ? 'Group' : '');
                        return {
                            id: e.IsSchedule ? e.StudentTherapyScheduleId : e.EncounterId,
                            isSchedule: e.IsSchedule,
                            isFuture: e.IsFuture,
                            encounterServiceTypeId: e.EncounterServiceTypeId,
                            dateESigned: new Date(e.DateESigned),
                            encounterStatusId: e.EncounterStatusId,
                            isEsigned: e.IsEsigned,
                            isDeviated: e.isDeviated,
                            studentTherapyScheduleId: e.StudentTherapyScheduleId,
                            encounterId: e.EncounterId,
                            color: e.IsEsigned ? calendarColors.white : calendarColors.blue,
                            end: new Date(e.EndTime),
                            start: new Date(e.StartTime),
                            title: `${new Date(e.StartTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}-${new Date(e.EndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}<br>
                                ${sessionName}<br>${e.Students.join('/<br> ')}`,
                            actions: [{
                                label: e.TherapyGroupId > 0 || e.IsGroup ? `Group: ${e.Students.join('/<br> ')}` : `${e.Students.join('/ ')}`,
                                cssClass: e.IsEsigned || e.isDeviated ? `calendar-white` : `calendar-blue`,
                                onClick() { return; }
                            }],
                        };
                    });
                }),
            );
    }

    getForList(csp: SearchParams): Observable<HttpResponse<IStudentTherapiesDto[]>> {
        return this.http.get<IStudentTherapiesDto[]>(`/student-therapy-schedule/list`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    setDeviationReason(studentTherapyScheduleIds: number[], deviationReasonId: number, deviationReasonDate: Date): Observable<number> {
        return this.http.post<number>(`/student-therapy-schedule/set-deviation-reason`, {
            DeviationReasonDate: deviationReasonDate,
            DeviationReasonId: deviationReasonId,
            StudentTherapyScheduleIds: studentTherapyScheduleIds,
        });
    }

    getNextStudentTherapySchedule(csp: SearchParams): Observable<HttpResponse<IStudentTherapiesDto[]>> {
        return this.http.get<IStudentTherapiesDto[]>(`/student-therapy-schedule/next`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    setSearchParams(searchParams: SearchParams): void {
        this.searchParams = searchParams;
    }

    getForListByDay(csp: SearchParams): Observable<HttpResponse<IStudentTherapiesByDayDto[]>> {
        return this.http.get<IStudentTherapiesByDayDto[]>(`/student-therapy-schedule/list-by-day`, {
            observe: 'response',
            params: this.getHttpParams(csp),
        });
    }
    toggleArchived(scheduleIds: number[]): Observable<void> {
        return this.http.post<void>(`/student-therapy-schedule/toggle-archived`, scheduleIds);
    }
}
