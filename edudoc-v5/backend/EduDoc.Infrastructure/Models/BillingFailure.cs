using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class BillingFailure
{
    public int Id { get; set; }

    public int EncounterStudentId { get; set; }

    public int BillingFailureReasonId { get; set; }

    public int? BillingScheduleId { get; set; }

    public DateTime DateOfFailure { get; set; }

    public bool IssueResolved { get; set; }

    public DateTime? DateResolved { get; set; }

    public int? ResolvedById { get; set; }

    public virtual BillingFailureReason BillingFailureReason { get; set; } = null!;

    public virtual BillingSchedule? BillingSchedule { get; set; }

    public virtual EncounterStudent EncounterStudent { get; set; } = null!;

    public virtual User? ResolvedBy { get; set; }
}
