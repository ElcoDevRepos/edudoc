using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class UserRole
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public bool IsEditable { get; set; }

    public int UserTypeId { get; set; }

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual ICollection<AuthUser> AuthUsers { get; set; } = new List<AuthUser>();

    public virtual User? CreatedBy { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<UserRoleClaim> UserRoleClaims { get; set; } = new List<UserRoleClaim>();

    public virtual UserType UserType { get; set; } = null!;
}
