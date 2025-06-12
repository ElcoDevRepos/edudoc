using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class SchoolDistrictsSchool
{
    public int Id { get; set; }

    public int SchoolDistrictId { get; set; }

    public int SchoolId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual School School { get; set; } = null!;

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
