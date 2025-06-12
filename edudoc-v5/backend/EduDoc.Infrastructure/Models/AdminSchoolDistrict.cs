using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class AdminSchoolDistrict
{
    public int Id { get; set; }

    public int AdminId { get; set; }

    public int SchoolDistrictId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual User Admin { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
