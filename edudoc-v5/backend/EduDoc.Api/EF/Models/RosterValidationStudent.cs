using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class RosterValidationStudent
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string LastName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string? IdentificationCode { get; set; }

    public string ReferenceId { get; set; } = null!;

    public string? RejectReasonCode { get; set; }

    public string? FollowUpActionCode { get; set; }

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string InsuredDateTimePeriod { get; set; } = null!;

    public int RosterValidationDistrictId { get; set; }

    public int StudentId { get; set; }

    public bool IsSuccessfullyProcessed { get; set; }

    public virtual RosterValidationDistrict RosterValidationDistrict { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
