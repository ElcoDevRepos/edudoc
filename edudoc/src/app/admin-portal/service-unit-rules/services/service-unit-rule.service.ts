import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { IServiceUnitTimeSegment } from '@model/interfaces/service-unit-time-segment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyServiceUnitRule: IServiceUnitRule = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    Description: '',
    EffectiveDate: null,
    HasReplacement: false,
    Id: 0,
    Name: null,
};

export const emptyServiceUnitTimeSegment: IServiceUnitTimeSegment = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    EndMinutes: null,
    Id: 0,
    IsCrossover: false,
    StartMinutes: 1,
    UnitDefinition: 1,
};

@Injectable({ providedIn: 'root' })
export class ServiceUnitRuleService extends BaseService<IServiceUnitRule> {
    ServiceUnitRule: BehaviorSubject<IServiceUnitRule> = new BehaviorSubject<IServiceUnitRule>(this.getEmptyServiceUnitRule());
    TimeSegments: BehaviorSubject<IServiceUnitTimeSegment[]> = new BehaviorSubject<IServiceUnitTimeSegment[]>([this.getEmptyServiceUnitTimeSegment()]);
    CrossoverTimeSegments: BehaviorSubject<IServiceUnitTimeSegment[]> = new BehaviorSubject<IServiceUnitTimeSegment[]>([this.getEmptyServiceUnitTimeSegment()]);

    setServiceUnitRule(value: IServiceUnitRule): void {
        this.ServiceUnitRule.next(value);
    }
    getServiceUnitRule(): Observable<IServiceUnitRule> {
        return this.ServiceUnitRule.asObservable();
    }

    setServiceTimeSegment(crossover: boolean, value: IServiceUnitTimeSegment[]): void {
        if (value) {
            crossover ? this.CrossoverTimeSegments.next(value) : this.TimeSegments.next(value);
        }
    }

    getServiceTimeSegment(crossover: boolean): Observable<IServiceUnitTimeSegment[]> {
        return crossover ? this.CrossoverTimeSegments.asObservable() : this.TimeSegments.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/service-unit-rules', http);
    }

    getEmptyServiceUnitRule(): IServiceUnitRule {
        return { ...emptyServiceUnitRule };
    }

    getEmptyServiceUnitTimeSegment(): IServiceUnitTimeSegment {
        return { ...emptyServiceUnitTimeSegment };
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/service-unit-rules/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    updateServiceUnitTimeSegments(segments: IServiceUnitTimeSegment[]): Observable<IServiceUnitTimeSegment[]> {
        return this.http.put<IServiceUnitTimeSegment[]>(`/service-unit-rules/time-segments/update-and-create`, segments).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    deleteTimeSegment(segmentId: number): Observable<void> {
        return this.http.delete<void>(`/service-unit-rules/time-segments/${segmentId}`);
    }
}
