using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EvaluationTypesDiagnosisCode
{
    public int Id { get; set; }

    public int EvaluationTypeId { get; set; }

    public int DiagnosisCodeId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual DiagnosisCode DiagnosisCode { get; set; } = null!;

    public virtual EvaluationType EvaluationType { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }
}
