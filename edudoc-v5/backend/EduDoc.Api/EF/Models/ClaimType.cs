using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ClaimType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Alias { get; set; }

    public int? ParentId { get; set; }

    public bool IsVisible { get; set; }

    public virtual ICollection<UserRoleClaim> UserRoleClaims { get; set; } = new List<UserRoleClaim>();

    public virtual ICollection<UserType> UserTypes { get; set; } = new List<UserType>();
}
