import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAcknowledgement } from '@model/interfaces/acknowledgement';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AcknowledgmentsService extends BaseService<IAcknowledgement> {
    constructor(public http: HttpClient) {
        super('/acknowledgments', http);
    }

    updateProviderAcknowledgmentStatus(userId: number): Observable<number> {
        return this.http.post<number>(`/providers/acknowledgment/${userId}`, {
            acknowledged: true,
        });
    }

    getAcknowledgmentForProvider(): Observable<IAcknowledgement> {
        return this.http.get<IAcknowledgement>(`/providers/get-acknowledgment`);
    }
}
