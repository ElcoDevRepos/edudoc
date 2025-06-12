import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICaseLoad } from '@model/interfaces/case-load';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { BaseService, ICreateOptions } from '@mt-ng2/base-service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyCaseLoad: ICaseLoad = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    DiagnosisCodeId: null,
    Id: 0,
    IepEndDate: null,
    IepStartDate: null,
    ServiceCodeId: 0,
    StudentId: 0,
    StudentTypeId: 0,
};

@Injectable({ providedIn: 'root' })
export class CaseLoadService extends BaseService<ICaseLoad> {
    private caseLoadCreatedSubject: Subject<ICaseLoad>;

    caseLoadCreated$: Observable<ICaseLoad>;

    constructor(public http: HttpClient) {
        super('/case-load', http);

        this.caseLoadCreatedSubject = new Subject();
        this.caseLoadCreated$ = this.caseLoadCreatedSubject.asObservable();
    }

    getEmptyCaseLoad(): ICaseLoad {
        return { ...emptyCaseLoad };
    }

    create(entity: ICaseLoad, options?: ICreateOptions): Observable<number> {
        return super.create(entity, options).pipe(
            tap(() => {
                this.caseLoadCreatedSubject.next(entity);
            }),
        );
    }

    getReasonForServiceOptions(providerId: number): Observable<IDiagnosisCode[]> {
        return this.http.get<IDiagnosisCode[]>(`/case-load/provider/${providerId}/reason-for-service-options`, {});
    }

    addProviderStudent(studentId: number): Observable<void> {
        return this.http.post<void>(`/case-load/provider/add`, studentId);
    }

    removeProviderStudent(providerStudentId: number): Observable<void> {
        return this.http.post<void>(`/case-load/provider/delete`, providerStudentId);
    }
}
