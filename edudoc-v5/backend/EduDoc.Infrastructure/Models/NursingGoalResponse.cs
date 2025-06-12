using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class NursingGoalResponse
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ResponseNoteLabel { get; set; }

    public bool ResponseNote { get; set; }

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public virtual ICollection<NursingGoalResult> NursingGoalResults { get; set; } = new List<NursingGoalResult>();
}
