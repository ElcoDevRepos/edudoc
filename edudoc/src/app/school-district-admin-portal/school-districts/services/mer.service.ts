import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@mt-ng2/base-service';
import { IDocument } from '@mt-ng2/entity-components-documents';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MerService extends BaseService<IDocument> {
    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }

    getDocument(districtId: number, docId: number): Observable<Blob> {
        return this.http.get(`/school-districts/${districtId}/mer/${docId}`, { responseType: 'blob' as const });
    }

    getDocumentByDistrictId(districtId: number): Observable<IDocument> {
        return this.http.get<IDocument>(`/school-districts/${districtId}/mer`);
    }

    saveDocument(districtId: number, file: File): Observable<void> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<void>(`/school-districts/${districtId}/mer`, formData).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    deleteDocument(districtId: number, docId: number): Observable<void> {
        return this.http.delete<void>(`/school-districts/${districtId}/mer/${docId}`, { responseType: 'text' as 'json' });
    }
}
