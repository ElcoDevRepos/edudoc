using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class CptcodeAssocation
{
    public int Id { get; set; }

    public int CptcodeId { get; set; }

    public int ServiceCodeId { get; set; }

    public int ServiceTypeId { get; set; }

    public int ProviderTitleId { get; set; }

    public int? EvaluationTypeId { get; set; }

    public bool IsGroup { get; set; }

    public bool Default { get; set; }

    public bool IsTelehealth { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual Cptcode Cptcode { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EvaluationType? EvaluationType { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual ProviderTitle ProviderTitle { get; set; } = null!;

    public virtual ServiceCode ServiceCode { get; set; } = null!;

    public virtual ServiceType ServiceType { get; set; } = null!;
}
