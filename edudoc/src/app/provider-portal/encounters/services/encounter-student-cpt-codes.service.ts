import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ICptCode } from '@model/interfaces/cpt-code';
import { IEncounterStudentCptCode } from '@model/interfaces/encounter-student-cpt-code';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, Subject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyEncounterStudentCptCode: IEncounterStudentCptCode = {
    Archived: false,
    CptCodeId: 0,
    CreatedById: 0,
    EncounterStudentId: 0,
    Id: 0,
};

export interface IEncounterStudentCptCodeBulkUpdateDto {
    EncounterStudentId: number;
    SelectedCptCodeIds: number[];
    EncounterStudentMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class EncounterStudentCptCodesService extends BaseService<IEncounterStudentCptCode> {
    private _cptCodes: ICptCode[];
    private _serviceType: number;
    private _serviceCode: number;

    protected cptCodeUpdateSource = new Subject<void>();
    cptCodeUpdated$: Observable<void> = this.cptCodeUpdateSource.asObservable();
    emitCptCodeUpdatedChange(): void {
        this.cptCodeUpdateSource.next();
    }

    constructor(public http: HttpClient) {
        super('/encounter-student-cpt-codes', http);
    }

    getEmptyEncounterStudentCptCode(): IEncounterStudentCptCode {
        return { ...emptyEncounterStudentCptCode };
    }

    getCptCodeOptions(serviceTypeId: number, serviceCodeId: number): Observable<ICptCode[]> {
        if (this._serviceCode !== serviceCodeId || (this._serviceCode === serviceCodeId && (serviceTypeId !== this._serviceType || !this._cptCodes))) {
            return this.http.get<ICptCode[]>(`/encounter-student-cpt-codes/cptCodeOptions/${serviceTypeId}`).pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Code');
                    this._cptCodes = answer;
                    this._serviceType = serviceTypeId;
                    this._serviceCode = serviceCodeId;
                }),
            );
        } else {
            return of(this._cptCodes);
        }
    }

    updateGroupCptCodes(encounterid: number): Observable<number> {
        return this.http.post<number>(`/encounter-student-cpt-codes/${encounterid}/group-status-change`, {});
    }

    updateIndividualCptCodes(encounterId: number): Observable<number> {
        return this.http.post<number>(`/encounter-student-cpt-codes/${encounterId}/get-individual`, {});
    }

    bulkUpdate(encounterStudentId: number, selectedCptCodeIds: number[], minutes: number): Observable<IEncounterStudentCptCode[]> {
        const encounterStudentCreationRequestDto: IEncounterStudentCptCodeBulkUpdateDto = {
            EncounterStudentId: encounterStudentId,
            SelectedCptCodeIds: selectedCptCodeIds,
            EncounterStudentMinutes: minutes,
        };
        return this.http.post<IEncounterStudentCptCode[]>(`/encounter-student-cpt-codes/bulk-update`, encounterStudentCreationRequestDto);
    }
}
