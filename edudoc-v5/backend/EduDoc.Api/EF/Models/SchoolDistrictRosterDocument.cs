using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class SchoolDistrictRosterDocument
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int SchoolDistrictId { get; set; }

    public DateTime DateUpload { get; set; }

    public int? UploadedBy { get; set; }

    public string FilePath { get; set; } = null!;

    public DateTime? DateProcessed { get; set; }

    public DateTime? DateError { get; set; }

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;

    public virtual ICollection<SchoolDistrictRoster> SchoolDistrictRosters { get; set; } = new List<SchoolDistrictRoster>();

    public virtual User? UploadedByNavigation { get; set; }
}
