using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderInactivityReason
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Code { get; set; }
}
