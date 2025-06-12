using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProgressReport
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool? Progress { get; set; }

    public string? ProgressNotes { get; set; }

    public bool? MedicalStatusChange { get; set; }

    public string? MedicalStatusChangeNotes { get; set; }

    public bool? TreatmentChange { get; set; }

    public string? TreatmentChangeNotes { get; set; }

    public int? EsignedById { get; set; }

    public int? SupervisorEsignedById { get; set; }

    public DateTime? DateEsigned { get; set; }

    public DateTime? SupervisorDateEsigned { get; set; }

    public int? Quarter { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? EsignedBy { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual User? SupervisorEsignedBy { get; set; }
}
