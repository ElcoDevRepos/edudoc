using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class HealthCareClaim
{
    public int Id { get; set; }

    public DateTime DateCreated { get; set; }

    public int PageCount { get; set; }

    public int? BillingScheduleId { get; set; }

    public virtual ICollection<BillingFile> BillingFiles { get; set; } = new List<BillingFile>();

    public virtual BillingSchedule? BillingSchedule { get; set; }

    public virtual ICollection<ClaimsDistrict> ClaimsDistricts { get; set; } = new List<ClaimsDistrict>();

    public virtual ICollection<ClaimsEncounter> ClaimsEncounters { get; set; } = new List<ClaimsEncounter>();
}
