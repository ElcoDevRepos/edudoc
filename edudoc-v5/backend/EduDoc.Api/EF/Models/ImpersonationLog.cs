using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ImpersonationLog
{
    public int Id { get; set; }

    public int AuthTokenId { get; set; }

    public DateTime? DateCreated { get; set; }

    public int ImpersonaterId { get; set; }

    public virtual User Impersonater { get; set; } = null!;
}
