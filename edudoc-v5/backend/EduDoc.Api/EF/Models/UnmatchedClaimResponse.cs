using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class UnmatchedClaimResponse
{
    public int Id { get; set; }

    public string ProcedureIdentifier { get; set; } = null!;

    public string ClaimAmount { get; set; } = null!;

    public string? PaidAmount { get; set; }

    public DateTime ServiceDate { get; set; }

    public string? PatientFirstName { get; set; }

    public string? PatientLastName { get; set; }

    public string PatientId { get; set; } = null!;

    public int? EdiErrorCodeId { get; set; }

    public int? DistrictId { get; set; }

    public int? UnmatchedDistrictId { get; set; }

    public int ResponseFileId { get; set; }

    public string? ClaimId { get; set; }

    public DateTime? VoucherDate { get; set; }

    public string? ReferenceNumber { get; set; }

    public string? AdjustmentReasonCode { get; set; }

    public string? AdjustmentAmount { get; set; }

    public virtual SchoolDistrict? District { get; set; }

    public virtual EdiErrorCode? EdiErrorCode { get; set; }

    public virtual BillingResponseFile ResponseFile { get; set; } = null!;

    public virtual UnmatchedClaimDistrict? UnmatchedDistrict { get; set; }
}
