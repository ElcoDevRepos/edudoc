import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRosterValidation } from '@model/interfaces/roster-validation';
import { IRosterValidationFile } from '@model/interfaces/roster-validation-file';
import { IRosterValidationResponseFile } from '@model/interfaces/roster-validation-response-file';
import { IRosterValidationStudent } from '@model/interfaces/roster-validation-student';

import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RosterValidationService extends BaseService<IRosterValidation> {
    constructor(public http: HttpClient) {
        super('/roster-validations', http);
    }

    generateRosterValidationFile(): Observable<void> {
        return this.http.post<void>(`/roster-validations/generate`, {});
    }

    getRosterValidationFiles(csp: SearchParams): Observable<HttpResponse<IRosterValidationFile[]>> {
        return this.http.get<IRosterValidationFile[]>(`/roster-validations/get-files`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    download(fileId: number): Observable<Blob> {
        return this.http.get(`/roster-validations/${fileId}/download`, { responseType: 'blob' as const });
    }

    upload(rosterValidationFileId: number, formData: FormData): Observable<IRosterValidationResponseFile> {
        return this.http.put<IRosterValidationResponseFile>(`/roster-validations/${rosterValidationFileId}/upload`, formData);
    }

    get271UploadedStudents(csp: SearchParams): Observable<HttpResponse<IRosterValidationStudentResultDto>> {
        return this.http.get<IRosterValidationStudentResultDto>(`/roster-validations/get-uploaded-students`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}

export interface IRosterValidationStudentResultDto {
    Item1: IRosterValidationStudent[];
    Item2: Date;
}
