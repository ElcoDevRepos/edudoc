using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EdiErrorCodeAdminNotification
{
    public int Id { get; set; }

    public int AdminId { get; set; }

    public bool Archived { get; set; }

    public virtual User Admin { get; set; } = null!;
}
