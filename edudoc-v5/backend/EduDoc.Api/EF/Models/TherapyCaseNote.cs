using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class TherapyCaseNote
{
    public int Id { get; set; }

    public string Notes { get; set; } = null!;

    public int CreatedById { get; set; }

    public int ProviderId { get; set; }

    public DateTime DateCreated { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;
}
