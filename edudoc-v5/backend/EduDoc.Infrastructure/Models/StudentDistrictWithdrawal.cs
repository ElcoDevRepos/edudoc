using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class StudentDistrictWithdrawal
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int DistrictId { get; set; }

    public DateTime? EnrollmentDate { get; set; }

    public DateTime? WithdrawalDate { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual SchoolDistrict District { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Student Student { get; set; } = null!;
}
