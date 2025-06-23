using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EncounterStudentCptCode
{
    public int Id { get; set; }

    public int EncounterStudentId { get; set; }

    public int CptCodeId { get; set; }

    public int? Minutes { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<ClaimsEncounter> ClaimsEncounterAggregates { get; set; } = new List<ClaimsEncounter>();

    public virtual ICollection<ClaimsEncounter> ClaimsEncounterEncounterStudentCptCodes { get; set; } = new List<ClaimsEncounter>();

    public virtual Cptcode CptCode { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EncounterStudent EncounterStudent { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }
}
