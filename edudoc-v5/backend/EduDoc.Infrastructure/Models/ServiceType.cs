using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ServiceType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public virtual ICollection<CptcodeAssocation> CptcodeAssocations { get; set; } = new List<CptcodeAssocation>();

    public virtual ICollection<DiagnosisCodeAssociation> DiagnosisCodeAssociations { get; set; } = new List<DiagnosisCodeAssociation>();

    public virtual ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();

    public virtual ICollection<PendingReferral> PendingReferrals { get; set; } = new List<PendingReferral>();
}
