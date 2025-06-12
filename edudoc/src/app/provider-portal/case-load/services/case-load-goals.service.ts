import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ICaseLoadGoal } from '@model/interfaces/case-load-goal';
import { IGoal } from '@model/interfaces/goal';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyCaseLoadGoal: ICaseLoadGoal = {
    Archived: false,
    CaseLoadId: 0,
    CreatedById: 0,
    GoalId: 0,
    Id: 0,
};

@Injectable({ providedIn: 'root' })
export class CaseLoadGoalsService extends BaseService<ICaseLoadGoal> {
    private _goalOptions: IGoal[];

    constructor(public http: HttpClient) {
        super('/case-load-goals', http);
    }

    getEmptyCaseLoadGoal(): ICaseLoadGoal {
        return { ...emptyCaseLoadGoal };
    }

    saveCaseLoadGoals(caseLoadId: number, caseLoadGoals: ICaseLoadGoal[]): Observable<number> {
        return this.http.post<number>(`/case-load-goals/${caseLoadId}`, caseLoadGoals);
    }

    getGoalOptions(): Observable<IGoal[]> {
        if (!this._goalOptions) {
            return this.http.get<IGoal[]>('/case-load-goals/goalOptions').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Description');
                    this._goalOptions = answer;
                }),
            );
        } else {
            return of(this._goalOptions);
        }
    }

    getNursingGoalOptions(): Observable<IGoal[]> {
        if (!this._goalOptions) {
            return this.http.get<IGoal[]>('/case-load-goals/nursing-goal-options').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Description');
                    this._goalOptions = answer;
                }),
            );
        } else {
            return of(this._goalOptions);
        }
    }
}
