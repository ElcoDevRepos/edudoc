import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ICaseLoadScript } from '@model/interfaces/case-load-script';
import { Observable } from 'rxjs';

export const emptyCaseLoadScript: ICaseLoadScript = {
    Archived: false,
    CaseLoadId: 0,
    DateUpload: new Date(),
    DoctorFirstName: '',
    DoctorLastName: '',
    ExpirationDate: null,
    FileName: '',
    FilePath: '',
    Id: 0,
    InitiationDate: new Date(),
    Npi: '',
    UploadedById: 0,
    DiagnosisCodeId: null,
};

@Injectable({ providedIn: 'root' })
export class CaseLoadScriptsService extends BaseService<ICaseLoadScript> {

    constructor(public http: HttpClient) {
        super('/case-load-scripts', http);
    }

    getEmptyCaseLoadScript(): ICaseLoadScript {
        return { ...emptyCaseLoadScript };
    }

    saveCaseLoadScripts(caseLoadId: number, caseLoadScripts: ICaseLoadScript[]): Observable<number> {
        return this.http.post<number>(`/case-load-scripts/${caseLoadId}`, caseLoadScripts);
    }

    upload(caseLoadScript: ICaseLoadScript, formData: FormData): Observable<number> {
        return this.http.put<number>(`/case-load-scripts/${caseLoadScript.Id}/upload`, formData);
    }

    download(caseLoadScript: ICaseLoadScript): Observable<Blob> {
        return this.http.get(`/case-load-scripts/${caseLoadScript.Id}/download`, { responseType: 'blob' as const });
    }

}
