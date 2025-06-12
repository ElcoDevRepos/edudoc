using Model;
using Model.DTOs;
using System;
using System.Collections.Generic;

namespace Service.Vouchers
{
    public interface IVoucherService
    {
        int CreateVoucher(Voucher voucher);
        int UpdateVoucher(int id, Voucher voucher);
        int CheckForUnknownVouchers(Voucher voucher);
        (IEnumerable<ClaimVoucherDTO> vouchers, int count) SearchForVouchers(Model.Core.CRUDSearchParams csp);
        int ArchiveVoucher(int id);
        int RemoveClaimVoucher(int id);
        ClaimsEncounter GetClaimVoucher(int id);
        ClaimsEncounter UpdateClaimVoucher(ClaimVoucherUpdateDTO claim);
    }
}

