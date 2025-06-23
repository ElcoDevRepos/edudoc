using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderStudentSupervisor
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int AssistantId { get; set; }

    public int SupervisorId { get; set; }

    public int StudentId { get; set; }

    public DateTime EffectiveStartDate { get; set; }

    public DateTime? EffectiveEndDate { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual Provider Assistant { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual Provider Supervisor { get; set; } = null!;
}
