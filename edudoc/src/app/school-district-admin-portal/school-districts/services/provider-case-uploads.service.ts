import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDocument } from '@model/interfaces/base';
import { IProviderCaseUploadPreviewDTO } from '@model/interfaces/custom/provider-case-upload-preview.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderCaseUploadDocument } from '@model/interfaces/provider-case-upload-document';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { IHasDocuments } from '@mt-ng2/entity-components-documents';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProviderCaseUploadService extends BaseService<IDocument> implements IHasDocuments {

    providerId: number;
    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }

    getDocument(districtId: number, docId: number): Observable<Blob> {
        return this.http.get(`/school-districts/${districtId}/case-upload/${docId}`, { responseType: 'blob' as const });
    }

    getDocuments(districtId: number, searchParameters: SearchParams): Observable<HttpResponse<IDocument[]>> {
        const params = this.getHttpParams(searchParameters);
        return this.http.get<IDocument[]>(`/school-districts/${districtId}/case-upload/_search`, { observe: 'response', params: params });
    }

    getSampleRoster(districtId: number): Observable<Blob> {
        return this.http.get(`/school-districts/${districtId}/case-upload/sample-roster`, { responseType: 'blob' as const });
    }

    saveDocument(districtId: number, file: File): Observable<IProviderCaseUploadDocument> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<IProviderCaseUploadDocument>(`/school-districts/${districtId}/case-upload`, formData).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    previewDocument(districtId: number, file: File): Observable<IProviderCaseUploadPreviewDTO[]> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<IProviderCaseUploadPreviewDTO[]>(`/school-districts/${districtId}/case-upload/preview`, formData).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    deleteDocument(districtId: number, docId: number): Observable<object> {
        return this.http.delete<object>(`/school-districts/${districtId}/rosters/${docId}`, { responseType: 'text' as 'json' });
    }

    getProviderSelectOptions(districtId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/school-districts/${districtId}/case-upload/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
