using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class State
{
    public string StateCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
}
