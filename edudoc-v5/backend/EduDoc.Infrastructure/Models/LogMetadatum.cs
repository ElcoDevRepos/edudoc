using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class LogMetadatum
{
    public long Id { get; set; }

    public long AuditLogId { get; set; }

    public string? Key { get; set; }

    public string? Value { get; set; }
}
