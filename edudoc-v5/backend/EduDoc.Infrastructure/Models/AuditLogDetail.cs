using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class AuditLogDetail
{
    public long Id { get; set; }

    public string PropertyName { get; set; } = null!;

    public string? OriginalValue { get; set; }

    public string? NewValue { get; set; }

    public long AuditLogId { get; set; }

    public virtual AuditLog AuditLog { get; set; } = null!;
}
