using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ServiceUnitRule
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int? CptCodeId { get; set; }

    public DateTime? EffectiveDate { get; set; }

    public bool HasReplacement { get; set; }

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual Cptcode? CptCode { get; set; }

    public virtual ICollection<Cptcode> Cptcodes { get; set; } = new List<Cptcode>();

    public virtual User? CreatedBy { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<ServiceUnitTimeSegment> ServiceUnitTimeSegments { get; set; } = new List<ServiceUnitTimeSegment>();
}
