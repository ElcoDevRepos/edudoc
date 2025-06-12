using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderEscSchoolDistrict
{
    public int Id { get; set; }

    public int ProviderEscAssignmentId { get; set; }

    public int SchoolDistrictId { get; set; }

    public virtual ProviderEscAssignment ProviderEscAssignment { get; set; } = null!;

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
