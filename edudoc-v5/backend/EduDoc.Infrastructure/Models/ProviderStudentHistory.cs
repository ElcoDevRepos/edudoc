using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderStudentHistory
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public int StudentId { get; set; }

    public DateTime DateArchived { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
