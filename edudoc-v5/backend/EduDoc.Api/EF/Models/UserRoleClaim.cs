using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class UserRoleClaim
{
    public int RoleId { get; set; }

    public int ClaimTypeId { get; set; }

    public int ClaimValueId { get; set; }

    public virtual ClaimType ClaimType { get; set; } = null!;

    public virtual ClaimValue ClaimValue { get; set; } = null!;

    public virtual UserRole Role { get; set; } = null!;
}
