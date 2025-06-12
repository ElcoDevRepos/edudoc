using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class BillingScheduleExcludedProvider
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public int BillingScheduleId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual BillingSchedule BillingSchedule { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;
}
