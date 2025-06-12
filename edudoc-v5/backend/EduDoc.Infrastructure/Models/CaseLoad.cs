using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class CaseLoad
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int StudentTypeId { get; set; }

    public int? ServiceCodeId { get; set; }

    public int StudentId { get; set; }

    public int? DiagnosisCodeId { get; set; }

    public int? DisabilityCodeId { get; set; }

    public DateTime? IepstartDate { get; set; }

    public DateTime? IependDate { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<CaseLoadCptCode> CaseLoadCptCodes { get; set; } = new List<CaseLoadCptCode>();

    public virtual ICollection<CaseLoadGoal> CaseLoadGoals { get; set; } = new List<CaseLoadGoal>();

    public virtual ICollection<CaseLoadMethod> CaseLoadMethods { get; set; } = new List<CaseLoadMethod>();

    public virtual ICollection<CaseLoadScript> CaseLoadScripts { get; set; } = new List<CaseLoadScript>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual DiagnosisCode? DiagnosisCode { get; set; }

    public virtual DisabilityCode? DisabilityCode { get; set; }

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ServiceCode? ServiceCode { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual ICollection<StudentTherapy> StudentTherapies { get; set; } = new List<StudentTherapy>();

    public virtual StudentType StudentType { get; set; } = null!;
}
