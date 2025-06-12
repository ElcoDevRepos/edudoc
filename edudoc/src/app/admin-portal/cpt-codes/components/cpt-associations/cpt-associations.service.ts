import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICptCodeAssocation } from '@model/interfaces/cpt-code-assocation';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const getEmptyCptCodeAssociation: ICptCodeAssocation = {
    Archived: false,
    CptCodeId: 0,
    CreatedById: 0,
    Default: false,
    EvaluationTypeId: 0,
    Id: 0,
    IsGroup: false,
    IsTelehealth: false,
    ProviderTitleId: 0,
    ServiceCodeId: 0,
    ServiceTypeId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class CptCodeAssociationsService extends BaseService<ICptCodeAssocation> {
    constructor(public http: HttpClient) {
        super('/cpt-code-associations', http);
    }

    getEmptyCptCodeAssociation(): ICptCodeAssocation {
        return { ...getEmptyCptCodeAssociation };
    }

    updateCptCodeAssociations(associations: ICptCodeAssocation[]): Observable<boolean> {
        return this.http.put<boolean>(`/cpt-code-associations/update-and-create`, associations).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
