using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class RosterValidationDistrict
{
    public int Id { get; set; }

    public string IdentificationCode { get; set; } = null!;

    public string DistrictOrganizationName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string EmployerId { get; set; } = null!;

    public int? SegmentsCount { get; set; }

    public int? Index { get; set; }

    public int RosterValidationId { get; set; }

    public int SchoolDistrictId { get; set; }

    public virtual RosterValidation RosterValidation { get; set; } = null!;

    public virtual ICollection<RosterValidationStudent> RosterValidationStudents { get; set; } = new List<RosterValidationStudent>();

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
