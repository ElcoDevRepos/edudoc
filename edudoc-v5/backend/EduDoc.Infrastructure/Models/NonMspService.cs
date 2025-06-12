using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class NonMspService
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();
}
