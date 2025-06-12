using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class StudentType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsBillable { get; set; }

    public virtual ICollection<CaseLoad> CaseLoads { get; set; } = new List<CaseLoad>();
}
