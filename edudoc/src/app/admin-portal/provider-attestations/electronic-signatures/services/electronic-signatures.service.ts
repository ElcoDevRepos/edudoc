import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { BaseService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ElectronicSignaturesService extends BaseService<IESignatureContent> {
    constructor(public http: HttpClient) {
        super('/admin/electronic-signatures', http);
    }
}
