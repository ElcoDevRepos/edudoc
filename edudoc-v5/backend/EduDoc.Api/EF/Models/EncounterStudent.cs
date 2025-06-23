using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EncounterStudent
{
    public int Id { get; set; }

    public int EncounterId { get; set; }

    public int StudentId { get; set; }

    public int EncounterStatusId { get; set; }

    public int EncounterLocationId { get; set; }

    public string? ReasonForReturn { get; set; }

    public string? EncounterNumber { get; set; }

    public int? CaseLoadId { get; set; }

    public int? StudentTherapyScheduleId { get; set; }

    public TimeOnly EncounterStartTime { get; set; }

    public TimeOnly EncounterEndTime { get; set; }

    public DateTime EncounterDate { get; set; }

    public string? SupervisorComments { get; set; }

    public string? EsignatureText { get; set; }

    public int? EsignedById { get; set; }

    public string? SupervisorEsignatureText { get; set; }

    public int? SupervisorEsignedById { get; set; }

    public DateTime? DateEsigned { get; set; }

    public DateTime? SupervisorDateEsigned { get; set; }

    public int? StudentDeviationReasonId { get; set; }

    public string? TherapyCaseNotes { get; set; }

    public string? AbandonmentNotes { get; set; }

    public bool IsTelehealth { get; set; }

    public int? DiagnosisCodeId { get; set; }

    public int? DocumentTypeId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<BillingFailure> BillingFailures { get; set; } = new List<BillingFailure>();

    public virtual CaseLoad? CaseLoad { get; set; }

    public virtual ICollection<ClaimsEncounter> ClaimsEncounters { get; set; } = new List<ClaimsEncounter>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual DiagnosisCode? DiagnosisCode { get; set; }

    public virtual DocumentType? DocumentType { get; set; }

    public virtual Encounter Encounter { get; set; } = null!;

    public virtual EncounterLocation EncounterLocation { get; set; } = null!;

    public virtual EncounterStatus EncounterStatus { get; set; } = null!;

    public virtual ICollection<EncounterStudentCptCode> EncounterStudentCptCodes { get; set; } = new List<EncounterStudentCptCode>();

    public virtual ICollection<EncounterStudentGoal> EncounterStudentGoals { get; set; } = new List<EncounterStudentGoal>();

    public virtual ICollection<EncounterStudentMethod> EncounterStudentMethods { get; set; } = new List<EncounterStudentMethod>();

    public virtual ICollection<EncounterStudentStatus> EncounterStudentStatuses { get; set; } = new List<EncounterStudentStatus>();

    public virtual User? EsignedBy { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual StudentDeviationReason? StudentDeviationReason { get; set; }

    public virtual StudentTherapySchedule? StudentTherapySchedule { get; set; }

    public virtual User? SupervisorEsignedBy { get; set; }
}
