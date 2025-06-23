using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ClaimsStudent
{
    public int Id { get; set; }

    public string LastName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string IdentificationCode { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string InsuredDateTimePeriod { get; set; } = null!;

    public bool? ResponseValid { get; set; }

    public int? ResponseRejectReason { get; set; }

    public string? ResponseFollowUpAction { get; set; }

    public int ClaimsDistrictId { get; set; }

    public int StudentId { get; set; }

    public virtual ClaimsDistrict ClaimsDistrict { get; set; } = null!;

    public virtual ICollection<ClaimsEncounter> ClaimsEncounters { get; set; } = new List<ClaimsEncounter>();

    public virtual Student Student { get; set; } = null!;
}
