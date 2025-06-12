using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EvaluationType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<CptcodeAssocation> CptcodeAssocations { get; set; } = new List<CptcodeAssocation>();

    public virtual ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();

    public virtual ICollection<EvaluationTypesDiagnosisCode> EvaluationTypesDiagnosisCodes { get; set; } = new List<EvaluationTypesDiagnosisCode>();
}
