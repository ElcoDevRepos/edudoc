using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ContactStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Sort { get; set; }

    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
}
