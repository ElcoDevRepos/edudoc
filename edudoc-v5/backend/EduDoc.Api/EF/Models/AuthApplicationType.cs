using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class AuthApplicationType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<AuthClient> AuthClients { get; set; } = new List<AuthClient>();
}
