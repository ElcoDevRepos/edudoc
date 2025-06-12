using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderOdecertification
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public DateTime AsOfDate { get; set; }

    public DateTime ExpirationDate { get; set; }

    public string CertificationNumber { get; set; } = null!;

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;
}
