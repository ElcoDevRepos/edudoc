import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IMergeCaseUploadDTO } from '@model/interfaces/custom/merge-case-upload.dto';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { Observable } from 'rxjs';

export const emptyProviderCaseUpload: IProviderCaseUpload = {
    Archived: null,
    DateCreated: null,
    DistrictId: 0,
    Id: 0,
    ProviderCaseUploadDocumentId: 0,
    ProviderId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class ProviderCaseUploadIssuesService extends BaseService<IProviderCaseUpload> {
    constructor(public http: HttpClient) {
        super('/students/case-upload-issues', http);
    }

    getEmptyProviderCaseUpload(): IProviderCaseUpload {
        return { ...emptyProviderCaseUpload };
    }

    mergeRoster(mergeDTO: IMergeCaseUploadDTO): Observable<object> {
        return this.http.put<object>(`/students/case-upload-issues/merge`, mergeDTO);
    }

    update(pcu: IProviderCaseUpload): Observable<IProviderCaseUpload> {
        return this.http.put<IProviderCaseUpload>(`/students/case-upload-issues/${pcu.Id}`, pcu);
    }

    removeAllIssues(): Observable<void> {
        return this.http.delete<void>(`/students/case-upload-issues/remove-all`);
    }
}
