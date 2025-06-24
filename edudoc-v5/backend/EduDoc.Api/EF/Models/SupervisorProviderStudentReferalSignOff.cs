using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class SupervisorProviderStudentReferalSignOff
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int SupervisorId { get; set; }

    public int StudentId { get; set; }

    public string? SignOffText { get; set; }

    public DateTime? SignOffDate { get; set; }

    public int? SignedOffById { get; set; }

    public int? ServiceCodeId { get; set; }

    public DateTime? EffectiveDateFrom { get; set; }

    public DateTime? EffectiveDateTo { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual ServiceCode? ServiceCode { get; set; }

    public virtual User? SignedOffBy { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual Provider Supervisor { get; set; } = null!;
}
