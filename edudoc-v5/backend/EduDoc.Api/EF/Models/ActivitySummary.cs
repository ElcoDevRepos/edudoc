using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ActivitySummary
{
    public int Id { get; set; }

    public int ReferralsPending { get; set; }

    public int EncountersReturned { get; set; }

    public int PendingSupervisorCoSign { get; set; }

    public int PendingEvaluations { get; set; }

    public DateTime DateCreated { get; set; }

    public int CreatedById { get; set; }

    public virtual ICollection<ActivitySummaryDistrict> ActivitySummaryDistricts { get; set; } = new List<ActivitySummaryDistrict>();

    public virtual User CreatedBy { get; set; } = null!;
}
