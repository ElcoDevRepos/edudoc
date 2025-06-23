using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Voucher
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public DateTime VoucherDate { get; set; }

    public string VoucherAmount { get; set; } = null!;

    public string PaidAmount { get; set; } = null!;

    public string? ServiceCode { get; set; }

    public int? SchoolDistrictId { get; set; }

    public int? UnmatchedClaimDistrictId { get; set; }

    public string SchoolYear { get; set; } = null!;

    public int VoucherTypeId { get; set; }

    public bool Archived { get; set; }

    public virtual SchoolDistrict? SchoolDistrict { get; set; }

    public virtual UnmatchedClaimDistrict? UnmatchedClaimDistrict { get; set; }

    public virtual ICollection<VoucherBillingResponseFile> VoucherBillingResponseFiles { get; set; } = new List<VoucherBillingResponseFile>();

    public virtual VoucherType VoucherType { get; set; } = null!;
}
