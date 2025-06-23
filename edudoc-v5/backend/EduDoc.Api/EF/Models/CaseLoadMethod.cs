using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class CaseLoadMethod
{
    public int Id { get; set; }

    public int CaseLoadId { get; set; }

    public int MethodId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual CaseLoad CaseLoad { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Method Method { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }
}
