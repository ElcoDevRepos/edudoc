using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ServiceUnitTimeSegment
{
    public int Id { get; set; }

    public int UnitDefinition { get; set; }

    public int StartMinutes { get; set; }

    public int? EndMinutes { get; set; }

    public bool IsCrossover { get; set; }

    public int? ServiceUnitRuleId { get; set; }

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual ServiceUnitRule? ServiceUnitRule { get; set; }
}
