using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AuthClient
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public byte[] Secret { get; set; } = null!;

    public byte[] Salt { get; set; } = null!;

    public string? Description { get; set; }

    public int AuthApplicationTypeId { get; set; }

    public int RefreshTokenMinutes { get; set; }

    public string AllowedOrigin { get; set; } = null!;

    public virtual AuthApplicationType AuthApplicationType { get; set; } = null!;

    public virtual ICollection<AuthToken> AuthTokens { get; set; } = new List<AuthToken>();
}
