import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEdiErrorCode } from '@model/interfaces/edi-error-code';
import { BaseService } from '@mt-ng2/base-service';

export const emptyEdiErrorCode: IEdiErrorCode = {
    Archived: false,
    CreatedById: 0,
    EdiFileTypeId: null,
    ErrorCode: null,
    Id: 0,
    Name: null,
};

@Injectable({ providedIn: 'root' })
export class EdiResponseErrorCodesService extends BaseService<IEdiErrorCode> {
    constructor(public http: HttpClient) {
        super('/edi-error-codes', http);
    }

    getEmptyEdiErrorCode(): IEdiErrorCode {
        return { ...emptyEdiErrorCode };
    }
}
