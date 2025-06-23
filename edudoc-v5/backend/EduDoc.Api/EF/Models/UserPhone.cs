using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class UserPhone
{
    public int UserId { get; set; }

    public string Phone { get; set; } = null!;

    public string Extension { get; set; } = null!;

    public int PhoneTypeId { get; set; }

    public bool IsPrimary { get; set; }

    public virtual PhoneType PhoneType { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
