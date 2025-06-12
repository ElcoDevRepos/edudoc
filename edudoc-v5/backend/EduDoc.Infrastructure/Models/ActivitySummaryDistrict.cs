using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ActivitySummaryDistrict
{
    public int Id { get; set; }

    public int DistrictId { get; set; }

    public int ReferralsPending { get; set; }

    public int EncountersReturned { get; set; }

    public int PendingSupervisorCoSign { get; set; }

    public int EncountersReadyForScheduling { get; set; }

    public int PendingEvaluations { get; set; }

    public DateTime DateCreated { get; set; }

    public int? CreatedById { get; set; }

    public int? ActivitySummaryId { get; set; }

    public virtual ActivitySummary? ActivitySummary { get; set; }

    public virtual ICollection<ActivitySummaryServiceArea> ActivitySummaryServiceAreas { get; set; } = new List<ActivitySummaryServiceArea>();

    public virtual User? CreatedBy { get; set; }

    public virtual SchoolDistrict District { get; set; } = null!;
}
