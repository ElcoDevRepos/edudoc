using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderAcknowledgmentLog
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public DateTime DateAcknowledged { get; set; }

    public virtual Provider Provider { get; set; } = null!;
}
