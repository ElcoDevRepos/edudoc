using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class JobsAudit
{
    public int Id { get; set; }

    public int FileType { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public int? BillingScheduleId { get; set; }

    public int? CreatedById { get; set; }

    public virtual BillingSchedule? BillingSchedule { get; set; }

    public virtual User? CreatedBy { get; set; }
}
