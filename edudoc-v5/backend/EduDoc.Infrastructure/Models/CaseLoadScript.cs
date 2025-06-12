using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class CaseLoadScript
{
    public int Id { get; set; }

    public string Npi { get; set; } = null!;

    public int? DiagnosisCodeId { get; set; }

    public string DoctorFirstName { get; set; } = null!;

    public string DoctorLastName { get; set; } = null!;

    public DateTime InitiationDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public int CaseLoadId { get; set; }

    public bool Archived { get; set; }

    public int? UploadedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime DateUpload { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual CaseLoad CaseLoad { get; set; } = null!;

    public virtual ICollection<CaseLoadScriptGoal> CaseLoadScriptGoals { get; set; } = new List<CaseLoadScriptGoal>();

    public virtual DiagnosisCode? DiagnosisCode { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual User? UploadedBy { get; set; }
}
