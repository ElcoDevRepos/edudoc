using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class PhoneType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ContactPhone> ContactPhones { get; set; } = new List<ContactPhone>();

    public virtual ICollection<UserPhone> UserPhones { get; set; } = new List<UserPhone>();
}
