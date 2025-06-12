using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class UserType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public virtual ICollection<ClaimType> ClaimTypes { get; set; } = new List<ClaimType>();
}
