import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INursingGoalResult } from '@model/interfaces/nursing-goal-result';
import { BaseService } from '@mt-ng2/base-service';
import { Observable, Subject } from 'rxjs';

export const emptyNursingGoalResult: INursingGoalResult = {
    Archived: false,
    Id: 0,
    Name: "",
    ResultsNote: false,
};

@Injectable({
    providedIn: 'root',
})
export class NursingGoalResultService extends BaseService<INursingGoalResult> {
    constructor(public http: HttpClient) {
        super('/nursing-goal-results', http);
    }

    protected nursingGoalResultUpdateSource = new Subject<INursingGoalResult[]>();
    nursingGoalResultUpdated$: Observable<INursingGoalResult[]> = this.nursingGoalResultUpdateSource.asObservable();

    getEmptyNursingGoalResult(): INursingGoalResult {
        return { ...emptyNursingGoalResult };
    }

    emitChangeNursingGoalResult(results: INursingGoalResult[]): void {
        this.nursingGoalResultUpdateSource.next(results);
    }
}
