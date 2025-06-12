using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EncounterStudentMethod
{
    public int Id { get; set; }

    public int EncounterStudentId { get; set; }

    public int MethodId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EncounterStudent EncounterStudent { get; set; } = null!;

    public virtual Method Method { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }
}
