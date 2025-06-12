using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EncounterStudentGoal
{
    public int Id { get; set; }

    public int EncounterStudentId { get; set; }

    public int GoalId { get; set; }

    public string? ServiceOutcomes { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public string? NursingResponseNote { get; set; }

    public string? NursingResultNote { get; set; }

    public int? NursingGoalResultId { get; set; }

    public int? CaseLoadScriptGoalId { get; set; }

    public virtual CaseLoadScriptGoal? CaseLoadScriptGoal { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EncounterStudent EncounterStudent { get; set; } = null!;

    public virtual Goal Goal { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual NursingGoalResult? NursingGoalResult { get; set; }
}
