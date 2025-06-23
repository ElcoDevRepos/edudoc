using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class BillingFile
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime DateCreated { get; set; }

    public string FilePath { get; set; } = null!;

    public int? ClaimsCount { get; set; }

    public int PageNumber { get; set; }

    public int? CreatedById { get; set; }

    public int HealthCareClaimId { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual HealthCareClaim HealthCareClaim { get; set; } = null!;
}
