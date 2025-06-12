using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class BillingSchedule
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime ScheduledDate { get; set; }

    public bool IsReversal { get; set; }

    public bool IsSchedule { get; set; }

    public string? Notes { get; set; }

    public bool InQueue { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<BillingFailure> BillingFailures { get; set; } = new List<BillingFailure>();

    public virtual ICollection<BillingScheduleAdminNotification> BillingScheduleAdminNotifications { get; set; } = new List<BillingScheduleAdminNotification>();

    public virtual ICollection<BillingScheduleDistrict> BillingScheduleDistricts { get; set; } = new List<BillingScheduleDistrict>();

    public virtual ICollection<BillingScheduleExcludedCptCode> BillingScheduleExcludedCptCodes { get; set; } = new List<BillingScheduleExcludedCptCode>();

    public virtual ICollection<BillingScheduleExcludedProvider> BillingScheduleExcludedProviders { get; set; } = new List<BillingScheduleExcludedProvider>();

    public virtual ICollection<BillingScheduleExcludedServiceCode> BillingScheduleExcludedServiceCodes { get; set; } = new List<BillingScheduleExcludedServiceCode>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<HealthCareClaim> HealthCareClaims { get; set; } = new List<HealthCareClaim>();

    public virtual ICollection<JobsAudit> JobsAudits { get; set; } = new List<JobsAudit>();

    public virtual User? ModifiedBy { get; set; }
}
