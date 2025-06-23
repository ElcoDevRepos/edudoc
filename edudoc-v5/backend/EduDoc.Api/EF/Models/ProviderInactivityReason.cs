using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderInactivityReason
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Code { get; set; }
}
