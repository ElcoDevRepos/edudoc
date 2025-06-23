using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Document
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime DateUpload { get; set; }

    public int? UploadedBy { get; set; }

    public string FilePath { get; set; } = null!;

    public virtual ICollection<SchoolDistrict> SchoolDistricts { get; set; } = new List<SchoolDistrict>();

    public virtual User? UploadedByNavigation { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
