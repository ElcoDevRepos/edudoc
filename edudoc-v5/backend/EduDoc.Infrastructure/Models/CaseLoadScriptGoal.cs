using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class CaseLoadScriptGoal
{
    public int Id { get; set; }

    public int CaseLoadScriptId { get; set; }

    public int GoalId { get; set; }

    public string? MedicationName { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual CaseLoadScript CaseLoadScript { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<EncounterStudentGoal> EncounterStudentGoals { get; set; } = new List<EncounterStudentGoal>();

    public virtual Goal Goal { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }
}
