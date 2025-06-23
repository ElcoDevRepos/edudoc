using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EncounterIdentifier
{
    public int Id { get; set; }

    public int Counter { get; set; }

    public DateOnly DateCreated { get; set; }

    public int SchoolDistrictId { get; set; }

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
