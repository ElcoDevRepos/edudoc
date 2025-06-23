using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AuditLogRelationship
{
    public long Id { get; set; }

    public long AuditLogId { get; set; }

    public string TypeFullName { get; set; } = null!;

    public string? KeyName { get; set; }

    public string KeyValue { get; set; } = null!;

    public virtual AuditLog AuditLog { get; set; } = null!;
}
