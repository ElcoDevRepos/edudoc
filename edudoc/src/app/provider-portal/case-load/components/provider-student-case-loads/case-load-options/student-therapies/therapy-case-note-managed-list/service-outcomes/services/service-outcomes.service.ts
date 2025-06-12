import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IServiceOutcome } from '@model/interfaces/service-outcome';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

export const emptyServiceOutcome: IServiceOutcome = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    GoalId: 0,
    Id: 0,
    Notes: '',
};

@Injectable({
    providedIn: 'root',
})
export class ServiceOutcomesService extends BaseService<IServiceOutcome> {
    constructor(public http: HttpClient) {
        super('/service-outcomes', http);
    }

    getEmptyServiceOutcome(): IServiceOutcome {
        return { ...emptyServiceOutcome };
    }

    updateItems(notes: IServiceOutcome[]): Observable<void> {
        notes.forEach((n) => {
            n.CreatedById = 0;
            n.DateCreated = new Date();
        });
        return this.http.put<void>(`/service-outcomes/update`, notes);
    }
}
