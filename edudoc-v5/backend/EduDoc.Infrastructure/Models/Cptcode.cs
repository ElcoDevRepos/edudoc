using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class Cptcode
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Description { get; set; } = null!;

    public decimal BillAmount { get; set; }

    public int? ServiceUnitRuleId { get; set; }

    public bool Rndefault { get; set; }

    public bool Lpndefault { get; set; }

    public string? Notes { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<BillingScheduleExcludedCptCode> BillingScheduleExcludedCptCodes { get; set; } = new List<BillingScheduleExcludedCptCode>();

    public virtual ICollection<CaseLoadCptCode> CaseLoadCptCodes { get; set; } = new List<CaseLoadCptCode>();

    public virtual ICollection<CptcodeAssocation> CptcodeAssocations { get; set; } = new List<CptcodeAssocation>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<EncounterStudentCptCode> EncounterStudentCptCodes { get; set; } = new List<EncounterStudentCptCode>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ServiceUnitRule? ServiceUnitRule { get; set; }

    public virtual ICollection<ServiceUnitRule> ServiceUnitRules { get; set; } = new List<ServiceUnitRule>();
}
