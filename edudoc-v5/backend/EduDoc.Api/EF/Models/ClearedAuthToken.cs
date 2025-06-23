using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ClearedAuthToken
{
    public int Id { get; set; }

    public byte[] IdentifierKey { get; set; } = null!;

    public byte[] Salt { get; set; } = null!;

    public int AuthUserId { get; set; }

    public int AuthClientId { get; set; }

    public DateTime IssuedUtc { get; set; }

    public DateTime ExpiresUtc { get; set; }

    public string Token { get; set; } = null!;

    public DateTime ClearedDate { get; set; }
}
