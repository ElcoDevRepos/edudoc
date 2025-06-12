using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class BillingScheduleExcludedServiceCode
{
    public int Id { get; set; }

    public int ServiceCodeId { get; set; }

    public int BillingScheduleId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual BillingSchedule BillingSchedule { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ServiceCode ServiceCode { get; set; } = null!;
}
