using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class AuthToken
{
    public int Id { get; set; }

    public byte[] IdentifierKey { get; set; } = null!;

    public byte[] Salt { get; set; } = null!;

    public int AuthUserId { get; set; }

    public int AuthClientId { get; set; }

    public DateTime IssuedUtc { get; set; }

    public DateTime ExpiresUtc { get; set; }

    public string Token { get; set; } = null!;

    public virtual AuthClient AuthClient { get; set; } = null!;

    public virtual AuthUser AuthUser { get; set; } = null!;
}
