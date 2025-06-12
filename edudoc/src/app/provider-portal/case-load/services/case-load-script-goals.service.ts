import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ICaseLoadScriptGoal } from '@model/interfaces/case-load-script-goal';
import { IGoal } from '@model/interfaces/goal';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyCaseLoadScriptGoal: ICaseLoadScriptGoal = {
    Archived: false,
    CaseLoadScriptId: 0,
    CreatedById: 0,
    GoalId: 0,
    Id: 0,
};

@Injectable({ providedIn: 'root' })
export class CaseLoadScriptGoalsService extends BaseService<ICaseLoadScriptGoal> {
    private _goalOptions: IGoal[];

    constructor(public http: HttpClient) {
        super('/case-load-script-goals', http);
    }

    getEmptyCaseLoadScriptGoal(): ICaseLoadScriptGoal {
        return { ...emptyCaseLoadScriptGoal };
    }

    saveCaseLoadScriptGoals(caseLoadScriptId: number, caseLoadScriptGoals: ICaseLoadScriptGoal[]): Observable<number> {
        return this.http.post<number>(`/case-load-script-goals/${caseLoadScriptId}`, caseLoadScriptGoals);
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
}
