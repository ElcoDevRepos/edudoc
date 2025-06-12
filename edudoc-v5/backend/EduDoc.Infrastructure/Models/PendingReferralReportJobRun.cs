using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class PendingReferralReportJobRun
{
    public int Id { get; set; }

    public DateTime JobRunDate { get; set; }

    public int JobRunById { get; set; }

    public virtual User JobRunBy { get; set; } = null!;

    public virtual ICollection<PendingReferral> PendingReferrals { get; set; } = new List<PendingReferral>();
}
