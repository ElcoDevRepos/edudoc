using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class UnmatchedClaimDistrict
{
    public int Id { get; set; }

    public int ResponseFileId { get; set; }

    public string IdentificationCode { get; set; } = null!;

    public string DistrictOrganizationName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string EmployerId { get; set; } = null!;

    public virtual BillingResponseFile ResponseFile { get; set; } = null!;

    public virtual ICollection<UnmatchedClaimResponse> UnmatchedClaimResponses { get; set; } = new List<UnmatchedClaimResponse>();

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
