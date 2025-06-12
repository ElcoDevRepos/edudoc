using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class SchoolDistrictsFinancialRep
{
    public int Id { get; set; }

    public int FinancialRepId { get; set; }

    public int SchoolDistrictId { get; set; }

    public virtual User FinancialRep { get; set; } = null!;

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
