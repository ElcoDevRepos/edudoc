import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITherapyCaseNote } from '@model/interfaces/therapy-case-note';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

export const emptyTherapyCaseNote: ITherapyCaseNote = {
    CreatedById: 0,
    DateCreated: new Date(),
    Id: 0,
    Notes: '',
    ProviderId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class TherapyCaseNoteService extends BaseService<ITherapyCaseNote> {
    constructor(public http: HttpClient) {
        super('/therapy-case-notes', http);
    }

    getEmptyTherapyCaseNote(): ITherapyCaseNote {
        return { ...emptyTherapyCaseNote };
    }

    updateItems(notes: ITherapyCaseNote[]): Observable<unknown> {
        notes.forEach((n) => {
            n.CreatedById = 0;
            n.ProviderId = 0;
            n.DateCreated = new Date();
        });
        return this.http.put(`/therapy-case-notes/update`, notes);
    }

    hasMigrationHistory(): Observable<boolean> {
        return this.http.get<boolean>('/therapy-case-notes/has-migration-history');
    }

    downloadMigrationHistoryFile(): Observable<Blob> {
        return this.http.get('/therapy-case-notes/download-migration-history', { responseType: 'blob' });
    }
}
