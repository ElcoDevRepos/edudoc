using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderInactivityDate
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public DateTime ProviderInactivityStartDate { get; set; }

    public DateTime? ProviderInactivityEndDate { get; set; }

    public int ProviderDoNotBillReasonId { get; set; }

    public bool Archived { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual ProviderDoNotBillReason ProviderDoNotBillReason { get; set; } = null!;
}
