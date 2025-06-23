using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ActivitySummaryProvider
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public string ProviderName { get; set; } = null!;

    public int ReferralsPending { get; set; }

    public int EncountersReturned { get; set; }

    public int PendingSupervisorCoSign { get; set; }

    public int PendingEvaluations { get; set; }

    public DateTime DateCreated { get; set; }

    public int? CreatedById { get; set; }

    public int? ActivitySummaryServiceAreaId { get; set; }

    public virtual ActivitySummaryServiceArea? ActivitySummaryServiceArea { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual Provider Provider { get; set; } = null!;
}
