using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AuditLogDetail
{
    public long Id { get; set; }

    public string PropertyName { get; set; } = null!;

    public string? OriginalValue { get; set; }

    public string? NewValue { get; set; }

    public long AuditLogId { get; set; }

    public virtual AuditLog AuditLog { get; set; } = null!;
}
