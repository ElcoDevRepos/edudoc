using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class Agency
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ProviderEscAssignment> ProviderEscAssignments { get; set; } = new List<ProviderEscAssignment>();
}
