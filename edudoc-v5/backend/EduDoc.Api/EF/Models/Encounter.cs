using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Encounter
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public int ServiceTypeId { get; set; }

    public int? NonMspServiceTypeId { get; set; }

    public int? EvaluationTypeId { get; set; }

    public DateTime? EncounterDate { get; set; }

    public TimeOnly? EncounterStartTime { get; set; }

    public TimeOnly? EncounterEndTime { get; set; }

    public bool IsGroup { get; set; }

    public int AdditionalStudents { get; set; }

    public bool FromSchedule { get; set; }

    public int? DiagnosisCodeId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual DiagnosisCode? DiagnosisCode { get; set; }

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();

    public virtual EvaluationType? EvaluationType { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual NonMspService? NonMspServiceType { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual ServiceType ServiceType { get; set; } = null!;
}
