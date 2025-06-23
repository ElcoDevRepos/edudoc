using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AuthUser
{
    public int Id { get; set; }

    /// <summary>
    /// Username can be email or other.
    /// </summary>
    public string Username { get; set; } = null!;

    public byte[] Password { get; set; } = null!;

    public byte[] Salt { get; set; } = null!;

    public byte[] ResetKey { get; set; } = null!;

    public DateTime ResetKeyExpirationUtc { get; set; }

    /// <summary>
    /// FK:UserRole
    /// </summary>
    public int RoleId { get; set; }

    public bool HasAccess { get; set; }

    public bool IsEditable { get; set; }

    public bool HasLoggedIn { get; set; }

    public virtual ICollection<AuthToken> AuthTokens { get; set; } = new List<AuthToken>();

    public virtual UserRole Role { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
