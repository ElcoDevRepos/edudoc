using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class BillingScheduleExcludedCptCode
{
    public int Id { get; set; }

    public int CptCodeId { get; set; }

    public int BillingScheduleId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual BillingSchedule BillingSchedule { get; set; } = null!;

    public virtual Cptcode CptCode { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;
}
