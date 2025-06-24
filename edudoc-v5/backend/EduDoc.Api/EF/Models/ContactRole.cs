using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ContactRole
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? Sort { get; set; }

    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
}
