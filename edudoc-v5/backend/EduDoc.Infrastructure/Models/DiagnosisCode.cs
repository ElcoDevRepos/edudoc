using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class DiagnosisCode
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? EffectiveDateFrom { get; set; }

    public DateTime? EffectiveDateTo { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<CaseLoadScript> CaseLoadScripts { get; set; } = new List<CaseLoadScript>();

    public virtual ICollection<CaseLoad> CaseLoads { get; set; } = new List<CaseLoad>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<DiagnosisCodeAssociation> DiagnosisCodeAssociations { get; set; } = new List<DiagnosisCodeAssociation>();

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();

    public virtual ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();

    public virtual ICollection<EvaluationTypesDiagnosisCode> EvaluationTypesDiagnosisCodes { get; set; } = new List<EvaluationTypesDiagnosisCode>();

    public virtual User? ModifiedBy { get; set; }
}
