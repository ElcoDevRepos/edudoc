using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class RosterValidationFile
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime DateCreated { get; set; }

    public string FilePath { get; set; } = null!;

    public int PageNumber { get; set; }

    public int? CreatedById { get; set; }

    public int RosterValidationId { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual RosterValidation RosterValidation { get; set; } = null!;

    public virtual ICollection<RosterValidationResponseFile> RosterValidationResponseFiles { get; set; } = new List<RosterValidationResponseFile>();
}
