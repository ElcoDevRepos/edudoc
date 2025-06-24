using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ConsoleJobType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ConsoleJobLog> ConsoleJobLogs { get; set; } = new List<ConsoleJobLog>();
}
