using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class SchoolDistrictProviderCaseNote
{
    public int Id { get; set; }

    public int SchoolDistrictId { get; set; }

    public int ProviderTitleId { get; set; }

    public virtual ProviderTitle ProviderTitle { get; set; } = null!;

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
