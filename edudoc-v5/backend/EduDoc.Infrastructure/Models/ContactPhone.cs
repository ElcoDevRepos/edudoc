using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ContactPhone
{
    public int ContactId { get; set; }

    public string Phone { get; set; } = null!;

    public string Extension { get; set; } = null!;

    public int PhoneTypeId { get; set; }

    public bool IsPrimary { get; set; }

    public virtual Contact Contact { get; set; } = null!;

    public virtual PhoneType PhoneType { get; set; } = null!;
}
