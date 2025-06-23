using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EncounterStudentStatus
{
    public int Id { get; set; }

    public int EncounterStudentId { get; set; }

    public int EncounterStatusId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EncounterStatus EncounterStatus { get; set; } = null!;

    public virtual EncounterStudent EncounterStudent { get; set; } = null!;
}
