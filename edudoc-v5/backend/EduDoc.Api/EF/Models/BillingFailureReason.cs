using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class BillingFailureReason
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<BillingFailure> BillingFailures { get; set; } = new List<BillingFailure>();
}
