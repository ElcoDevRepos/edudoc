using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ClaimsDistrict
{
    public int Id { get; set; }

    public string IdentificationCode { get; set; } = null!;

    public string DistrictOrganizationName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string EmployerId { get; set; } = null!;

    public int? Index { get; set; }

    public int HealthCareClaimsId { get; set; }

    public int SchoolDistrictId { get; set; }

    public virtual ICollection<ClaimsStudent> ClaimsStudents { get; set; } = new List<ClaimsStudent>();

    public virtual HealthCareClaim HealthCareClaims { get; set; } = null!;

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;
}
