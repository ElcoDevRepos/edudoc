using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class BillingResponseFile
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime DateUploaded { get; set; }

    public DateTime? DateProcessed { get; set; }

    public string FilePath { get; set; } = null!;

    public int? UploadedById { get; set; }

    public virtual ICollection<UnmatchedClaimDistrict> UnmatchedClaimDistricts { get; set; } = new List<UnmatchedClaimDistrict>();

    public virtual ICollection<UnmatchedClaimResponse> UnmatchedClaimResponses { get; set; } = new List<UnmatchedClaimResponse>();

    public virtual User? UploadedBy { get; set; }

    public virtual ICollection<VoucherBillingResponseFile> VoucherBillingResponseFiles { get; set; } = new List<VoucherBillingResponseFile>();
}
