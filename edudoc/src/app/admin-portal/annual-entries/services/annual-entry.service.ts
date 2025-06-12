import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { Observable, Subject } from 'rxjs';

export const emptyAnnualEntry: IAnnualEntry = {
    AllowableCosts: null,
    Id: 0,
    InterimPayments: null,
    Mer: null,
    Rmts: null,
    SchoolDistrictId: 0,
    SettlementAmount: null,
    StatusId: 0,
    Year: null,
    Archived: false
};

@Injectable({
    providedIn: 'root',
})
export class AnnualEntryService extends BaseService<IAnnualEntry> {
    protected annaulEntryArchiveUpdateSource = new Subject<void>();
    annaulEntryArchiveUpdated$: Observable<void> = this.annaulEntryArchiveUpdateSource.asObservable();

    constructor(public http: HttpClient) {
        super('/annual-entries', http);
    }

    getEmptyAnnualEntry(): IAnnualEntry {
        return { ...emptyAnnualEntry };
    }

    removeAnnualEntry(id: number): Observable<number> {
        return this.http.post<number>(`/annual-entries/archive/${id}`, {});
    }

    updateAnnualEntry(annualEntry: IAnnualEntry): Observable<number> {
        return this.http.put<number>(`/annual-entries/${annualEntry.Id}`, annualEntry);
    }

    emitAnnualEntryArchived(): void {
        this.annaulEntryArchiveUpdateSource.next();
    }
}
