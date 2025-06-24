using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Goal
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public int? NursingResponseId { get; set; }

    public virtual ICollection<CaseLoadGoal> CaseLoadGoals { get; set; } = new List<CaseLoadGoal>();

    public virtual ICollection<CaseLoadScriptGoal> CaseLoadScriptGoals { get; set; } = new List<CaseLoadScriptGoal>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<EncounterStudentGoal> EncounterStudentGoals { get; set; } = new List<EncounterStudentGoal>();

    public virtual User? ModifiedBy { get; set; }

    public virtual NursingGoalResponse? NursingResponse { get; set; }

    public virtual ICollection<ServiceOutcome> ServiceOutcomes { get; set; } = new List<ServiceOutcome>();

    public virtual ICollection<ServiceCode> ServiceCodes { get; set; } = new List<ServiceCode>();
}
