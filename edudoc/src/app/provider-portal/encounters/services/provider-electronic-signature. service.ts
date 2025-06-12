import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderElectronicSignaturesService {
    constructor(public http: HttpClient) {}

    getById(signatureId: number): Observable<IESignatureContent> {
        return this.http.get<IESignatureContent>(`/provider/electronic-signatures/${signatureId}`, { observe: 'body' });
    }
}
