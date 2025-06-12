using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class NursingGoalResult
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool ResultsNote { get; set; }

    public bool Archived { get; set; }

    public virtual ICollection<EncounterStudentGoal> EncounterStudentGoals { get; set; } = new List<EncounterStudentGoal>();

    public virtual ICollection<NursingGoalResponse> NursingGoalResponses { get; set; } = new List<NursingGoalResponse>();
}
