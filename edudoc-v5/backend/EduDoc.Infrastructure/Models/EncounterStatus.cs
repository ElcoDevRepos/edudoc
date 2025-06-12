using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EncounterStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsAuditable { get; set; }

    public bool IsBillable { get; set; }

    public bool ForReview { get; set; }

    public bool HpcadminOnly { get; set; }

    public virtual ICollection<EncounterStudentStatus> EncounterStudentStatuses { get; set; } = new List<EncounterStudentStatus>();

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();
}
