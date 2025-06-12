using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class Country
{
    public string CountryCode { get; set; } = null!;

    public string Alpha3Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
}
