import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { IClaimVoucherUpdateDTO } from '@model/interfaces/custom/claim-voucher-update.dto';
import { IClaimVoucherDTO } from '@model/interfaces/custom/claim-voucher.dto';
import { IVoucher } from '@model/interfaces/voucher';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable, Subject } from 'rxjs';

export const emptyVoucher: IVoucher = {
    Archived: false,
    Id: 0,
    PaidAmount: null,
    SchoolDistrictId: 0,
    SchoolYear: null,
    ServiceCode: '',
    VoucherAmount: null,
    VoucherDate: null,
    VoucherTypeId: 2,
};

@Injectable({
    providedIn: 'root',
})
export class VoucherService extends BaseService<IVoucher> {
    protected voucherArchiveUpdateSource = new Subject<void>();
    voucherArchiveUpdated$: Observable<void> = this.voucherArchiveUpdateSource.asObservable();

    constructor(public http: HttpClient) {
        super('/vouchers', http);
    }

    getEmptyVoucher(): IVoucher {
        return { ...emptyVoucher };
    }

    getVouchers(csp: SearchParams): Observable<HttpResponse<IClaimVoucherDTO[]>> {
        return this.http.get<IClaimVoucherDTO[]>(`/vouchers/get-vouchers`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getVoucherById(id: number): Observable<IVoucher> {
        return this.http.get<IVoucher>(`/vouchers/get-by-id/${id}`);
    }

    removeVoucher(id: number): Observable<number> {
        return this.http.post<number>(`/vouchers/archive/${id}`, {});
    }

    updateVoucher(voucher: IVoucher): Observable<number> {
        return this.http.put<number>(`/vouchers/${voucher.Id}`, voucher);
    }

    emitVoucherArchived(): void {
        this.voucherArchiveUpdateSource.next();
    }

    getClaimVoucherById(id: number): Observable<IClaimsEncounter> {
        return this.http.get<IClaimsEncounter>(`/vouchers/get-claim/${id}`);
    }

    updateClaimVoucher(claim: IClaimVoucherUpdateDTO): Observable<IClaimsEncounter> {
        return this.http.put<IClaimsEncounter>(`/vouchers/update-claim`, claim );
    }

    removeClaimVoucher(id: number): Observable<number> {
        return this.http.post<number>(`/vouchers/remove-claim/${id}`, {});
    }
}
