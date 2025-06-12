using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EncounterReturnReasonCategory
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<EncounterReasonForReturn> EncounterReasonForReturns { get; set; } = new List<EncounterReasonForReturn>();
}
