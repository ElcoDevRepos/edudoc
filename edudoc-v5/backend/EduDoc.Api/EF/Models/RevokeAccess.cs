using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class RevokeAccess
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public DateTime Date { get; set; }

    public int? RevocationReasonId { get; set; }

    public string? OtherReason { get; set; }

    public bool? AccessGranted { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual ProviderDoNotBillReason? RevocationReason { get; set; }
}
