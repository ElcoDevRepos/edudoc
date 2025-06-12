using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class AnnualEntry
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Year { get; set; } = null!;

    public int StatusId { get; set; }

    public string AllowableCosts { get; set; } = null!;

    public string InterimPayments { get; set; } = null!;

    public string SettlementAmount { get; set; } = null!;

    public string? Mer { get; set; }

    public string? Rmts { get; set; }

    public int SchoolDistrictId { get; set; }

    public bool Archived { get; set; }

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;

    public virtual AnnualEntryStatus Status { get; set; } = null!;
}
