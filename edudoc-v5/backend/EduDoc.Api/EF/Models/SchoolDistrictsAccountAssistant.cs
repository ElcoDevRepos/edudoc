using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class SchoolDistrictsAccountAssistant
{
    public int Id { get; set; }

    public int AccountAssistantId { get; set; }

    public int SchoolDistrictId { get; set; }

    public virtual User AccountAssistant { get; set; } = null!;

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
