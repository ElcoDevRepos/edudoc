using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ActivitySummaryServiceArea
{
    public int Id { get; set; }

    public int ServiceAreaId { get; set; }

    public int ReferralsPending { get; set; }

    public int EncountersReturned { get; set; }

    public int PendingSupervisorCoSign { get; set; }

    public int PendingEvaluations { get; set; }

    public int OpenScheduledEncounters { get; set; }

    public DateTime DateCreated { get; set; }

    public int? CreatedById { get; set; }

    public int? ActivitySummaryDistrictId { get; set; }

    public virtual ActivitySummaryDistrict? ActivitySummaryDistrict { get; set; }

    public virtual ICollection<ActivitySummaryProvider> ActivitySummaryProviders { get; set; } = new List<ActivitySummaryProvider>();

    public virtual User? CreatedBy { get; set; }

    public virtual ServiceCode ServiceArea { get; set; } = null!;
}
