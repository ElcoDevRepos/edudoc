using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderLicense
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public string License { get; set; } = null!;

    public DateTime AsOfDate { get; set; }

    public DateTime ExpirationDate { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;
}
