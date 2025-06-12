using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ClaimValue
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<UserRoleClaim> UserRoleClaims { get; set; } = new List<UserRoleClaim>();
}
