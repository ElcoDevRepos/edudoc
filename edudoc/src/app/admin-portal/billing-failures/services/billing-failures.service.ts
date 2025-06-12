import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBillingFailure } from '@model/interfaces/billing-failure';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { BaseService } from '@mt-ng2/base-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BillingFailuresService extends BaseService<IBillingFailure> {
    failureId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    setFailureResolvedId(value: number): void {
        this.failureId.next(value);
    }

    getFailureResolvedId(): Observable<number> {
        return this.failureId.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/billing-failures', http);
    }

    resolveFailure(billingFailureId: number): Observable<number> {
        return this.http.post<number>(`/billing-failures/resolve`, billingFailureId);
    }

    resolveAllFailures(): Observable<number> {
        return this.http.get<number>(`/billing-failures/resolveAll`);
    }

    getFailureReasons(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/billing-failures/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
