import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDocument } from '@model/interfaces/base';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { ISchoolDistrictRosterDocument } from '@model/interfaces/school-district-roster-document';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { IHasDocuments } from '@mt-ng2/entity-components-documents';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SchoolDistrictRostersService extends BaseService<IDocument> implements IHasDocuments {
    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }

    getDocument(districtId: number, docId: number): Observable<Blob> {
        return this.http.get(`/school-districts/${districtId}/rosters/${docId}`, { responseType: 'blob' as const });
    }

    getDocuments(districtId: number, searchParameters: SearchParams): Observable<HttpResponse<IDocument[]>> {
        const params = this.getHttpParams(searchParameters);
        return this.http.get<IDocument[]>(`/school-districts/${districtId}/rosters/_search`, { observe: 'response', params: params });
    }

    getSampleRoster(districtId: number): Observable<Blob> {
        return this.http.get(`/school-districts/${districtId}/rosters/sample-roster`, { responseType: 'blob' as const });
    }

    saveDocument(districtId: number, file: File): Observable<ISchoolDistrictRosterDocument> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<ISchoolDistrictRosterDocument>(`/school-districts/${districtId}/rosters`, formData).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    previewDocument(districtId: number, file: File): Observable<ISchoolDistrictRoster[]> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<ISchoolDistrictRoster[]>(`/school-districts/${districtId}/rosters/preview`, formData).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    deleteDocument(districtId: number, docId: number): Observable<object> {
        return this.http.delete<object>(`/school-districts/${districtId}/rosters/${docId}`, { responseType: 'text' as 'json' });
    }
}
