import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEncounterStudentGoal } from '@model/interfaces/encounter-student-goal';
import { IGoal } from '@model/interfaces/goal';
import { INursingGoalResult } from '@model/interfaces/nursing-goal-result';
import { BaseService } from '@mt-ng2/base-service';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, Subject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyEncounterStudentGoal: IEncounterStudentGoal = {
    Archived: false,
    CreatedById: 0,
    EncounterStudentId: 0,
    GoalId: 0,
    Id: 0,
};

@Injectable({ providedIn: 'root' })
export class EncounterStudentGoalsService extends BaseService<IEncounterStudentGoal> {
    private _goals: IGoal[];
    private _nursingGoals: INursingGoalResult[];

    protected goalUpdateSource = new Subject<void>();
    goalUpdated$: Observable<void> = this.goalUpdateSource.asObservable();
    emitGoalUpdatedChange(): void {
        this.goalUpdateSource.next();
    }

    constructor(public http: HttpClient) {
        super('/encounter-student-goals', http);
    }

    getEmptyEncounterStudentGoal(): IEncounterStudentGoal {
        return { ...emptyEncounterStudentGoal };
    }

    saveEncounterStudentGoals(encounterId: number, encounterStudentGoals: IEncounterStudentGoal[]): Observable<number> {
        return this.http.post<number>(`/encounter-student-goals/${encounterId}`, encounterStudentGoals);
    }

    getGoalOptions(): Observable<IGoal[]> {
        if (!this._goals) {
            return this.http.get<IGoal[]>('/case-load-goals/goalOptions').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Description');
                    this._goals = answer;
                }),
            );
        } else {
            return of(this._goals);
        }
    }

    getNursingGoalResults(): Observable<INursingGoalResult[]> {
        if (!this._nursingGoals) {
            return this.http.get<INursingGoalResult[]>('/case-load-goals/resultOptions').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    this._nursingGoals = answer;
                }),
            );
        } else {
            return of(this._nursingGoals);
        }
    }
}
