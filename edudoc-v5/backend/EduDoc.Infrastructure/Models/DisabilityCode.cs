using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class DisabilityCode
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<CaseLoad> CaseLoads { get; set; } = new List<CaseLoad>();

    public virtual ICollection<StudentDisabilityCode> StudentDisabilityCodes { get; set; } = new List<StudentDisabilityCode>();
}
