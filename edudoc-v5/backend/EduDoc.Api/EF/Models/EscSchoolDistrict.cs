using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EscSchoolDistrict
{
    public int Id { get; set; }

    public int EscId { get; set; }

    public int SchoolDistrictId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Esc Esc { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
