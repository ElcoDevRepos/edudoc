using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderStudent
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public int StudentId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
