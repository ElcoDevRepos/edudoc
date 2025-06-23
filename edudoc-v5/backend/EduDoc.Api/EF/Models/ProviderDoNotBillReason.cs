using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderDoNotBillReason
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Sort { get; set; }

    public virtual ICollection<ProviderInactivityDate> ProviderInactivityDates { get; set; } = new List<ProviderInactivityDate>();

    public virtual ICollection<Provider> Providers { get; set; } = new List<Provider>();

    public virtual ICollection<RevokeAccess> RevokeAccesses { get; set; } = new List<RevokeAccess>();
}
