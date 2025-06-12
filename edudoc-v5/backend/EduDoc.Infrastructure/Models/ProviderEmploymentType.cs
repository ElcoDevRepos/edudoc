using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderEmploymentType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Provider> Providers { get; set; } = new List<Provider>();
}
