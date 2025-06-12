import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProviderTraining } from '@model/interfaces/provider-training';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderTrainingsService extends BaseService<IProviderTraining> {
    constructor(public http: HttpClient) {
        super('/provider-trainings', http);
    }

    remindProvider(providerTrainingId: number): Observable<void> {
        return this.http.post<void>(`/provider-trainings/remind`, providerTrainingId);
    }

    remindAll(): Observable<void> {
        return this.http.get<void>(`/provider-trainings/remindAll`);
    }

}
