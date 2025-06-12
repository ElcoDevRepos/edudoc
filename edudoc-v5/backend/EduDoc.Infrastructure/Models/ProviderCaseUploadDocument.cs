using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderCaseUploadDocument
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int DistrictId { get; set; }

    public DateTime DateUpload { get; set; }

    public int? UploadedBy { get; set; }

    public string FilePath { get; set; } = null!;

    public DateTime? DateProcessed { get; set; }

    public DateTime? DateError { get; set; }

    public virtual SchoolDistrict District { get; set; } = null!;

    public virtual ICollection<ProviderCaseUpload> ProviderCaseUploads { get; set; } = new List<ProviderCaseUpload>();

    public virtual User? UploadedByNavigation { get; set; }
}
