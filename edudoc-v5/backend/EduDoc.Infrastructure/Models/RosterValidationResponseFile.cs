using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class RosterValidationResponseFile
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime DateUploaded { get; set; }

    public string FilePath { get; set; } = null!;

    public int? UploadedById { get; set; }

    public int RosterValidationFileId { get; set; }

    public virtual RosterValidationFile RosterValidationFile { get; set; } = null!;

    public virtual User? UploadedBy { get; set; }
}
