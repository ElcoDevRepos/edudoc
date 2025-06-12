using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class RosterValidation
{
    public int Id { get; set; }

    public DateTime DateCreated { get; set; }

    public int PageCount { get; set; }

    public virtual ICollection<RosterValidationDistrict> RosterValidationDistricts { get; set; } = new List<RosterValidationDistrict>();

    public virtual ICollection<RosterValidationFile> RosterValidationFiles { get; set; } = new List<RosterValidationFile>();
}
