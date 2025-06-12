using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class DiagnosisCodeAssociation
{
    public int Id { get; set; }

    public int DiagnosisCodeId { get; set; }

    public int ServiceCodeId { get; set; }

    public int ServiceTypeId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual DiagnosisCode DiagnosisCode { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual ServiceCode ServiceCode { get; set; } = null!;

    public virtual ServiceType ServiceType { get; set; } = null!;
}
