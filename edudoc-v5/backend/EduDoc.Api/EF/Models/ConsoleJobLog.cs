using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ConsoleJobLog
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public bool IsError { get; set; }

    public string? StackTrace { get; set; }

    public string? ErrorMessage { get; set; }

    public int ConsoleJobTypeId { get; set; }

    public int? RelatedEntityId { get; set; }

    public virtual ConsoleJobType ConsoleJobType { get; set; } = null!;
}
