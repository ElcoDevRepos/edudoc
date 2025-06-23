using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AgencyType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ProviderEscAssignment> ProviderEscAssignments { get; set; } = new List<ProviderEscAssignment>();
}
