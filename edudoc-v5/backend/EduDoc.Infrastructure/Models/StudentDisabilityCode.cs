using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class StudentDisabilityCode
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int DisabilityCodeId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual DisabilityCode DisabilityCode { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Student Student { get; set; } = null!;
}
