using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AnnualEntryStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<AnnualEntry> AnnualEntries { get; set; } = new List<AnnualEntry>();
}
