import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMergeDTO } from '@model/interfaces/custom/merge.dto';
import { INextRosterIssueDto } from '@model/interfaces/custom/next-roster-issue-call.dto';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { IStudent } from '@model/interfaces/student';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyRoster: ISchoolDistrictRoster = {
    Archived: false,
    DateCreated: new Date(Date.now()),
    DateModified: new Date(Date.now()),
    Id: 0,
    SchoolDistrictId: 0,
    SchoolDistrictRosterDocumentId: 0,
    StateCode: '',
    Zip: '',
};

@Injectable({ providedIn: 'root' })
export class SchoolDistrictRosterIssuesService extends BaseService<ISchoolDistrictRoster> {
    constructor(public http: HttpClient) {
        super('/students/issues', http);
    }

    getDuplicatesByRosterId(rosterId: number): Observable<IStudent[]> {
        return this.http.get<IStudent[]>(`/students/issues/${rosterId}/duplicates`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    mergeRoster(mergeDTO: IMergeDTO): Observable<unknown> {
        return this.http.put(`/students/issues/merge`, mergeDTO);
    }

    removeAllIssues(): Observable<void> {
        return this.http.delete<void>(`/students/issues/remove-all`);
    }

    getNextRosterIssueId(rosterIssueId: number, order: string, orderDirection: string): Observable<number> {
        const dto: INextRosterIssueDto = {
            RosterIssueId: rosterIssueId,
            Order: order,
            OrderDirection: orderDirection,
        };
        return this.http.post<number>(`/students/issues/next`, dto);
    };
}
